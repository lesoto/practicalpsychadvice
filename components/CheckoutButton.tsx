'use client';

import { useState } from 'react';
import { initiateCheckout } from '@/lib/stripe';

interface CheckoutButtonProps {
  priceId: string;
  bookTitle: string;
  quantity?: number;
  className?: string;
  children?: React.ReactNode;
}

export function CheckoutButton({
  priceId,
  bookTitle,
  quantity = 1,
  className = 'btn theme-button w-fit',
  children = `Buy ${bookTitle}`,
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await initiateCheckout(priceId, bookTitle, quantity);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={className}
      aria-busy={isLoading}
    >
      {isLoading ? 'Processing...' : children}
    </button>
  );
}
