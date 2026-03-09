# Lógica de Negocio - App de Barbería

## Introducción

Esta aplicación web permite a los clientes de una barbería registrarse y agendar citas de manera sencilla, mientras que el peluquero gestiona sus horarios de trabajo y administra las citas desde un panel de administración. La app utiliza Next.js para el frontend, Supabase para la base de datos y autenticación, y Tailwind CSS para el diseño.

## Usuarios del Sistema

### 1. Clientes
- Personas que desean agendar una cita en la barbería.
- Pueden registrarse con correo electrónico y contraseña.
- Acceden al formulario de agendamiento para seleccionar un horario disponible.

### 2. Peluquero (Administrador)
- El propietario o empleado de la barbería.
- Gestiona los horarios disponibles para trabajar.
- Revisa y acepta/rechaza citas agendadas por clientes.

## Funcionalidades Principales

### Registro de Usuarios
- Los clientes se registran proporcionando correo electrónico y contraseña.
- Supabase maneja la autenticación y envía un email de confirmación.
- Una vez registrados, pueden acceder al sistema de agendamiento.

### Agendamiento de Citas
- Los clientes ven un calendario visual semanal con vista de tiempo, mostrando citas existentes con colores según status.
- Seleccionan un horario haciendo click y arrastrando en el grid del calendario (evitando solapamientos visuales).
- Se abre un modal para ingresar nombre, apellido y email; la cita se guarda con status "pending".
- Leyenda de colores: Naranja (pendiente), Verde (aceptada), Rojo (rechazada).

### Gestión de Horarios (Panel Admin)
- El peluquero accede a `/admin` para agregar nuevos slots disponibles.
- Cada slot incluye fecha, hora de inicio y fin.
- Puede activar/desactivar slots existentes.
- Gestiona citas pendientes: aceptar (cambia status a "accepted") o rechazar (cambia a "rejected").

## Flujo de Negocio

### 1. Configuración Inicial
- El peluquero crea slots disponibles en el panel admin.
- Ejemplo: "2026-03-10 de 9:00 a 10:00" marcado como disponible.

### 2. Registro y Agendamiento
- Cliente se registra en `/register`.
- Va a `/appointments`, selecciona un slot disponible del dropdown.
- Envía el formulario: cita se guarda en BD con status "pending", slot se desactiva.

### 3. Gestión por el Peluquero
- En `/admin`, ve la lista de citas pendientes.
- Para cada cita: botón "Aceptar" (status → "accepted") o "Rechazar" (status → "rejected").
- Si rechaza, podría reactivar el slot (lógica opcional).

### 4. Estados de las Citas
- **Pending**: Agendada por cliente, esperando confirmación.
- **Accepted**: Confirmada por peluquero, cita válida.
- **Rejected**: Rechazada, cliente debe elegir otro horario.

## Reglas de Negocio

- Solo se pueden agendar citas en slots marcados como disponibles.
- Un slot ocupado no puede ser seleccionado por otro cliente.
- El peluquero controla qué días/horas está disponible.
- No hay límite de citas por slot (asumiendo 1 cita por slot).
- Autenticación solo para registro; agendamiento y admin son públicos (para simplicidad).

## Base de Datos

### Tabla `appointments`
- Campos: id, name, surname, email, scheduled_at (timestamp), status (text).

### Tabla `available_slots`
- Campos: id, date (date), start_time (time), end_time (time), available (boolean).

Ambas tablas tienen RLS deshabilitado para acceso público.

## Consideraciones Técnicas
- Frontend en React/Next.js con hooks para estado.
- Consultas a Supabase via cliente JS.
- Diseño responsive con Tailwind.
- Validación básica en formularios.

## Futuras Mejoras
- Autenticación para admin (login separado).
- Notificaciones por email a clientes sobre status de cita.
- Calendario visual en lugar de dropdown.
- Integración con pagos o recordatorios.