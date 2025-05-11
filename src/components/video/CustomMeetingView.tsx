import React, { useRef, useEffect, useState } from "react";
import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";

const ParticipantView = ({ participantId }: { participantId: string }) => {
  const { webcamStream, webcamOn, micOn, displayName } = useParticipant(participantId);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && webcamOn && webcamStream) {
      videoRef.current.srcObject = webcamStream as unknown as MediaStream;
    }
  }, [webcamStream, webcamOn]);

  return (
    <div style={{ border: "1px solid #ccc", margin: 8, padding: 8, borderRadius: 8, minWidth: 220 }}>
      <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{displayName}</div>
      {webcamOn && webcamStream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ width: 200, height: 150, background: "#000", borderRadius: 4 }}
        />
      ) : (
        <div style={{ width: 200, height: 150, background: "#222", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4 }}>
          Camera Off
        </div>
      )}
      <div style={{ marginTop: 4 }}>
        <span style={{ color: micOn ? 'green' : 'red', fontWeight: 'bold' }}>
          {micOn ? 'Mic On' : 'Mic Off'}
        </span>
      </div>
    </div>
  );
};

const CustomMeetingView = () => {
  const { participants, join, leave, toggleMic, toggleWebcam, localParticipant } = useMeeting();
  const joined = localParticipant && participants.has(localParticipant.id);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string }[]>([]);
  const [mediaError, setMediaError] = useState<string | null>(null);

  // Debug info for local participant
  useEffect(() => {
    if (localParticipant) {
      // Check for webcam/mic state
      if (!localParticipant.webcamOn) {
        setMediaError("Webcam is OFF or not accessible.");
      } else if (!localParticipant.micOn) {
        setMediaError("Mic is OFF or not accessible.");
      } else {
        setMediaError(null);
      }
    } else {
      setMediaError("Local participant not initialized.");
    }
  }, [localParticipant]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      setChatMessages([...chatMessages, { sender: "You", text: chatInput }]);
      setChatInput("");
    }
  };

  // Render local participant first
  const participantIds = localParticipant ? [localParticipant.id, ...[...participants.keys()].filter(id => id !== localParticipant.id)] : [...participants.keys()];

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: 24 }}>
      <div style={{ flex: 2 }}>
        {/* Debug Info */}
        <div style={{ marginBottom: 8, padding: 8, background: '#fef3c7', borderRadius: 4, color: '#92400e', fontSize: 14 }}>
          <div><b>Debug Info:</b></div>
          <div>Local Participant: {localParticipant ? 'Yes' : 'No'}</div>
          <div>Webcam: {localParticipant?.webcamOn ? 'ON' : 'OFF'}</div>
          <div>Mic: {localParticipant?.micOn ? 'ON' : 'OFF'}</div>
          <div>Joined: {joined ? 'Yes' : 'No'}</div>
          {mediaError && <div style={{ color: 'red' }}>Media Error: {mediaError}</div>}
        </div>
        <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
          <button onClick={join} disabled={joined} style={{ padding: 8, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, cursor: joined ? 'not-allowed' : 'pointer' }}>Join</button>
          <button onClick={leave} style={{ padding: 8, background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4 }}>Leave</button>
          <button onClick={() => toggleMic()} style={{ padding: 8, background: joined ? '#10b981' : '#d1d5db', color: '#fff', border: 'none', borderRadius: 4 }}>{localParticipant?.micOn ? 'Mute Mic' : 'Unmute Mic'}</button>
          <button onClick={() => toggleWebcam()} style={{ padding: 8, background: joined ? '#f59e42' : '#d1d5db', color: '#fff', border: 'none', borderRadius: 4 }}>{localParticipant?.webcamOn ? 'Turn Off Camera' : 'Turn On Camera'}</button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {participantIds.map(participantId => (
            <ParticipantView key={participantId} participantId={participantId} />
          ))}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 300, background: '#f3f4f6', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', height: 400 }}>
        <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Class Chat (local demo)</div>
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: 8, background: '#fff', borderRadius: 4, padding: 8, border: '1px solid #e5e7eb' }}>
          {chatMessages.length === 0 ? (
            <div style={{ color: '#6b7280', textAlign: 'center', marginTop: 32 }}>No messages yet</div>
          ) : (
            chatMessages.map((msg, idx) => (
              <div key={idx} style={{ marginBottom: 6 }}><b>{msg.sender}:</b> {msg.text}</div>
            ))
          )}
        </div>
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            placeholder="Type a message..."
            style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #d1d5db' }}
          />
          <button type="submit" style={{ padding: 8, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4 }}>Send</button>
        </form>
      </div>
    </div>
  );
};

export default CustomMeetingView; 