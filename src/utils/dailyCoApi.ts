// Daily.co API utility

import DailyIframe from '@daily-co/daily-js';

const DAILY_API_KEY = 'a75af41277293b6cffaa7392644c829caebd7676d86f92d5255faa00d74307e8';
const DAILY_BASE_URL = 'https://api.daily.co/v1';
const DAILY_DOMAIN = 'a001.daily.co';

export async function createMeetingRoom(roomName: string, expiryMinutes: number = 60): Promise<string> {
  try {
    // Try to fetch the room first
    const getResponse = await fetch(`${DAILY_BASE_URL}/rooms/${roomName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DAILY_API_KEY}`
      }
    });

    if (getResponse.ok) {
      // Room exists, return its URL
      return `https://${DAILY_DOMAIN}/${roomName}`;
    }

    // If not found, create the room
    const createResponse = await fetch(`${DAILY_BASE_URL}/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DAILY_API_KEY}`
      },
      body: JSON.stringify({
        name: roomName,
        properties: {
          exp: Math.floor(Date.now() / 1000) + expiryMinutes * 60
        }
      })
    });

    const data = await createResponse.json();
    if (!createResponse.ok) {
      console.error('Daily.co API error:', data);
      throw new Error(`API error: ${createResponse.status} - ${data.error}`);
    }
    return `https://${DAILY_DOMAIN}/${data.name}`;
  } catch (error) {
    console.error('Error creating Daily.co room:', error);
    throw error;
  }
}

export function getDailyIframe(url: string, element: HTMLDivElement | null) {
  if (!element) return null;
  const callFrame = DailyIframe.createFrame(element, {
    showLeaveButton: true,
    iframeStyle: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      border: '0',
    },
  });
  callFrame.join({ url });
  return callFrame;
}
