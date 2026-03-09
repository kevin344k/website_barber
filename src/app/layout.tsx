import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Anton } from 'next/font/google'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


const anton = Anton({
  subsets: ['latin'],
  weight: '400',   // Anton es 400
  display: 'swap',
  variable: '--font-anton', // opcional si usarás CSS variables
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Barber Shop",
  description: "Reserva tu cita en línea",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`  ${geistSans.variable} ${geistMono.variable} ${anton.variable} antialiased`}
      >
        <nav className="bg-gray-900/60 text-right p-4 absolute top-0 left-0 w-full z-10">
          <a href="/" className="mr-4">
            Inicio
          </a>
          <a href="/register" className="mr-4">
            Registro
          </a>
          <a href="/appointments" className="mr-4">
            Agendar cita
          </a>          <a href="/admin" className="mr-4">
            Admin
          </a>        </nav>
        {children}
      </body>
    </html>
  );
}
