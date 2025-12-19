import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const from = process.env.EMAIL_FROM || "onboarding@resend.dev";

export async function sendSignupEmail(opts: {
  to: string;
  eventTitle: string;
  eventId: string;
  isPaid: boolean;
}) {
  const { to, eventTitle, eventId, isPaid } = opts;

  const subject = isPaid
    ? `You reserved a spot: ${eventTitle} (payment pending)`
    : `You're signed up: ${eventTitle}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.5">
      <h2>${eventTitle}</h2>
      <p>${isPaid ? "Your spot is reserved. Payment is pending." : "You're confirmed for this event."}</p>
      <p>
        View event:
        <a href="http://localhost:3000/events/${eventId}">Event page</a>
      </p>
      <p>
        View your signups:
        <a href="http://localhost:3000/my-events">My Events</a>
      </p>
    </div>
  `;

  await resend.emails.send({
    from,
    to,
    subject,
    html,
  });
}

export async function sendPaymentSuccessEmail(opts: {
  to: string;
  eventTitle: string;
  eventId: string;
}) {
  const { to, eventTitle, eventId } = opts;

  const subject = `Payment received: ${eventTitle}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.5">
      <h2>Payment successful ✅</h2>
      <p>You're confirmed for <strong>${eventTitle}</strong>.</p>
      <p>
        View event:
        <a href="http://localhost:3000/events/${eventId}">Event page</a>
      </p>
      <p>
        View your signups:
        <a href="http://localhost:3000/my-events">My Events</a>
      </p>
    </div>
  `;

  await resend.emails.send({
    from,
    to,
    subject,
    html,
  });
}
