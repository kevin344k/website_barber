-- Tabla para sesiones simples de admin
create table if not exists public.sessions (
  id serial primary key,
  username text not null unique,
  password_hash text not null,
  last_login timestamptz
);
