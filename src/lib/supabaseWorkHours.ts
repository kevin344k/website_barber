import { supabase } from './supabaseClient';

export async function getWorkHoursFromDB() {
  const { data, error } = await supabase.from('work_hours').select('*').single();
  if (error || !data) {
    // Valor por defecto si no hay registro
    return { start: '09:00', end: '19:00' };
  }
  return { start: data.start_time, end: data.end_time };
}

export async function saveWorkHoursToDB(start: string, end: string) {
  // Solo un registro, id=1
  const { error } = await supabase.from('work_hours').upsert({ id: 1, start_time: start, end_time: end }, { onConflict: 'id' });
  return !error;
}