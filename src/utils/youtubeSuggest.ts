export async function fetchYouTubeVideo(topic: string, section: string) {
  // For demo, return a static video or use YouTube Data API for real results
  return {
    title: `Learn ${topic} in ${section}`,
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' ' + section + ' data structures algorithms')}`
  };
} 