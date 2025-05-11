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

const ZorgoPhoneDetection: React.FC<{
  onPhoneDetected?: () => void,
  videoId?: string,
  videoEl?: HTMLVideoElement
}> = ({ onPhoneDetected, videoId = "zorgo-local-video", videoEl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let model: any = null;
    let lastWarned = 0;
    let rafId: number | null = null;
    let video: HTMLVideoElement | null = null;
    let observer: MutationObserver | null = null;

    async function loadModel() {
      console.log("Loading TensorFlow.js and COCO-SSD...");
      await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js");
      await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd");
      // @ts-ignore
      model = await window.cocoSsd.load();
      console.log("COCO-SSD model loaded.");
      waitForVideoAndStart();
    }

    function resizeCanvas() {
      if (video && canvasRef.current && video.videoWidth && video.videoHeight) {
        canvasRef.current.width = video.videoWidth;
        canvasRef.current.height = video.videoHeight;
      }
    }

    function drawBox(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, label: string, score: number) {
      ctx.save();
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 4;
      ctx.globalAlpha = 0.9;
      ctx.strokeRect(x, y, w, h);

      ctx.font = 'bold 20px sans-serif';
      ctx.fillStyle = 'red';
      ctx.globalAlpha = 0.8;
      ctx.fillRect(x, y - 28, ctx.measureText(label).width + 60, 28);

      ctx.globalAlpha = 1.0;
      ctx.fillStyle = '#fff';
      ctx.fillText(`${label} (${(score*100).toFixed(1)}%)`, x + 8, y - 8);
      ctx.restore();
    }

    async function detectFrame() {
      if (video && video.readyState === 4 && model && canvasRef.current) {
        resizeCanvas();
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        const predictions = await model.detect(video);
        predictions.forEach((pred: any) => {
          if (pred.class === "cell phone" && pred.score > 0.6) {
            const [x, y, w, h] = pred.bbox;
            drawBox(ctx, x, y, w, h, "Phone detected", pred.score);
            if (Date.now() - lastWarned > 2000) {
              if (onPhoneDetected) {
                onPhoneDetected();
              } else {
                alert("Phone detected!");
              }
              lastWarned = Date.now();
            }
            console.log("Cell phone confidence:", pred.score);
          }
        });
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
        console.log(`Found video element with id "${videoId}".`);
        startDetection();
      } else {
        // Use MutationObserver to wait for the video element to appear
        observer = new MutationObserver(() => {
          video = document.getElementById(videoId) as HTMLVideoElement;
          if (video) {
            console.log(`Video element with id "${videoId}" appeared in DOM.`);
            observer?.disconnect();
            startDetection();
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
      }
    }

    loadModel();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
    };
  }, [onPhoneDetected, videoId, videoEl]);

  return (
    <canvas
      ref={canvasRef}
      id="detection-canvas"
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

export default ZorgoPhoneDetection; 