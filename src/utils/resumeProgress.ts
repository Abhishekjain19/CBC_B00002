export function updateResumeProgress() {
  // Get current count
  let count = Number(sessionStorage.getItem('resumePromptsCount') || 0);
  if (count < 5) count++;
  sessionStorage.setItem('resumePromptsCount', String(count));
  if (count >= 5) sessionStorage.setItem('resumePromptsCompleted', 'complete');
  else sessionStorage.removeItem('resumePromptsCompleted');
} 