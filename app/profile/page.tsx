import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ProfileClient from './ProfileClient';
import { API_URL } from "@/lib/config";

async function getUserProfile(userId: string) {
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

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get('userId');

  if (!userIdCookie) {
    redirect('/');
  }

  const userId = userIdCookie.value;
  const userProfile = await getUserProfile(userId);

  if (!userProfile) {
    // Handle case where cookie exists but user not found in DB
    redirect('/');
  }

  return <ProfileClient initialUser={userProfile} />;
}
