export const prerender = false;

export async function POST({ request }: any) {
    try {
        const data = await request.json();
        const { name, email, phone, reason, time, message } = data;

        const resendApiKey = import.meta.env.RESEND_API_KEY || 're_UNWbDc3p_MepVsWdzq8fSRFHUQkWoNrH5';
        const rawRecipients = import.meta.env.RECIPIENT_EMAILS || 'koraldentalclinic@gmail.com,clinicakoralweb@gmail.com';
        const recipients = rawRecipients.split(',').map((r: string) => r.trim());

        if (!resendApiKey) {
            return new Response(JSON.stringify({
                error: 'Falta la API Key de Resend (RESEND_API_KEY)'
            }), { status: 500 });
        }

        const isAppointment = !!(reason || time);
        const subject = isAppointment
            ? `Nueva Cita: ${name}`
            : `Nuevo Contacto: ${name}`;

        // Create HTML content with premium styling
        const htmlContent = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 24px; color: #0f172a; line-height: 1.6;">
                <h2 style="color: #2563eb; margin-bottom: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; font-size: 20px;">
                    ${isAppointment ? 'Solicitud de Cita' : 'Nuevo Mensaje de Contacto'}
                </h2>
                
                <div style="background-color: #f8fafc; padding: 24px; border-radius: 16px; margin-bottom: 24px;">
                    <p style="margin: 0 0 12px 0;"><strong>Nombre:</strong> ${name}</p>
                    <p style="margin: 0 0 12px 0;"><strong>Email:</strong> ${email}</p>
                    <p style="margin: 0 0 12px 0;"><strong>Teléfono:</strong> ${phone}</p>
                    ${reason ? `<p style="margin: 0 0 12px 0;"><strong>Motivo:</strong> ${reason}</p>` : ''}
                    ${time ? `<p style="margin: 0 0 12px 0;"><strong>Horario:</strong> ${time}</p>` : ''}
                </div>

                <div style="border-left: 4px solid #2563eb; padding-left: 20px; font-style: italic; color: #475569; margin-bottom: 24px;">
                    <p style="margin: 0;">"${message}"</p>
                </div>

                <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; font-size: 12px; color: #94a3b8; text-align: center;">
                    <p>Enviado desde el formulario de Clinica Koral Dental</p>
                </div>
            </div>
        `;

        // Send via Resend API using fetch (Cloudflare compatible)
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${resendApiKey}`
            },
            body: JSON.stringify({
                from: 'Clinica Koral <onboarding@resend.dev>',
                to: recipients,
                reply_to: email,
                subject: subject,
                html: htmlContent
            })
        });

        const result = await response.json();

        if (response.ok) {
            return new Response(JSON.stringify({ message: 'Email enviado correctamente' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            throw new Error(JSON.stringify(result));
        }

    } catch (error: any) {
        console.error('Resend API Error:', error);
        return new Response(JSON.stringify({
            error: 'Error al enviar el email'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
