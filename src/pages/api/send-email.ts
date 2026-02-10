export const prerender = false;

async function getAccessToken(clientId: string, clientSecret: string, refreshToken: string) {
    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
        }),
    });

    const data: any = await response.json();
    if (!response.ok) {
        throw new Error(`Failed to get access token: ${JSON.stringify(data)}`);
    }
    return data.access_token;
}

function createMimeMessage(fromName: string, fromEmail: string, to: string, replyTo: string, subject: string, html: string, text: string) {
    // Basic MIME message construction
    // Cloudflare Workers support Buffer with nodejs_compat or polyfills
    const encodedSubject = Buffer.from(subject).toString('base64');
    const boundary = '----=_Part_' + Math.random().toString(36).substring(2);

    const message = [
        `From: "${fromName}" <${fromEmail}>`,
        `To: ${to}`,
        `Reply-To: ${replyTo}`,
        `Subject: =?utf-8?B?${encodedSubject}?=`,
        'MIME-Version: 1.0',
        `Content-Type: multipart/alternative; boundary="${boundary}"`,
        '',
        `--${boundary}`,
        'Content-Type: text/plain; charset=utf-8',
        'Content-Transfer-Encoding: base64',
        '',
        Buffer.from(text).toString('base64'),
        '',
        `--${boundary}`,
        'Content-Type: text/html; charset=utf-8',
        'Content-Transfer-Encoding: base64',
        '',
        Buffer.from(html).toString('base64'),
        '',
        `--${boundary}--`,
    ].join('\r\n');

    return Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

export async function POST({ request }: any) {
    try {
        const data = await request.json();
        const { name, email, phone, reason, time, message } = data;

        // Use environment variables for security
        const gmailUser = import.meta.env.GMAIL_USER || 'clinicakoralweb@gmail.com';
        const clientId = import.meta.env.GMAIL_CLIENT_ID || '';
        const clientSecret = import.meta.env.GMAIL_CLIENT_SECRET || '';
        const refreshToken = import.meta.env.GMAIL_REFRESH_TOKEN || '';
        const recipientEmail = import.meta.env.RECIPIENT_EMAIL || 'koraldentalclinic@gmail.com';

        if (!clientId || !clientSecret || !refreshToken) {
            throw new Error('Missing GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET or GMAIL_REFRESH_TOKEN in environment variables (Cloudflare Secrets)');
        }

        const isAppointment = !!(reason || time);
        const subject = isAppointment
            ? `Nueva cita web - ${reason || 'Consulta'}`
            : `Nueva consulta web - ${name}`;

        const htmlContent = `
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                <div style="background: #0f172a; padding: 32px; text-align: center;">
                    <h1 style="color: white; font-size: 24px; margin: 0;">${isAppointment ? 'Solicitud de Cita' : 'Nueva Consulta'}</h1>
                    <p style="color: #94a3b8; font-size: 14px; margin-top: 8px;">Formulario web - Clinica Dental Koral</p>
                </div>
                <div style="padding: 32px; background: white;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; width: 30%;">Paciente</td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 15px; font-weight: 700; color: #0f172a;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase;">Email</td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 15px; color: #0f172a;"><a href="mailto:${email}" style="color: #0ea5e9; text-decoration: none;">${email}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase;">Teléfono</td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 15px; color: #0f172a;"><a href="tel:${phone}" style="color: #0ea5e9; text-decoration: none;">${phone}</a></td>
                        </tr>
                        ${reason ? `
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase;">Motivo</td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 15px; font-weight: 700; color: #0ea5e9;">${reason}</td>
                        </tr>
                        ` : ''}
                        ${time ? `
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase;">Horario</td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 15px; color: #0f172a;">${time}</td>
                        </tr>
                        ` : ''}
                        ${message ? `
                        <tr>
                            <td style="padding: 12px 0; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; vertical-align: top;">Mensaje</td>
                            <td style="padding: 12px 0; font-size: 15px; color: #0f172a; line-height: 1.6;">${message}</td>
                        </tr>
                        ` : ''}
                    </table>
                </div>
                <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="color: #94a3b8; font-size: 11px; margin: 0;">Este correo ha sido generado automáticamente desde el sitio web clinicadentalkoral.es</p>
                </div>
            </div>
        `;

        const textContent = `Nueva solicitud desde la web\n\nPaciente: ${name}\nEmail: ${email}\nTeléfono: ${phone}\n${reason ? `Motivo: ${reason}\n` : ''}${time ? `Horario: ${time}\n` : ''}${message ? `Mensaje: ${message}` : ''}`;

        // Get Access Token
        const accessToken = await getAccessToken(clientId, clientSecret, refreshToken);

        // Create MIME message
        const rawMessage = createMimeMessage(
            "Web Clinica Koral",
            gmailUser,
            recipientEmail,
            email, // replyTo
            subject,
            htmlContent,
            textContent
        );

        // Send via Gmail API
        const gmailResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                raw: rawMessage,
            }),
        });

        if (!gmailResponse.ok) {
            const errorDetails = await gmailResponse.json();
            throw new Error(`Gmail API error: ${JSON.stringify(errorDetails)}`);
        }

        return new Response(JSON.stringify({ success: true, message: 'Email sent successfully via Gmail API' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Error sending email:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'Failed to send email',
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}


