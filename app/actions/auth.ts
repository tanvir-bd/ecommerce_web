'use server'

import { cookies } from 'next/headers';

import { API_URL } from '@/lib/config';

const API_BASE_URL = API_URL;

export async function sendOtpAction(formData: FormData) {
    const email = formData.get('email') as string;
    const username = formData.get('username') as string;

    if (!email || !username) {
        return { success: false, message: 'Email and Username are required' };
    }

    try {
        const res = await fetch(`${API_BASE_URL}/auth/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username }),
            cache: 'no-store',
        });

        const data = await res.json();

        if (!res.ok) {
            return { success: false, message: data.message || 'Failed to send OTP' };
        }

        return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
        console.error('Send OTP Error:', error);
        return { success: false, message: 'Something went wrong. Please try again.' };
    }
}

export async function verifyOtpAction(formData: FormData) {
    const email = formData.get('email') as string;
    const otp = formData.get('otp') as string;

    if (!email || !otp) {
        return { success: false, message: 'Email and OTP are required' };
    }

    try {
        const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp }),
            cache: 'no-store',
        });

        const data = await res.json();

        if (!res.ok) {
            return { success: false, message: data.message || 'Failed to verify OTP' };
        }

        // Store user info and token to cookies
        const cookieStore = await cookies();

        // Store user ID for session management
        // Note: secure is set to true for HTTPS production environment
        cookieStore.set('userId', data.id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/'
        });

        // Store user info for frontend access (if needed, but usually httpOnly is better)
        // We can store a non-httpOnly cookie for username/email display
        cookieStore.set('userInfo', JSON.stringify({ id: data.id, username: data.username, email: data.email }), {
            httpOnly: false, // Allow client JS to read for UI display
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/'
        });

        // Store separate cookies for username and email
        cookieStore.set('username', data.username, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/'
        });

        cookieStore.set('useremail', data.email, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/'
        });

        return { success: true, message: 'Login successful', user: data };
    } catch (error) {
        console.error('Verify OTP Error:', error);
        return { success: false, message: 'Something went wrong. Please try again.' };
    }
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('userId');
    cookieStore.delete('userInfo');
    cookieStore.delete('username');
    cookieStore.delete('useremail');
    return { success: true };
}
