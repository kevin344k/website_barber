

"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import imgHero from '@/assets/hero_image.jpg'

export default function Home() {
  const [wobble, setWobble] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setWobble(true);
      setTimeout(() => setWobble(false), 800); // Duración de la animación
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className=" bg-white font-sans ">
      <main className="relative h-screen w-screen flex items-center justify-center">
       <div className="z-5 pl-2">
         <h1 className=" text-3xl lg:text-6xl font-bold font-anton text-white mb-4 ">THE CHAMO</h1>
        <p className="text-sm  md:text-lg text-white max-w-200">
         Cortes de cabello de calidad, atención personalizada y un ambiente acogedor. ¡Reserva tu cita hoy y experimenta el arte del barbería en su máxima expresión!
        </p>
        <div className="mt-6 mb-8">
      
            <a
              href="/appointments"
              className={`shadow-md mr-4 flex mx-auto items-center gap-2 w-fit text-white bg-amber-600 hover:bg-ambar-700 font-bold py-2 px-4 rounded-full transition bottom-10 right-10 z-10 ${wobble ? 'animate-wobble-hor-bottom' : ''}`}
              onMouseEnter={() => setWobble(true)}
              onAnimationEnd={() => setWobble(false)}
            >
              <svg className="w-8 h-8 text-amber-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <span className="font-normal">  Agendar cita</span>
            </a>
        </div>
        <div className="relative mt-8 ">
        
<svg
  className="absolute left-20 -top-15  -translate-x-1/2 w-30 md:w-56  -rotate-30 lg:left-130 lg:top-5 lg:-scale-x-100  lg:rotate-150"
  viewBox="3300 350 1200 400"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M4295.988 496.371
    C4293.94 493.98 4291.91 491.55 4289.83 489.19
    C4275.28 472.55 4261.03 455.64 4249.19 436.89
    C4243.05 427.17 4237.78 417.01 4235.48 405.67
    C4234.03 398.55 4233.37 391.12 4240.28 386.19
    C4246.92 381.42 4253.89 383.42 4260.42 386.85
    C4272.28 393.05 4282.35 401.64 4291.51 411.19
    C4327.57 448.82 4362.08 487.78 4392.96 529.82
    C4398.25 537.03 4404.03 543.60 4410.92 549.39
    C4421.96 558.71 4431.07 569.50 4427.75 585.35
    C4424.28 601.89 4411.07 608.30 4396.62 612.12
    C4371.26 618.82 4345.10 621.03 4319.21 624.71
    C4298.83 627.62 4278.44 630.32 4258.08 633.21
    C4244.37 635.17 4230.82 635.14 4217.25 631.73
    C4209.87 629.87 4202.21 629.26 4194.76 627.78
    C4183.66 625.57 4176.96 619.39 4175.71 610.69
    C4174.41 601.51 4179.41 593.89 4189.64 588.46
    C4217.33 573.73 4246.85 566.57 4278.17 566.67
    C4281.98 566.69 4285.76 566.10 4289.55 565.71
    C4290.25 565.64 4290.87 565.12 4291.51 564.82
    C4291.35 563.14 4290.14 562.64 4288.94 562.30
    C4231.37 546.28 4179.41 516.30 4123.58 496
    C4049.80 469.14 3974.62 447.89 3895.96 441.78
    C3779.05 432.69 3664.17 444.14 3551.55 477.48
    C3487.51 496.42 3425.75 520.71 3367.03 552.60
    C3352.94 560.23 3339.05 568.16 3326.14 577.69
    C3323.57 579.58 3321.03 581.46 3317.89 579.46
    C3314.30 577.17 3314.32 573.50 3315.31 569.91
    C3317.55 561.87 3322.53 555.41 3327.90 549.26
    C3344.96 529.73 3365.30 514.28 3387.47 501.05
    C3434.85 472.80 3485.63 452.42 3537.71 434.67
    C3632.75 402.26 3730.60 385.69 3830.71 382.62
    C3943.58 379.16 4052.67 399.55 4158.51 438.16
    C4186.64 448.44 4214.35 459.92 4242.30 470.78
    C4260.73 477.94 4278.46 486.48 4295.98 496.37"
    fill="white"
  />
</svg>

          <span className="font-caveat text-white text-4xl mt-3 "> !Agenda YA¡</span>
          <p className="font-caveat text-white text-3xl">No hagas fila, tu tiempo es valioso.</p>
          <p className="font-caveat text-neutral-400 text-xl mt-1">* Aplica un recargo de $0.50</p>
        </div>
       </div>
       <div className="absolute w-full  top-0 left-0 z-1  h-full">
         <Image src={imgHero} alt=""  className="w-full h-full object-cover   "/>
       </div>
      
             
      
      </main>
    </div>
  );
}
