import Image from "next/image";

import imgHero from '@/assets/hero_image.jpg'





export default function Home() {
  return (
    <div className=" bg-white font-sans ">
      <main className="relative h-screen w-screen flex items-center justify-center">
       <div className="z-5 ">
         <h1 className="text-6xl font-bold font-anton mb-4">THE CHAMO</h1>
        <p className="text-lg">
         Cortes de cabello de calidad, atención personalizada y un ambiente acogedor. ¡Reserva tu cita hoy y experimenta el arte del barbería en su máxima expresión!
        </p>
       </div>
       <div className="absolute w-full  top-0 left-0 z-1  h-full">
         <Image src={imgHero} alt=""  className="w-full h-full"/>
       </div>
      </main>
    </div>
  );
}
