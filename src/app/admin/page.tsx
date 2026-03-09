"use client";

import { useState, useEffect } from 'react';
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
  const [slots, setSlots] = useState<Slot[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSlots();
    fetchAppointments();
  }, []);

  const fetchSlots = async () => {
    const { data, error } = await supabase.from('available_slots').select('*');
    if (error) {
      console.error(error);
    } else {
      setSlots(data || []);
    }
  };

  const fetchAppointments = async () => {
    const { data, error } = await supabase.from('appointments').select('*');
    if (error) {
      console.error(error);
    } else {
      setAppointments(data || []);
    }
  };

  const addSlot = async () => {
    if (!date || !startTime || !endTime) return;
    const { error } = await supabase.from('available_slots').insert([
      { date, start_time: startTime, end_time: endTime, available: true }
    ]);
    if (error) {
      setMessage('Error agregando slot');
    } else {
      setMessage('Slot agregado');
      fetchSlots();
      setDate('');
      setStartTime('');
      setEndTime('');
    }
  };

  const toggleAvailable = async (id: number, available: boolean) => {
    const { error } = await supabase
      .from('available_slots')
      .update({ available: !available })
      .eq('id', id);
    if (error) {
      setMessage('Error actualizando slot');
    } else {
      fetchSlots();
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

      <div className="mb-8">
        <h2 className="text-xl mb-2">Agregar Horario Disponible</h2>
        <div className="flex gap-2 mb-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={addSlot}
            className="bg-blue-600 text-white py-2 px-4 rounded"
          >
            Agregar
          </button>
        </div>
        {message && <p>{message}</p>}
      </div>

      <div className="mb-8">
        <h2 className="text-xl mb-2">Horarios Disponibles</h2>
        <ul>
          {slots.map((slot) => (
            <li key={slot.id} className="flex justify-between items-center border p-2 mb-2">
              <span>
                {slot.date} {slot.start_time} - {slot.end_time} ({slot.available ? 'Disponible' : 'No disponible'})
              </span>
              <button
                onClick={() => toggleAvailable(slot.id, slot.available)}
                className={`py-1 px-2 rounded ${slot.available ? 'bg-red-600' : 'bg-green-600'} text-white`}
              >
                {slot.available ? 'Desactivar' : 'Activar'}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl mb-2">Citas Agendadas</h2>
        <ul>
          {appointments.map((appt) => (
            <li key={appt.id} className="border p-2 mb-2">
              <p>{appt.name} {appt.surname} - {appt.email}</p>
              <p>{new Date(appt.scheduled_at).toLocaleString()}</p>
              <p>Status: {appt.status}</p>
              {appt.status === 'pending' && (
                <div className="mt-2">
                  <button
                    onClick={() => updateAppointmentStatus(appt.id, 'accepted')}
                    className="bg-green-600 text-white py-1 px-2 rounded mr-2"
                  >
                    Aceptar
                  </button>
                  <button
                    onClick={() => updateAppointmentStatus(appt.id, 'rejected')}
                    className="bg-red-600 text-white py-1 px-2 rounded"
                  >
                    Rechazar
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}