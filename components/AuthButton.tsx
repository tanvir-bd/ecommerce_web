"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

const AuthButton = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLogin = () => {
            // Check for userInfo cookie which is exposed to client/not httpOnly
            // or check if userId exists (if not httpOnly in dev).
            // The auth action sets 'userInfo' as non-httpOnly for this purpose.
            const cookies = document.cookie.split('; ');
            const userInfoCookie = cookies.find(row => row.trim().startsWith('userInfo='));
            setIsLoggedIn(!!userInfoCookie);
        };

        checkLogin();

        // Optional: Listen for storage events or custom events if login happens in another tab
        // but for now mount check is sufficient as login redirects.
    }, []);

    if (isLoggedIn) {
        return (
            <Link href="/profile">
                <Button variant={"ghost"} size={"icon"} className="lg:flex">
                    <User size={24} />
                </Button>
            </Link>
        );
    }

    return (
        <Link href="/login">
            <Button variant={"ghost"} size={"icon"} className="lg:flex">
                <User size={24} />
            </Button>
        </Link>
    );
};

export default AuthButton;
