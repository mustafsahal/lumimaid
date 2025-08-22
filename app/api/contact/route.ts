import { NextResponse } from 'next/server';

// Opt out of caching for this route
export const dynamic = 'force-dynamic';

interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  topic?: string;
  message: string;
  file?: string;
}

/**
 * Handle POST requests from the contact form
 * Validates payload, forwards to CRM if configured, and sends an auto-reply via Resend
 */
export async function POST(req: Request) {
  try {
    const data = (await req.json()) as Partial<ContactPayload>;
    const { name, email, phone, topic, message, file } = data;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    // Forward submission to CRM webhook if provided
    const webhook = process.env.CRM_WEBHOOK_URL;
    if (webhook) {
      try {
        await fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, topic, message, file }),
        });
      } catch (err) {
        console.error('Error sending to CRM webhook:', err);
      }
    }

    // Send auto-reply via Resend if API key and sender are configured
    const resendApiKey = process.env.RESEND_API_KEY;
    const resendFrom = process.env.RESEND_FROM;
    if (resendApiKey && resendFrom) {
      const replySubject = `Thanks for contacting LumiMaid`;
      const replyText =
        `Hi ${name},\n\n` +
        `Thank you for reaching out to LumiMaid! We’ve received your message about '${topic ?? 'General'}' and will get back to you shortly.\n\n` +
        `If your matter is urgent, feel free to call us at (612) 888-7916.\n\n` +
        `Best regards,\n` +
        `The LumiMaid Team`;

      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: resendFrom,
            to: email,
            subject: replySubject,
            text: replyText,
          }),
        });
      } catch (err) {
        console.error('Error sending auto-reply via Resend:', err);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Unable to process your request. Please try again later.' },
      { status: 500 }
    );
  }
}
