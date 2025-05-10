
// Daily.co API utility

const DAILY_API_KEY = 'a75af41277293b6cffaa7392644c829caebd7676d86f92d5255faa00d74307e8';
const DAILY_BASE_URL = 'https://api.daily.co/v1';

export async function createMeetingRoom(roomName: string, expiryMinutes: number = 60): Promise<string> {
  try {
    const response = await fetch(`${DAILY_BASE_URL}/rooms`, {
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Daily.co API error:', errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return `https://${data.properties.domain}/${data.name}`;
  } catch (error) {
    console.error('Error creating Daily.co room:', error);
    throw error;
  }
}

export function getDailyIframe(url: string, element: HTMLDivElement | null) {
  if (!element) return null;
  
  return new Promise((resolve) => {
    // This would use the actual Daily.co iframe API
    // In a real implementation, you would load the script and create the iframe
    // For now, we'll just return a simulated iframe setup
    
    // In a real implementation you would use something like:
    // const script = document.createElement('script');
    // script.src = 'https://unpkg.com/@daily-co/daily-js';
    // script.onload = () => { ... initialize daily call frame ... };
    // document.head.appendChild(script);
    
    console.log("Daily.co iframe would be created for URL:", url);
    resolve({
      join: () => console.log("Joining call at:", url),
      leave: () => console.log("Leaving call")
    });
  });
}
