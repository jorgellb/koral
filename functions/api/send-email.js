/**
 * Cloudflare Pages Function — POST /api/send-email
 * Sends the website's contact and appointment forms through the Resend API.
 *
 * Configure in Cloudflare Pages → Settings → Variables and Secrets:
 *   RESEND_API_KEY    Resend API key (secret)
 *   RECIPIENT_EMAILS  comma-separated list of inboxes
 */

const FALLBACK_RECIPIENTS = 'koraldentalclinic@gmail.com,clinicakoralweb@gmail.com';

const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const { name, email, phone, reason, time, message } = data;

    const resendApiKey = env.RESEND_API_KEY;
    const recipients = (env.RECIPIENT_EMAILS || FALLBACK_RECIPIENTS).split(',').map((r) => r.trim());

    if (!resendApiKey) {
      console.error('Missing RESEND_API_KEY');
      return json({ error: 'El formulario no está configurado. Llámanos al +34 950 39 53 19.' }, 500);
    }

    const isAppointment = Boolean(reason || time);
    const subject = isAppointment ? `Nueva Cita: ${name}` : `Nuevo Contacto: ${name}`;
    const row = (label, value) => `<p style="margin: 0 0 12px 0;"><strong>${label}:</strong> ${escapeHtml(value)}</p>`;

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 24px; color: #0a1f33; line-height: 1.6;">
        <h2 style="color: #0b7c86; margin-bottom: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; font-size: 20px;">
          ${isAppointment ? 'Solicitud de Cita' : 'Nuevo Mensaje de Contacto'}
        </h2>
        <div style="background-color: #fbf8f4; padding: 24px; border-radius: 16px; margin-bottom: 24px;">
          ${row('Nombre', name)}
          ${row('Email', email)}
          ${row('Teléfono', phone)}
          ${reason ? row('Motivo', reason) : ''}
          ${time ? row('Horario', time) : ''}
        </div>
        <div style="border-left: 4px solid #f2617a; padding-left: 20px; font-style: italic; color: #475569; margin-bottom: 24px;">
          <p style="margin: 0;">"${escapeHtml(message || 'Sin mensaje')}"</p>
        </div>
        <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; font-size: 12px; color: #94a3b8; text-align: center;">
          <p>Enviado desde el formulario de Clínica Dental Koral</p>
        </div>
      </div>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Clinica Koral <web@clinicadentalkoral.es>',
        to: recipients,
        reply_to: email,
        subject,
        html: htmlContent,
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (response.ok) {
      return json({ message: 'Email enviado correctamente' });
    }
    console.error('Resend Error Response:', result);
    return json(
      { error: result.message || 'Error en la API de Resend. Verifica la configuración en Cloudflare.' },
      response.status,
    );
  } catch (error) {
    console.error('Server Internal Error:', error);
    return json({ error: 'Error interno: ' + (error?.message || 'Error desconocido') }, 500);
  }
}
