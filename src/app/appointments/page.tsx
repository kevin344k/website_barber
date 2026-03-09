"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { supabase } from '../../lib/supabaseClient';

const FullCalendar = dynamic(() => import('@fullcalendar/react'), { ssr: false });
//const dayGridPlugin = dynamic(() => import('@fullcalendar/daygrid'), { ssr: false });
//const timeGridPlugin = dynamic(() => import('@fullcalendar/timegrid'), { ssr: false });

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
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [plugins, setPlugins] = useState<any[]>([]);

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
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime) return;

    // Ajustar a zona local para guardar como si fuera UTC
    const localTime = new Date(selectedTime.start.getTime() - selectedTime.start.getTimezoneOffset() * 60000);

    const { error: insertError } = await supabase.from('appointments').insert([
      {
        name,
        surname,
        email,
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
      setSurname('');
      setEmail('');
      setSelectedTime(null);
      setShowForm(false);
      fetchAppointments();
    }
  };

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
          height="auto"
          locale={esLocale}
          firstDay={1}
          dayCellClassNames={dayCellClassNames}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          slotMinTime="08:00:00"
          slotMaxTime="18:00:00"
          slotDuration="01:00:00"            // dividir en horas completas en lugar de 30min
          slotLabelFormat={{ hour: '2-digit', minute: '2-digit' }}
          allDaySlot={false}
        />
      )}

      {showForm && selectedTime && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-700 p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-xl mb-4">Agendar cita para {selectedTime.start.toLocaleString()}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <label>Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border p-2 rounded"
              />

              <label>Apellido</label>
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
                className="border p-2 rounded"
              />

              <label>Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border p-2 rounded"
              />

              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white py-2 px-4 rounded"
                >
                  Agendar
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-600 text-white py-2 px-4 rounded"
                >
                  Cancelar
                </button>
              </div>
            </form>
            {message && <p className="mt-4">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
