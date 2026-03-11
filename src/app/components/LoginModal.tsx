
import { useState } from 'react';
import Image from 'next/image';

export default function LoginModal({ onLogin, error, show, loading }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      {/* Imágenes flotantes animadas alrededor del modal, duplicadas y más cerca del formulario */}
      <div className="absolute w-full h-full pointer-events-none select-none">
        {/* barber1 arriba izquierda */}
        <Image
          src={require('../../assets/barber1.png')}
          alt="barber1"
          width={90}
          height={90}
          className="floating-img left-2 top-2 animate-float-rotate1"
          style={{ position: 'absolute', zIndex: 10 }}
        />
        {/* barber1 abajo izquierda */}
        <Image
          src={require('../../assets/barber1.png')}
          alt="barber1"
          width={90}
          height={90}
          className="floating-img left-4 bottom-6 animate-float-rotate2"
          style={{ position: 'absolute', zIndex: 10 }}
        />
        {/* barber2 arriba derecha */}
        <Image
          src={require('../../assets/barber2.png')}
          alt="barber2"
          width={85}
          height={85}
          className="floating-img right-2 top-4 animate-float-rotate2"
          style={{ position: 'absolute', zIndex: 10 }}
        />
        {/* barber2 abajo derecha */}
        <Image
          src={require('../../assets/barber2.png')}
          alt="barber2"
          width={85}
          height={85}
          className="floating-img right-4 bottom-8 animate-float-rotate1"
          style={{ position: 'absolute', zIndex: 10 }}
        />
      </div>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm animate-fade-in-up relative z-20">
        <h2 className="text-2xl font-bold mb-4 text-center">Iniciar sesión admin</h2>
        <form
          className="flex flex-col gap-4"
          onSubmit={e => {
            e.preventDefault();
            onLogin(username, password);
          }}
        >
          <input
            type="text"
            className="border p-2 rounded"
            placeholder="Nombre de usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoFocus
          />
          <input
            type="password"
            className="border p-2 rounded"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
