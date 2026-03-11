import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Anton } from "next/font/google";
import ClientHeader from "@/app/components/ClientHeader";
import { Caveat } from "next/font/google";




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
        <ClientHeader />
        {children}
      </body>
    </html>
  );
}
