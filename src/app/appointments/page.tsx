"use client";

import { useState, useEffect } from 'react';
import { getWorkHoursFromDB } from '../../lib/supabaseWorkHours';

import dynamic from 'next/dynamic';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { supabase } from '../../lib/supabaseClient';

const FullCalendar = dynamic(() => import('@fullcalendar/react'), { ssr: false });
const dayGridPlugin = dynamic(() => import('@fullcalendar/daygrid'), { ssr: false });
const timeGridPlugin = dynamic(() => import('@fullcalendar/timegrid'), { ssr: false });

interface Appointment {
  id: number;

  name: string;
  surname: string;
  email: string;
  scheduled_at: string;
  status: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedTime, setSelectedTime] = useState<{ start: Date; end: Date } | null>(null);
  const [name, setName] = useState('');
  // Eliminados campos de apellido y email
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [plugins, setPlugins] = useState<any[]>([]);
   const [nameError, setNameError] = useState(false);

  const fetchAppointments = async () => {
    const { data, error } = await supabase.from('appointments').select('*');
    if (error) {
      console.error(error);
    } else {
      setAppointments(data || []);
    }
  };

  useEffect(() => {
    fetchAppointments();
    // Load plugins dynamically
    Promise.all([
      import('@fullcalendar/daygrid'),
      import('@fullcalendar/timegrid'),
    ]).then(([dayGrid, timeGrid]) => {
      setPlugins([dayGrid.default, timeGrid.default, interactionPlugin]);
    });
  }, []);

  const dayCellClassNames = (arg: any) => {
    const day = arg.date.getDay();
    if (day === 0 || day === 6) { // Domingo o Sábado
      return 'weekend';
    }
    return '';
  };

  const events = appointments.map(appt => ({
    id: appt.id.toString(),
    title: `${appt.name} ${appt.surname} (${appt.status})`,
    start: new Date(appt.scheduled_at),
    backgroundColor: appt.status === 'accepted' ? 'green' : appt.status === 'rejected' ? 'red' : 'orange',
    textColor: 'white',
  }));


  const handleSelect = (info: any) => {
    setSelectedTime({ start: info.start, end: info.end });
    setMessage('');
    setShowForm(true);
  };

  // Para móviles: abrir modal al hacer click en cualquier celda
  const handleDateClick = (info: any) => {
    // Simula un rango de 1 hora desde la hora seleccionada
    const start = info.date;
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    setSelectedTime({ start, end });
    setMessage('');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime) return;

    // Ajustar a zona local para guardar como si fuera UTC
    const localTime = new Date(selectedTime.start.getTime() - selectedTime.start.getTimezoneOffset() * 60000);

      const { error: insertError } = await supabase.from('appointments').insert([
        {
          name: name || null,
          surname: '',
          email: '',
          scheduled_at: localTime.toISOString(),
          status: 'pending',
        },
      ]);

    if (insertError) {
      console.error(insertError);
      setMessage('Error al agendar la cita');
    } else {
      setMessage('Cita agendada correctamente. Espera confirmación.');
      setName('');
      setSelectedTime(null);
      setShowForm(false);
      fetchAppointments();
    }
  };

  // Obtener horario de trabajo dinámico desde Supabase
  const [workStart, setWorkStart] = useState('09:00');
  const [workEnd, setWorkEnd] = useState('19:00');

  useEffect(() => {
    getWorkHoursFromDB().then(({ start, end }) => {
      setWorkStart(start);
      setWorkEnd(end);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 ">
      <h1 className="text-2xl font-bold mb-4">Agendar cita</h1>
      <p className="mb-4">Selecciona un horario en el calendario haciendo click y arrastrando en el grid. Los horarios agendados se muestran con colores.</p>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Leyenda:</h3>
        <div className="flex gap-4">
          <span className="bg-orange-500 text-white px-2 py-1 rounded">Pendiente</span>
          <span className="bg-green-500 text-white px-2 py-1 rounded">Aceptada</span>
          <span className="bg-red-500 text-white px-2 py-1 rounded">Rechazada</span>
        </div>
      </div>

      {plugins.length > 0 && (
        <FullCalendar
          plugins={plugins}
          initialView="timeGridWeek"
          events={events}
          selectable={true}
          select={handleSelect}
          dateClick={handleDateClick}
          height="auto"
          locale={esLocale}
          firstDay={1}
          dayCellClassNames={dayCellClassNames}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          slotMinTime={workStart + ':00'}
          slotMaxTime={workEnd + ':00'}
          slotDuration="01:00:00"            // dividir en horas completas en lugar de 30min
          slotLabelFormat={{ hour: '2-digit', minute: '2-digit' }}
          allDaySlot={false}
        />
      )}

      {showForm && selectedTime && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border-2 border-blue-600 relative animate-fade-in">
            <button onClick={() => setShowForm(false)} className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-2xl font-bold">×</button>
            <h2 className="text-2xl font-extrabold mb-2 text-blue-700 text-center tracking-wide drop-shadow">Agendar cita</h2>
            <div className="mb-4 text-center">
              <span className="inline-block bg-blue-100 text-blue-700 text-lg font-bold px-4 py-2 rounded-xl shadow">{selectedTime.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {selectedTime.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <div className="text-gray-500 mt-1 text-sm">{selectedTime.start.toLocaleDateString()}</div>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                  <label className="block text-gray-700 font-semibold mb-1">Nombre <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => {
                      setName(e.target.value);
                      if (nameError && e.target.value.trim()) setNameError(false);
                    }}
                    className={`border-2 p-2 rounded w-full transition focus:border-blue-500 ${nameError ? 'border-red-500 animate-shake' : 'border-blue-200'}`}
                    placeholder="Tu nombre"
                  />
                  {nameError && (
                    <div className="text-red-500 text-sm mt-1 animate-fade-in-down font-semibold flex items-center gap-1">
                      <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/></svg>
                      El nombre es obligatorio
                    </div>
                  )}
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-bold shadow transition"
                >
                  Agendar
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-bold shadow transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
            {message && <p className="mt-4 text-center text-green-600 font-semibold">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
