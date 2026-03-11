"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import imgUser from '@/assets/user.svg';
import exit from '@/assets/exit.png';

export default function ClientHeader() {
  const router = useRouter();
  const [isAdminLogged, setIsAdminLogged] = useState(false);
  useEffect(() => {
    // Detectar login admin personalizado (localStorage)
    setIsAdminLogged(localStorage.getItem('admin_logged') === 'true');
    window.addEventListener('storage', () => {
      setIsAdminLogged(localStorage.getItem('admin_logged') === 'true');
    });
    // Limpieza
    return () => {
      window.removeEventListener('storage', () => {});
    };
  }, []);
  const handleLogout = () => {
    localStorage.setItem('admin_logged', 'false');
    setIsAdminLogged(false);
    router.push("/");
    router.refresh();
  };
  return (
    <nav className="bg-gray-900/60 flex items-center justify-end text-right p-3 absolute top-0 left-0 w-full text-white z-10">
      <a href="/" className="mr-4 hover:text-amber-400 transition">
        Inicio
      </a>
      <a href="/appointments" className="mr-4 hover:text-amber-400 transition">
        Agendar cita
      </a>
      {!isAdminLogged ? (
        <button
          onClick={() => router.push('/admin')}
          className="ml-2 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-bold transition"
        >
          Ingresar
        </button>
      ) : (
        <button
          onClick={handleLogout}
          title="Cerrar sesión"
          className="ml-2 px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-bold transition"
        >
          Salir
        </button>
      )}
    </nav>
  );
}
