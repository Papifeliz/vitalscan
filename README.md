# VitalScan Pro

Aplicacion web para distribuidores de bienestar y nutricion. Genera un analisis en dos fases con IA, guarda clientes en Supabase y publica informes con enlace permanente.

## Estructura

```txt
vitalscan/
  index.html
  api/proxy.js
  vercel.json
```

## Publicacion gratis en Vercel

Nota: Vercel Hobby es gratis para uso personal/no comercial. Para uso comercial real de negocio, revisa las condiciones actuales de Vercel o despliega en una plataforma cuyo plan gratuito permita ese uso.

1. Sube esta carpeta a GitHub.
2. En Vercel, importa el repositorio y deja el directorio raiz en `vitalscan`.
3. En Settings > Environment Variables, crea:

```txt
ANTHROPIC_KEY=tu_api_key_de_anthropic
```

4. Despliega. La app usara el dominio real de Vercel para los informes publicos con `#report/UUID`.

## Supabase

El HTML usa la URL y clave publica de Supabase ya incluidas en `index.html`. Para reconstruir la base de datos desde cero, ejecuta `supabase.sql` en el SQL Editor de Supabase.

Para que esta version funcione como prototipo publico, el SQL crea politicas de lectura/escritura anonimas. Para produccion real conviene migrar a Supabase Auth y Row Level Security por usuario.

## Flujo

- Fase 1: 2 llamadas IA para score, radar, metricas corporales y carencias.
- Fase 2: 3 llamadas IA para proyeccion, plan nutricional, suplementacion generica y ejercicio.
- Compartir: enlace publico, WhatsApp, QR y descarga HTML.
