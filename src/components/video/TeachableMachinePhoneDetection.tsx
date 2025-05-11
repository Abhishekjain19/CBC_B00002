import React, { useEffect, useRef } from "react";

// Helper to load external scripts
function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

const TM_MODEL_URL = "https://teachablemachine.withgoogle.com/models/eIoLxChHF/model.json";
const TM_METADATA_URL = "https://teachablemachine.withgoogle.com/models/eIoLxChHF/metadata.json";
const ALERT_PROB_THRESHOLD = 0.5;
const ALERT_COOLDOWN_MS = 5000;

function notifyTeacher() {
  // Extend this to use WebSocket or HTTP request as needed
  console.log("⚠️ Phone usage detected!");
}

const TeachableMachinePhoneDetection: React.FC<{
  videoEl?: HTMLVideoElement;
  videoId?: string;
  onPhoneDetected?: () => void;
}> = ({ videoEl, videoId = "zorgo-local-video", onPhoneDetected }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let model: any = null;
    let rafId: number | null = null;
    let video: HTMLVideoElement | null = null;
    let lastAlertTime = 0;

    async function loadModel() {
      await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js");
      await loadScript("https://cdn.jsdelivr.net/npm/@teachablemachine/image@0.8/dist/teachablemachine-image.min.js");
      // @ts-ignore
      model = await window.tmImage.load(TM_MODEL_URL, TM_METADATA_URL);
      waitForVideoAndStart();
    }

    function resizeCanvas() {
      if (video && canvasRef.current && video.videoWidth && video.videoHeight) {
        canvasRef.current.width = video.videoWidth;
        canvasRef.current.height = video.videoHeight;
      }
    }

    function drawBox(ctx: CanvasRenderingContext2D, label: string, prob: number) {
      ctx.save();
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 4;
      ctx.globalAlpha = 0.9;
      ctx.strokeRect(10, 10, canvasRef.current!.width - 20, canvasRef.current!.height - 20);

      ctx.font = 'bold 20px sans-serif';
      ctx.fillStyle = 'red';
      ctx.globalAlpha = 0.8;
      ctx.fillRect(10, 10, ctx.measureText(label).width + 60, 28);

      ctx.globalAlpha = 1.0;
      ctx.fillStyle = '#fff';
      ctx.fillText(`${label} (${(prob*100).toFixed(1)}%)`, 18, 30);
      ctx.restore();
    }

    async function detectFrame() {
      if (video && video.readyState === 4 && model && canvasRef.current) {
        resizeCanvas();
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // @ts-ignore
        const prediction = await model.predict(video);
        console.log('Predictions:', prediction);
        // Find the class with the highest probability
        const best = prediction.reduce((a: any, b: any) => (a.probability > b.probability ? a : b));
        console.log('Best class:', best.className, 'Probability:', best.probability);
        if (best.className.toLowerCase().includes("phone") && best.probability > ALERT_PROB_THRESHOLD) {
          drawBox(ctx, "Phone detected", best.probability);
          const now = Date.now();
          if (now - lastAlertTime > ALERT_COOLDOWN_MS) {
            notifyTeacher();
            if (onPhoneDetected) onPhoneDetected();
            lastAlertTime = now;
          }
        }
      }
      rafId = requestAnimationFrame(detectFrame);
    }

    function startDetection() {
      if (!video) return;
      if (video.readyState === 4) {
        detectFrame();
      } else {
        video.onloadeddata = () => detectFrame();
      }
    }

    function waitForVideoAndStart() {
      if (videoEl) {
        video = videoEl;
        startDetection();
        return;
      }
      video = document.getElementById(videoId) as HTMLVideoElement;
      if (video) {
        startDetection();
      } else {
        // Wait for video to appear
        const observer = new MutationObserver(() => {
          video = document.getElementById(videoId) as HTMLVideoElement;
          if (video) {
            observer.disconnect();
            startDetection();
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
      }
    }

    loadModel();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [videoEl, videoId, onPhoneDetected]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 2,
      }}
    />
  );
};

export default TeachableMachinePhoneDetection; 