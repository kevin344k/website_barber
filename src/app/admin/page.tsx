
"use client";

import { useState, useEffect } from 'react';
import { getWorkHoursFromDB, saveWorkHoursToDB } from '../../lib/supabaseWorkHours';
import { supabase } from '../../lib/supabaseClient';

interface Slot {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  available: boolean;
}

interface Appointment {
  id: number;
  name: string;
  surname: string;
  email: string;
  scheduled_at: string;
  status: string;
}

export default function AdminPage() {
  // const [slots, setSlots] = useState<Slot[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [workStart, setWorkStart] = useState('09:00');
  const [workEnd, setWorkEnd] = useState('19:00');

  // Eliminar cita (debe estar dentro del componente para acceder a fetchAppointments)
  const deleteAppointment = async (id: number) => {
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (!error) fetchAppointments();
  };
  const [pendingStart, setPendingStart] = useState('09:00');
  const [pendingEnd, setPendingEnd] = useState('19:00');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAppointments();
    // Cargar horario guardado en Supabase
    getWorkHoursFromDB().then(({ start, end }) => {
      setWorkStart(start);
      setWorkEnd(end);
      setPendingStart(start);
      setPendingEnd(end);
    });
  }, []);



  const fetchAppointments = async () => {
    const { data, error } = await supabase.from('appointments').select('*');
    if (error) {
      console.error(error);
    } else {
      setAppointments(data || []);
    }
  };





  const updateAppointmentStatus = async (id: number, status: string) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id);
    if (error) {
      setMessage('Error actualizando cita');
    } else {
      fetchAppointments();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Panel de Administrador</h1>

      {/* Panel para modificar horario de trabajo */}
      <div className="mb-8">
        <h2 className="text-xl mb-2">Horario de Trabajo</h2>
        <form className="flex flex-col sm:flex-row gap-4 items-center" onSubmit={e => e.preventDefault()}>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Desde:</label>
            <input
              type="time"
              value={pendingStart}
              onChange={e => setPendingStart(e.target.value)}
              className="border p-2 rounded"
              min="00:00"
              max="23:59"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Hasta:</label>
            <input
              type="time"
              value={pendingEnd}
              onChange={e => setPendingEnd(e.target.value)}
              className="border p-2 rounded"
              min="00:00"
              max="23:59"
            />
          </div>
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow transition"
            onClick={async () => {
              setWorkStart(pendingStart);
              setWorkEnd(pendingEnd);
              await saveWorkHoursToDB(pendingStart, pendingEnd);
              setMessage('Horario actualizado');
              setTimeout(() => setMessage(''), 2000);
            }}
          >
            Programar horario
          </button>
          <span className="text-gray-500 text-sm">(Se refleja en el calendario de citas)</span>
        </form>
        {message && <div className="text-green-600 font-semibold mt-2 animate-fade-in-down">{message}</div>}
      </div>

      <div>
        <h2 className="text-xl mb-2">Citas Agendadas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {appointments
            .slice()
            .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())
            .map((appt) => (
              <div key={appt.id} className="bg-white border border-blue-100 rounded-2xl shadow-lg p-5 flex flex-col gap-2 hover:shadow-2xl transition-all duration-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-blue-700 font-bold text-lg capitalize truncate">{appt.name || 'Sin nombre'}</span>
                  {appt.status === 'pending' && <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-1 rounded-full ml-auto">Pendiente</span>}
                  {appt.status === 'accepted' && <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full ml-auto">Aceptada</span>}
                  {appt.status === 'rejected' && <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full ml-auto">Rechazada</span>}
                </div>
                <div className="text-gray-600 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  {new Date(appt.scheduled_at).toLocaleString()}
                </div>
                {/* Puedes mostrar más info si lo deseas */}
                {/* <div className="text-gray-500 text-xs">ID: {appt.id}</div> */}
                {appt.status === 'pending' && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => updateAppointmentStatus(appt.id, 'accepted')}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded-lg font-bold shadow transition"
                    >
                      Aceptar
                    </button>
                    <button
                      onClick={() => updateAppointmentStatus(appt.id, 'rejected')}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded-lg font-bold shadow transition"
                    >
                      Rechazar
                    </button>
                  </div>
                )}
                {(appt.status === 'accepted' || appt.status === 'rejected') && (
                  <button
                    onClick={() => deleteAppointment(appt.id)}
                    title="Eliminar cita"
                    className="ml-auto mt-2 flex items-center justify-center text-red-500 hover:text-red-700 transition p-2 rounded-full hover:bg-red-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m5 0H6" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}