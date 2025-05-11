import React, { useRef, useEffect, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import TeachableMachinePhoneDetection from "./TeachableMachinePhoneDetection";

const ZegoMeetingRoom = ({
  roomID,
  userID,
  userName,
  userType,
  onEndClass
}: {
  roomID: string,
  userID: string,
  userName: string,
  userType: 'student' | 'teacher' | null,
  onEndClass?: () => void
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const zpRef = useRef<any>(null);
  const [inRoom, setInRoom] = useState(true);
  const [studentVideoEls, setStudentVideoEls] = useState<HTMLVideoElement[]>([]);
  const detectionContainerRef = useRef<HTMLDivElement>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);

  useEffect(() => {
    console.log('ZegoMeetingRoom useEffect', { roomID, userID, userName });
    if (containerRef.current) {
      try {
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          1834495394, // App ID
          "7425eb53775b3c615d745b5dac446117", // Server Secret
          roomID,
          userID,
          userName
        );
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zpRef.current = zp;
        zp.joinRoom({
          container: containerRef.current,
          sharedLinks: [
            {
              name: 'Copy Link',
              url: window.location.origin + window.location.pathname + `?roomID=${roomID}`,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.VideoConference,
          },
          turnOnCameraWhenJoining: true,
          turnOnMicrophoneWhenJoining: true,
          showPreJoinView: true,
          showTextChat: true,
          showScreenSharingButton: true,
          onLeaveRoom: () => {
            setInRoom(false);
            if (onEndClass) onEndClass();
          }
        });
        console.log('ZegoUIKitPrebuilt initialized');
      } catch (err) {
        console.error('ZegoUIKitPrebuilt error:', err);
      }
    } else {
      console.error('ZegoMeetingRoom: containerRef.current is null');
    }
    // Cleanup on unmount
    return () => {
      if (zpRef.current) {
        zpRef.current.destroy();
      }
    };
  }, [roomID, userID, userName, onEndClass]);

  // Teacher: Find all student video elements and overlay detection
  useEffect(() => {
    if (userType !== "teacher") return;
    function findStudentVideos() {
      const allVideos = Array.from(document.querySelectorAll("video"));
      // Filter out muted videos (likely teacher's own)
      const studentEls = allVideos.filter((v) => !v.muted);
      setStudentVideoEls(studentEls);
    }
    const observer = new MutationObserver(findStudentVideos);
    observer.observe(document.body, { childList: true, subtree: true });
    findStudentVideos();
    return () => observer.disconnect();
  }, [userType]);

  const handleEndClass = () => {
    if (zpRef.current) {
      zpRef.current.sendCustomCommand({ type: "END_CLASS" });
      zpRef.current.destroy();
      setInRoom(false);
      if (onEndClass) onEndClass();
    }
  };

  if (!inRoom) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl font-bold text-red-600">Class has ended.</div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Custom Controls */}
      <div style={{ position: "absolute", top: 16, left: 16, zIndex: 20, display: "flex", gap: 8 }}>
        {userType === "teacher" && (
          <button
            onClick={handleEndClass}
            style={{
              background: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "8px 16px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            End Class
          </button>
        )}
      </div>
      <div ref={containerRef} style={{ width: '100%', height: '600px' }} />
      {/* Detection overlays for each student video (teacher only) */}
      {userType === "teacher" && (
        <div ref={detectionContainerRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 20 }}>
          {studentVideoEls.map((videoEl, idx) => {
            // Get bounding rect for absolute positioning
            const rect = videoEl.getBoundingClientRect();
            const parentRect = detectionContainerRef.current?.getBoundingClientRect();
            const style = parentRect && rect ? {
              position: "absolute" as const,
              top: rect.top - parentRect.top,
              left: rect.left - parentRect.left,
              width: rect.width,
              height: rect.height,
              pointerEvents: "none" as const,
              zIndex: 20,
            } : { display: "none" };
            return (
              <div key={idx} style={style}>
                <TeachableMachinePhoneDetection
                  videoEl={videoEl}
                  onPhoneDetected={() => {
                    alert(`Teacher: Phone detected in student video`);
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ZegoMeetingRoom; 