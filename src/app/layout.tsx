import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Anton } from "next/font/google";
import Image from "next/image";
import { Caveat } from "next/font/google";
import imgUser from '@/assets/face_barber.jpg'




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400","700"],
    variable: "--font-caveat", // opcional si usarás CSS variables
});

const anton = Anton({
  subsets: ["latin"],
  weight: "400", // Anton es 400
  display: "swap",
  variable: "--font-anton", // opcional si usarás CSS variables
});

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
        className={`${caveat.variable}  ${geistSans.variable} ${geistMono.variable} ${anton.variable} antialiased`}
      >
        <nav className="bg-gray-900/60 flex items-center justify-end text-right p-3 absolute top-0 left-0 w-full text-white z-10">
          <a href="/" className="mr-4">
            Inicio
          </a>
          <a href="/appointments" className="mr-4">
            Agendar cita
          </a>{" "}
          <a href="/admin" className="mr-4">
          <Image src={imgUser} className="w-12 h-12 border boreder-2 border-neutral-700 rounded-lg" alt="img-logo"></Image>
          </a>{" "}
        </nav>
        {children}
      </body>
    </html>
  );
}
