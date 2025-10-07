# Sistema de Rifas – Requerimientos

## Resumen
Aplicación para gestionar rifas con compra por reserva temporal, pago por QR (confirmación vía WhatsApp) y aprobación manual del administrador. Incluye expiración automática de reservas, notificaciones por email y un panel de administración simple.

## Flujo del Usuario
- **Paso 1: Selección de boletos**
  - Ver rifas disponibles, elegir rifa, seleccionar cantidad de boletos.
  - Ingresar datos: nombre, email, teléfono.
- **Paso 2: Reserva temporal**
  - El sistema reserva los boletos por X minutos (15–30 min).
  - Genera código de reserva único.
  - Estado boletos: RESERVADO (no vendido).
  - Enviar email con números reservados, QR de pago, link de WhatsApp pre-llenado, tiempo límite.
- **Paso 3: Pago por WhatsApp**
  - Usuario envía captura del pago por WhatsApp incluyendo el código de reserva.
  - Admin verifica el pago manualmente.
- **Paso 4: Confirmación manual (Admin)**
  - Panel con lista de reservas pendientes.
  - Botón “Confirmar Pago”.
  - Al confirmar: boletos cambian a VENDIDO, se envía email de confirmación, se cancela expiración.
- **Paso 5: Expiración automática**
  - Si vence el tiempo: boletos vuelven a DISPONIBLE.
  - Reserva pasa a EXPIRADO.
  - Enviar email de expiración.

## Estructura de Datos (Supabase)
- **Tabla: raffles**
  - id, titulo, descripcion, precio_boleto, total_boletos, fecha_sorteo, imagen_url, estado: ACTIVA|FINALIZADA|CANCELADA
- **Tabla: tickets**
  - id, raffle_id(FK), numero, estado: DISPONIBLE|RESERVADO|VENDIDO, reserva_id(FK, nullable), comprador_nombre, comprador_email, comprador_telefono, created_at
- **Tabla: reservas**
  - id, codigo único (ej: RES-ABC123), raffle_id(FK), usuario_nombre, usuario_email, usuario_telefono, numeros_reservados (array/JSON), monto_total, estado: PENDIENTE|CONFIRMADO|EXPIRADO|CANCELADO, fecha_expiracion, comprobante_url(opcional), created_at, confirmed_at

## API (Next.js)
- **POST /api/reservas/crear**
  - Valida disponibilidad, crea reserva PENDIENTE con expiración, marca tickets RESERVADO, programa expiración, envía email con QR e instrucciones, retorna código de reserva.
- **GET /api/reservas/[codigo]**
  - Consulta estado y detalle de la reserva.
- **POST /api/admin/confirmar-pago** (solo admin)
  - Cambia reserva a CONFIRMADO, tickets a VENDIDO, envía email de confirmación.
- **CRON /api/cron/expirar-reservas**
  - Corre cada 5 min: busca reservas PENDIENTE vencidas, libera tickets, marca EXPIRADO, envía email de expiración.

## Emails (Resend)
- **Email de Reserva**
  - Asunto: “Reserva Confirmada – Código: RES-ABC123”.
  - Contenido: rifa, números reservados, total a pagar, QR, tiempo límite, código de reserva y link de WhatsApp pre-llenado.
- **Email de Confirmación**
  - Confirma compra y lista boletos oficiales (VENDIDO).
- **Email de Expiración**
  - Informa que la reserva venció y se liberaron los boletos.

### Link de WhatsApp (ejemplo)
```javascript
const codigoReserva = 'RES-ABC123'
const telefono = '591XXXXXXXX'
const whatsappLink = `https://wa.me/${telefono}?text=${encodeURIComponent(
  `Hola, realicé el pago de mi reserva ${codigoReserva}`
)}`
```

## Panel de Admin
- Dashboard con: reservas pendientes, confirmadas, expiradas.
- Ver comprobante (si existe).
- Botón “Confirmar Pago”.
- Filtros y búsqueda por estado/código/email.

## Consideraciones
- **Reservar primero, confirmar después.**
- **Expirar automáticamente las reservas no pagadas.**
- **Enviar emails en cada etapa.**
- **WhatsApp con mensaje pre-llenado y código de reserva.**
- **Panel admin simple, con confirmación manual.**
