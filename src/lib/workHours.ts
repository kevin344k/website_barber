// src/lib/workHours.ts

export function saveWorkHours(start: string, end: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('workStart', start);
    localStorage.setItem('workEnd', end);
  }
}

export function getWorkHours(): { start: string; end: string } {
  if (typeof window !== 'undefined') {
    const start = localStorage.getItem('workStart') || '09:00';
    const end = localStorage.getItem('workEnd') || '19:00';
    return { start, end };
  }
  return { start: '09:00', end: '19:00' };
}
