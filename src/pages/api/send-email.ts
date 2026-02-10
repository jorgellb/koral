import nodemailer from 'nodemailer';

export const prerender = false;

export async function POST({ request }: any) {
    try {
        const data = await request.json();
        const { name, email, phone, reason, time, message } = data;

        // Get credentials from environment
        const smtpHost = import.meta.env.SMTP_HOST || 'smtp.ionos.es';
        const smtpPort = parseInt(import.meta.env.SMTP_PORT || '465');
        const smtpUser = import.meta.env.SMTP_USER;
        const smtpPass = import.meta.env.SMTP_PASS;
        const recipientEmail = import.meta.env.RECIPIENT_EMAIL || 'koraldentalclinic@gmail.com';

        if (!smtpUser || !smtpPass) {
            return new Response(JSON.stringify({
                error: 'Faltan credenciales SMTP (SMTP_USER, SMTP_PASS)'
            }), { status: 500 });
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465, // true for 465, false for other ports
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        });

        const isAppointment = !!(reason || time);
        const subject = isAppointment
            ? `Nueva Solicitud de Cita: ${name}`
            : `Nuevo Mensaje de Contacto: ${name}`;

        // Create HTML content
        const htmlContent = `
            <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 24px; color: #0f172a; line-height: 1.6;">
                <h2 style="color: #2563eb; margin-bottom: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; font-size: 24px;">
                    ${isAppointment ? 'Solicitud de Cita' : 'Mensaje de Contacto'}
                </h2>
                
                <div style="background-color: #f8fafc; padding: 24px; border-radius: 16px; margin-bottom: 24px;">
                    <p style="margin: 0; margin-bottom: 12px;"><strong>Nombre:</strong> ${name}</p>
                    <p style="margin: 0; margin-bottom: 12px;"><strong>Email:</strong> ${email}</p>
                    <p style="margin: 0; margin-bottom: 12px;"><strong>Teléfono:</strong> ${phone}</p>
                    ${reason ? `<p style="margin: 0; margin-bottom: 12px;"><strong>Motivo:</strong> ${reason}</p>` : ''}
                    ${time ? `<p style="margin: 0; margin-bottom: 12px;"><strong>Horario preferido:</strong> ${time}</p>` : ''}
                </div>

                <div style="border-left: 4px solid #2563eb; padding-left: 20px; font-style: italic; color: #475569; margin-bottom: 24px;">
                    <p style="margin: 0;">"${message}"</p>
                </div>

                <div style="border-top: 1px solid #e2e8f0; pt: 24px; font-size: 12px; color: #94a3b8; text-align: center;">
                    <p>Enviado desde el formulario de la web Clinica Koral Dental</p>
                </div>
            </div>
        `;

        // Send email
        await transporter.sendMail({
            from: `"Web Clinica Koral" <${smtpUser}>`,
            to: recipientEmail,
            replyTo: email,
            subject: subject,
            html: htmlContent,
            text: `Nombre: ${name}\nEmail: ${email}\nTeléfono: ${phone}\nMensaje: ${message}`,
        });

        return new Response(JSON.stringify({
            message: 'Email enviado correctamente'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('SMTP Error:', error);
        return new Response(JSON.stringify({
            error: error.message || 'Error enviando el email'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
