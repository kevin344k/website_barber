# Sesión persistente en Supabase (plan gratuito)

## Límite del plan gratuito
- En el plan gratuito de Supabase, la duración máxima de la sesión está limitada (usualmente a 1 semana).
- No es posible aumentar este límite sin actualizar al plan Pro.

## ¿Qué hace la app?
- El SDK de Supabase refresca la sesión automáticamente mientras el usuario esté activo.
- Si la sesión expira, se muestra el modal de login para que el admin vuelva a ingresar.
- El email del usuario puede guardarse en localStorage para autollenar el campo de login y facilitar el acceso.
- Se muestra un mensaje amigable si la sesión expira, indicando que solo debe volver a iniciar sesión.

## Recomendación
- Para sesiones más largas (hasta 3 meses), es necesario actualizar al plan Pro de Supabase y configurar el parámetro "Time-box user sessions".

---

**Resumen:**
- En el plan gratuito, la sesión dura máximo 1 semana.
- El usuario solo debe volver a iniciar sesión cuando expire la sesión.
- La experiencia es lo más fluida posible dentro de las limitaciones del plan gratuito.
