import { loadStripe } from '@stripe/stripe-js';

let stripePromise: ReturnType<typeof loadStripe>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );
  }
  return stripePromise;
};

export const initiateCheckout = async (
  priceId: string,
  bookTitle: string,
  quantity: number = 1
) => {
  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        bookTitle,
        quantity,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { url } = await response.json();

    if (url) {
      window.location.href = url;
    }
  } catch (error) {
    console.error('Checkout error:', error);
    alert('Unable to start checkout. Please try again.');
  }
};
