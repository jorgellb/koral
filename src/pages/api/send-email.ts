import nodemailer from 'nodemailer';

export const prerender = false;

export async function POST({ request }: any) {
    const data = await request.json();
    const { name, email, reason, time, phone } = data;

    // Use environment variables for security
    const gmailUser = import.meta.env.GMAIL_USER || 'clinicakoralweb@gmail.com';
    const clientId = import.meta.env.GMAIL_CLIENT_ID || '';
    const clientSecret = import.meta.env.GMAIL_CLIENT_SECRET || '';
    const refreshToken = import.meta.env.GMAIL_REFRESH_TOKEN || '';
    const accessToken = import.meta.env.GMAIL_ACCESS_TOKEN || '';
    const recipientEmail = import.meta.env.RECIPIENT_EMAIL || 'koraldentalclinic@gmail.com';

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: gmailUser,
            clientId,
            clientSecret,
            refreshToken,
            accessToken
        }
    });

    const mailOptions = {
        from: `"${name}" <web@clinicadentalkoral.es>`,
        to: recipientEmail,
        subject: `Nueva cita web - ${reason}`,
        html: `
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 16px; overflow: hidden;">
                <div style="background: #0f172a; padding: 32px; text-align: center;">
                    <h1 style="color: white; font-size: 24px; margin: 0;">Nueva Solicitud de Cita</h1>
                    <p style="color: #94a3b8; font-size: 14px; margin-top: 8px;">Formulario web - Clinica Dental Koral</p>
                </div>
                <div style="padding: 32px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase;">Paciente</td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-size: 15px; font-weight: 700; color: #0f172a;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase;">Email</td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-size: 15px; color: #0f172a;"><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase;">Telefono</td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-size: 15px; color: #0f172a;"><a href="tel:${phone}" style="color: #2563eb;">${phone}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase;">Motivo</td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-size: 15px; font-weight: 700; color: #2563eb;">${reason}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase;">Horario</td>
                            <td style="padding: 12px 0; font-size: 15px; color: #0f172a;">${time}</td>
                        </tr>
                    </table>
                </div>
                <div style="background: #f1f5f9; padding: 16px 32px; text-align: center;">
                    <p style="color: #94a3b8; font-size: 11px; margin: 0;">Enviado desde el formulario de clinicadentalkoral.es</p>
                </div>
            </div>
        `,
        text: `Nueva cita desde la web\n\nPaciente: ${name}\nEmail: ${email}\nTelefono: ${phone}\nMotivo: ${reason}\nHorario: ${time}`
    };

    try {
        await transporter.sendMail(mailOptions);
        return new Response(JSON.stringify({ message: 'Email sent successfully' }), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return new Response(JSON.stringify({ error: 'Failed to send email' }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
