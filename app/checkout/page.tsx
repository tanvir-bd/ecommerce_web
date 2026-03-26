import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import CheckoutClient from './CheckoutClient';

import { API_URL } from '@/lib/config';

async function getUserProfile(userId: string) {
  // Uses imported API_URL
  try {
    const res = await fetch(`${API_URL}/users/profile/${userId}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch user profile", error);
    return null;
  }
}

export default async function CheckoutPage() {
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get('userId');

  if (!userIdCookie) {
    // If user is not logged in, redirect to login page (or home with query to login)
    // For now, redirect to login page if we have one, or home.
    // The requirement says "only logged in users can visit this checkout page"
    redirect('/login?redirect=/checkout');
  }

  const userId = userIdCookie.value;
  const userProfile = await getUserProfile(userId);

  if (!userProfile) {
    // Handle case where cookie exists but user not found in DB
    redirect('/login?redirect=/checkout');
  }

  return <CheckoutClient initialUser={userProfile} />;
}
