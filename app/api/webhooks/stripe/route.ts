import { headers } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = headers();
  const signature = headersList.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(
      `Webhook Error: ${err.message}`,
      { status: 400 }
    );
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;

      // TODO: Fulfill order
      // - Update database with order info
      // - Send confirmation email
      // - Update user account/library

      console.log(`Order completed for ${session.customer_email}`);
      break;

    case 'charge.refunded':
      const charge = event.data.object as Stripe.Charge;

      // TODO: Handle refunds
      // - Update database to mark order as refunded
      // - Send refund confirmation email

      console.log(`Refund processed for charge ${charge.id}`);
      break;

    case 'customer.subscription.updated':
      const subscription = event.data.object as Stripe.Subscription;

      // TODO: Handle subscription updates
      console.log(`Subscription updated for customer ${subscription.customer}`);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
