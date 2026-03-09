# Website Barber

Aplicación Next.js para un peluquero que permite a los usuarios registrarse y agendar citas.


## Requisitos

- Node.js 18 o superior
- Cuenta de Supabase

## Configuración

1. Crea un proyecto en [Supabase](https://supabase.com) y obtén la URL y la clave ANON.
2. Añade un archivo `.env.local` en la raíz (no debe subirse a git) con las variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
   ```
   Si estas variables faltan, la aplicación fallará mostrando un error al iniciar.
3. En Supabase, crea una tabla `appointments` con columnas:
   - `id` (integer, primary key, autoincrement)
   - `name` (text)
   - `surname` (text)
   - `email` (text)
   - `scheduled_at` (timestamp)
   - `status` (text, default 'pending')  // 'pending', 'accepted', 'rejected'

4. Crea otra tabla `available_slots` con columnas:
   - `id` (integer, primary key, autoincrement)
   - `date` (date)
   - `start_time` (time)
   - `end_time` (time)
   - `available` (boolean, default true)

   **Importante:** Deshabilita RLS en ambas tablas.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
