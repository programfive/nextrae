<a href="https://demo-nextjs-with-supabase.vercel.app/">
  <img alt="Next.js and Supabase Starter Kit - the fastest way to build apps with Next.js and Supabase" src="https://demo-nextjs-with-supabase.vercel.app/opengraph-image.png">
  <h1 align="center">Next.js and Supabase Starter Kit</h1>
</a>

<p align="center">
 The fastest way to build apps with Next.js and Supabase
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#deploy-to-vercel"><strong>Deploy to Vercel</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
  <a href="#feedback-and-issues"><strong>Feedback and issues</strong></a>
  <a href="#more-supabase-examples"><strong>More Examples</strong></a>
</p>
<br/>

## Features

- Works across the entire [Next.js](https://nextjs.org) stack
  - App Router
  - Pages Router
  - Middleware
  - Client
  - Server
  - It just works!
- supabase-ssr. A package to configure Supabase Auth to use cookies
- Password-based authentication block installed via the [Supabase UI Library](https://supabase.com/ui/docs/nextjs/password-based-auth)
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Components with [shadcn/ui](https://ui.shadcn.com/)
- Optional deployment with [Supabase Vercel Integration and Vercel deploy](#deploy-your-own)
  - Environment variables automatically assigned to Vercel project

## Demo

You can view a fully working demo at [demo-nextjs-with-supabase.vercel.app](https://demo-nextjs-with-supabase.vercel.app/).

## Deploy to Vercel

Vercel deployment will guide you through creating a Supabase account and project.

After installation of the Supabase integration, all relevant environment variables will be assigned to the project so the deployment is fully functioning.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&project-name=nextjs-with-supabase&repository-name=nextjs-with-supabase&demo-title=nextjs-with-supabase&demo-description=This+starter+configures+Supabase+Auth+to+use+cookies%2C+making+the+user%27s+session+available+throughout+the+entire+Next.js+app+-+Client+Components%2C+Server+Components%2C+Route+Handlers%2C+Server+Actions+and+Middleware.&demo-url=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&demo-image=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2Fopengraph-image.png)

The above will also clone the Starter kit to your GitHub, you can clone that locally and develop locally.

If you wish to just develop locally and not deploy to Vercel, [follow the steps below](#clone-and-run-locally).

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

   ```bash
   npx create-next-app --example with-supabase with-supabase-app
   ```

   ```bash
   yarn create next-app --example with-supabase with-supabase-app
   ```

   ```bash
   pnpm create next-app --example with-supabase with-supabase-app
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd with-supabase-app
   ```

4. Rename `.env.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://supabase.com/dashboard/project/_?showConnect=true)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

6. This template comes with the default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next)
 
> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

## Feedback and issues

Please file feedback and issues over on the [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose).

## More Supabase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)

## Plan del Proyecto: Sistema de Rifas con Reservas y Confirmación Manual

### Resumen

Aplicación en Next.js + Supabase para gestionar rifas con un flujo de compra basado en reservas temporales, pago externo vía QR y confirmación manual por parte del admin. Incluye expiración automática de reservas, notificaciones por email (Resend) y un panel de administración sencillo.

---

### Flujo Completo del Usuario

1) Selección de Boletos
- El usuario navega las rifas disponibles.
- Selecciona la rifa de interés.
- Elige cuántos boletos comprar.
- Ingresa sus datos: nombre, email, teléfono.

2) Reserva Temporal
- El sistema RESERVA los boletos por X minutos (ej. 15–30 min).
- Genera un código de reserva único.
- Estado de boletos: RESERVADO (no vendido).
- Envía email con: números reservados, QR de pago, link de WhatsApp pre-llenado con el código de reserva y tiempo límite para pagar.

3) Pago por WhatsApp
- El usuario envía captura del pago por WhatsApp con el código de reserva.
- El admin verifica el pago manualmente.

4) Confirmación Manual (Admin)
- Panel de administración en Next.js.
- Lista de reservas pendientes.
- Botón "Confirmar Pago" por reserva.
- Al confirmar: boletos pasan de RESERVADO a VENDIDO, se envía email de confirmación y se cancela el timer de expiración.

5) Expiración Automática
- Si no se paga a tiempo: los boletos vuelven a DISPONIBLES.
- La reserva pasa a EXPIRADO.
- Se envía email de expiración.

---

### Estructura de Datos en Supabase (SQL propuesto)

```sql
-- Tabla: raffles
create table if not exists raffles (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text,
  precio_boleto numeric(12,2) not null,
  total_boletos int not null,
  fecha_sorteo timestamptz,
  imagen_url text,
  estado text check (estado in ('ACTIVA','FINALIZADA','CANCELADA')) default 'ACTIVA',
  created_at timestamptz default now()
);

-- Tabla: reservas
create table if not exists reservas (
  id uuid primary key default gen_random_uuid(),
  codigo text unique not null, -- ej: RES-ABC123
  raffle_id uuid references raffles(id) on delete cascade,
  usuario_nombre text not null,
  usuario_email text not null,
  usuario_telefono text,
  numeros_reservados jsonb not null, -- array de números o estructura { numeros: [..] }
  monto_total numeric(12,2) not null,
  estado text check (estado in ('PENDIENTE','CONFIRMADO','EXPIRADO','CANCELADO')) default 'PENDIENTE',
  fecha_expiracion timestamptz not null,
  comprobante_url text,
  created_at timestamptz default now(),
  confirmed_at timestamptz
);

-- Tabla: tickets
create table if not exists tickets (
  id uuid primary key default gen_random_uuid(),
  raffle_id uuid references raffles(id) on delete cascade,
  numero int not null,
  estado text check (estado in ('DISPONIBLE','RESERVADO','VENDIDO')) default 'DISPONIBLE',
  reserva_id uuid null references reservas(id) on delete set null,
  comprador_nombre text,
  comprador_email text,
  comprador_telefono text,
  created_at timestamptz default now(),
  unique (raffle_id, numero)
);

-- Índices recomendados
create index if not exists idx_reservas_estado_exp on reservas (estado, fecha_expiracion);
create index if not exists idx_tickets_raffle_estado on tickets (raffle_id, estado);
```

Notas:
- Generar `codigo` legible tipo `RES-ABC123` además del `id` UUID.
- Mantener integridad: al confirmar o expirar, sincronizar `tickets.estado` y `reservas.estado`.

---

### API Routes en Next.js (App Router)

- POST `/api/reservas/crear`
  - Valida disponibilidad de boletos para `raffle_id`.
  - Crea `reserva` en estado `PENDIENTE` con `fecha_expiracion`.
  - Marca `tickets` seleccionados como `RESERVADO` y asocia `reserva_id`.
  - Programa expiración (ver sección CRON/Jobs).
  - Envía email de reserva con Resend (QR + instrucciones + WhatsApp link).
  - Retorna `{ codigoReserva }`.

- GET `/api/reservas/[codigo]`
  - Devuelve estado y detalle de la reserva para que el usuario consulte.

- POST `/api/admin/confirmar-pago`
  - Autenticación requerida (solo admin).
  - Body: `{ codigoReserva }` (y opcional `comprobante_url`).
  - Cambia `reservas.estado` a `CONFIRMADO`, `confirmed_at = now()`.
  - Cambia `tickets` de `RESERVADO` a `VENDIDO` y persiste datos de comprador.
  - Envía email de confirmación con boletos oficiales.

- POST `/api/reservas/subir-comprobante` (opcional)
  - Guarda `comprobante_url` asociado a la reserva.

- GET `/api/admin/reservas?estado=PENDIENTE|CONFIRMADO|EXPIRADO`
  - Lista para el panel admin.

---

### CRON / Jobs de Expiración

- Ruta: `GET /api/cron/expirar-reservas` (o Edge Function programada)
  - Corre cada 5 minutos.
  - Busca reservas `PENDIENTE` con `fecha_expiracion < now()`.
  - Libera `tickets` a `DISPONIBLE` y `reservas.estado = EXPIRADO`.
  - Envía email de expiración.

Alternativas:
- Programar con Vercel Cron o Supabase Scheduled Edge Functions.

### Emails con Resend

- Email de Reserva (asunto: "Reserva Confirmada - Código: RES-XXXXXX")
  - Incluye rifa, números, monto, QR de pago, límite de pago, código de reserva y link de WhatsApp.

- Email de Confirmación
  - Confirmación de compra y detalle de boletos vendidos.

- Email de Expiración
  - Notifica expiración y libera disponibilidad.

Ejemplo de link WhatsApp pre-llenado:

```javascript
const codigoReserva = 'RES-ABC123';
const telefono = '591XXXXXXXX'; // Ajustar número destino
const whatsappLink = `https://wa.me/${telefono}?text=${encodeURIComponent(
  `Hola, realicé el pago de mi reserva ${codigoReserva}`
)}`;
```

---

### Panel de Administración

- Dashboard simple en Next.js:
  - Lista de reservas por estado (pendientes, confirmadas, expiradas).
  - Ver detalle y comprobante.
  - Botón "Confirmar Pago" por reserva.
  - Filtros y búsqueda por código/email.

---

### Consideraciones Importantes

- ✅ Reservar primero, confirmar después.
- ✅ Expirar automáticamente reservas no pagadas.
- ✅ Enviar emails en cada etapa.
- ✅ Link de WhatsApp con código de reserva.
- ✅ Panel admin simple para confirmar pagos.

---

### Setup y Variables de Entorno

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (para operaciones seguras del CRON, usar solo server-side)
- `RESEND_API_KEY`
- `WHATSAPP_PHONE` (destino para mensajes)
- `RESERVA_MINUTOS` (ej. 15–30)

Aplicar SQL propuesto en Supabase y configurar RLS según necesidad (p. ej., tablas admin-only sin acceso público; los endpoints server-side gestionan todo).

---

### roadmap Técnico

1. Migraciones en Supabase para `raffles`, `reservas`, `tickets`.
2. Implementar `POST /api/reservas/crear` con validaciones y email inicial.
3. Implementar `GET /api/reservas/[codigo]` para seguimiento.
4. Implementar `POST /api/admin/confirmar-pago` + UI admin básica.
5. Implementar CRON de expiración (Vercel/Supabase Edge).
6. Añadir subida de comprobante y vista previa en admin.
7. Seguridad (auth admin, RLS, rate limits, logs).

---

### Notas de Seguridad y Concurrencia

- Usar transacción al marcar tickets como `RESERVADO/VENDIDO` para evitar overbooking.
- Bloqueos optimistas/pesimistas al seleccionar números.
- Validar transiciones de estado (máquina de estados).
- Auditoría mínima (quién confirmó, cuándo; logs en server).
