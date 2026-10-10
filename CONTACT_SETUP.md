# Portfolio contact form setup

The new **/contact** page is live in the app routes and wired to a Next.js server action in `app/contactAction.ts`. Its form accepts name, email, subject, and message. Replies go to the visitor's email, and successful delivery is reported only when the email provider accepts the message.

## Enable email delivery
1. Create an account at [Resend](https://resend.com/) and verify a sending domain (the portfolio's domain is ideal).
2. Create `.env.local` in the project root with values based on `.env.example`.
3. Set `RESEND_API_KEY` to your Resend secret API key.
4. Set `CONTACT_FROM_EMAIL` to an address on your verified sending domain, e.g. `Manee Portfolio <hello@yourdomain.com>`.
5. Restart `npm run dev`. Add both environment variables in your production host before deploying.
6. Submit a real test message on `/contact` and confirm that it arrives in **pimmaneenimitraporn@gmail.com**. The sender will be set as the email reply-to.

The recipient is fixed server-side; the form never accepts a user-provided destination. API keys must stay in server environment variables, never in `NEXT_PUBLIC_` variables. The form handles provider errors and missing configuration without claiming success. Basic spam defenses include validation, a honeypot and lightweight per-instance rate limiting. For a public high-traffic deployment, add durable rate limiting and bot protection.

## Other contact channels
- Email: pimmaneenimitraporn@gmail.com
- Phone: 0816133337

**Important:** Until `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` are configured, the form correctly reports that delivery is unavailable; it does not send mail.
