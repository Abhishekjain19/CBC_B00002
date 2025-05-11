import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Video as VideoIcon, VideoOff, Phone, Users, MessageSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import ZegoMeetingRoom from "./ZegoMeetingRoom";
import { useStudentStreak } from "@/context/StudentStreakContext";
// import { MeetingView } from "@videosdk.live/react-uikit";

interface ClassSession {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  startTime: Date;
  status: 'scheduled' | 'live' | 'ended';
}

interface VideoClassRoomProps {
  session: ClassSession;
  onLeave: () => void;
  userType: 'student' | 'teacher' | null;
}

const VIDEOSDK_API_KEY = "9e49b685-9d29-4edc-be6b-18b60a13dd9c";
function getMeetingId(session: ClassSession) {
  return `class-${session.id}`;
}

const VideoClassRoom = ({ session, onLeave, userType }: VideoClassRoomProps) => {
  const [meetingId] = useState(getMeetingId(session));
  const { markAttendance, attendedToday } = useStudentStreak();

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{session.title}</h1>
            <p className="text-gray-600">{session.subject} - {session.teacher}</p>
          </div>
          <Button 
            onClick={onLeave} 
            variant="destructive"
            size="sm"
            className="bg-red-500 hover:bg-red-600"
          >
            <Phone className="h-4 w-4 mr-2" /> Leave Class
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main video section */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-lg aspect-video relative overflow-hidden">
              <ZegoMeetingRoom
                roomID={`class-${session.id}`}
                userID={userType ? `${userType}-${session.id}` : `user-${session.id}`}
                userName={userType === "teacher" ? "Teacher" : "Student"}
                userType={userType}
                onEndClass={onLeave}
              />
            </div>
          </div>
          {/* Side panel for participants or chat (optional, can keep or remove) */}
          <div className="lg:col-span-1">
            <Card className="h-[calc(100vh-250px)] flex flex-col">
              <div className="bg-gray-100 p-3 border-b">
                <h2 className="font-medium">Class Chat</h2>
              </div>
              <CardContent className="p-0 flex-1 overflow-hidden">
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-auto p-4 space-y-4">
                    {/* You can integrate VideoSDK chat or keep your own */}
                    <div className="text-center text-gray-500 py-8">
                      No messages yet
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {userType === "student" && (
          <div className="my-4">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={markAttendance}
              disabled={attendedToday}
            >
              {attendedToday ? "Attendance Marked" : "Mark your attendance"}
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default VideoClassRoom;
