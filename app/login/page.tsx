"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2, RefreshCw } from "lucide-react";
import { sendOtpAction, verifyOtpAction } from "@/app/actions/auth";
import { toast } from "sonner";
import Link from "next/link";

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect") || "/";

    const [step, setStep] = useState<1 | 2>(1);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(0);

    // Timer logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleSendOtp = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!email || !username) {
            toast.error("Please enter both username and email");
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append("email", email);
        formData.append("username", username);

        const res = await sendOtpAction(formData);
        setIsLoading(false);

        if (res.success) {
            setStep(2);
            setTimer(30);
            toast.success("OTP sent to your email");
        } else {
            toast.error(res.message);
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length !== 4) {
            toast.error("Please enter a valid 4-digit code");
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append("email", email);
        formData.append("otp", otp);

        const res = await verifyOtpAction(formData);
        setIsLoading(false);

        if (res.success) {
            toast.success("Logged in successfully!");
            toast.success("Logged in successfully!");
            // Redirect to the intended page or home with a hard reload to ensure layout updates
            window.location.href = redirectUrl as string;
        } else {
            toast.error(res.message);
            setOtp("");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md shadow-lg">
                {step === 1 ? (
                    <>
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
                            <CardDescription className="text-center">
                                Enter your details to access your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSendOtp} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        placeholder="Your Name"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Continue"}
                                </Button>
                            </form>
                        </CardContent>
                    </>
                ) : (
                    <>
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold text-center">Verify Identity</CardTitle>
                            <CardDescription className="text-center">
                                Enter the 4-digit code sent to <strong>{email}</strong>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center space-y-6">
                            <div className="space-y-2">
                                <InputOTP
                                    maxLength={4}
                                    value={otp}
                                    onChange={(value) => setOtp(value)}
                                    disabled={isLoading}
                                >
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                        <InputOTPSlot index={3} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>

                            <div className="flex flex-col items-center gap-4 w-full">
                                <Button
                                    onClick={handleVerifyOtp}
                                    className="w-full bg-black text-white hover:bg-gray-800"
                                    disabled={isLoading || otp.length !== 4}
                                >
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify & Login"}
                                </Button>

                                <div className="text-sm text-center">
                                    {timer > 0 ? (
                                        <span className="text-gray-500">Resend code in {timer}s</span>
                                    ) : (
                                        <button
                                            onClick={(e) => handleSendOtp(e)}
                                            className="text-black underline font-medium hover:text-gray-700 flex items-center justify-center gap-1"
                                            disabled={isLoading}
                                        >
                                            <RefreshCw className="h-3 w-3" /> Resend Code
                                        </button>
                                    )}
                                </div>

                                <Button
                                    variant="link"
                                    onClick={() => setStep(1)}
                                    className="text-gray-500"
                                    disabled={isLoading}
                                >
                                    Change Email/Username
                                </Button>
                            </div>
                        </CardContent>
                    </>
                )}
            </Card>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
