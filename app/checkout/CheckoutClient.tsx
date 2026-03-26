"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckIcon, CreditCardIcon, TicketIcon, MapPinIcon, Loader2 } from "lucide-react";
import { createOrder } from "@/app/actions/order";
import { validateCoupon } from "@/app/actions/coupon";
import { formatPrice } from "@/lib/utils";
import { API_URL } from '@/lib/config';

interface ShippingAddress {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

interface UserProfile {
    id: number;
    email: string;
    username: string;
    shippingAddress: ShippingAddress | null;
}

interface CheckoutClientProps {
    initialUser: UserProfile;
}

const CheckoutClient = ({ initialUser }: CheckoutClientProps) => {
    const router = useRouter();
    const { items, clearCart } = useCartStore();

    // Redirect if cart is empty
    useEffect(() => {
        if (items.length === 0) {
            router.replace("/");
        }
    }, [items, router]);

    const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(
        initialUser.shippingAddress || {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            address1: "",
            address2: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
        }
    );

    const [paymentMethod, setPaymentMethod] = useState("cod"); // Default to Cash on Delivery
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discountPercent) / 100 : 0;
    const total = subtotal - discountAmount;

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingAddress((prev) => ({ ...prev, [name]: value }));
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error("Please enter a coupon code");
            return;
        }

        setIsValidatingCoupon(true);
        try {
            const result = await validateCoupon(couponCode);
            if (result.valid) {
                setAppliedCoupon({
                    code: result.code,
                    discountPercent: result.discountPercent,
                });
                toast.success(`Coupon "${result.code}" applied! You saved ${result.discountPercent}%`);
            } else {
                setAppliedCoupon(null);
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Failed to validate coupon");
        } finally {
            setIsValidatingCoupon(false);
        }
    };

    const handlePlaceOrder = async () => {
        if (!shippingAddress.firstName || !shippingAddress.address1 || !shippingAddress.phoneNumber) {
            toast.error("Please fill in all required shipping details");
            return;
        }

        setIsProcessing(true);
        try {
            const orderData = {
                userId: initialUser.id,
                items: items.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    size: item.sizeName,
                    quantity: item.quantity,
                    price: item.price,
                })),
                shippingAddress,
                paymentMethod,
                total,
                couponCode: appliedCoupon?.code,
                couponDiscount: appliedCoupon?.discountPercent,
            };

            const order = await createOrder(orderData);

            toast.success("Order placed successfully!");
            clearCart();
            // router.push(`/order/${order.id}`); // Assuming backend returns created order with ID
            // For now redirect to profile or home as order success page might not verify
            window.location.href = "/profile";
        } catch (error: any) {
            toast.error(error.message || "Failed to place order");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-center tracking-tight">Checkout</h1>

            <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
                {/* Left Column: Shipping & Payment */}
                <div className="lg:w-3/5 space-y-8">
                    {/* Shipping Address */}
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <MapPinIcon className="h-5 w-5" />
                            <h2 className="text-xl font-semibold">Shipping Address</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" name="firstName" value={shippingAddress.firstName} onChange={handleAddressChange} placeholder="John" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" name="lastName" value={shippingAddress.lastName} onChange={handleAddressChange} placeholder="Doe" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="address1">Address</Label>
                                <Input id="address1" name="address1" value={shippingAddress.address1} onChange={handleAddressChange} placeholder="123 Main St" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="address2">Apartment, suite, etc. (optional)</Label>
                                <Input id="address2" name="address2" value={shippingAddress.address2} onChange={handleAddressChange} placeholder="Apt 4B" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" name="city" value={shippingAddress.city} onChange={handleAddressChange} placeholder="New York" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state">State</Label>
                                <Input id="state" name="state" value={shippingAddress.state} onChange={handleAddressChange} placeholder="NY" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="zipCode">ZIP Code</Label>
                                <Input id="zipCode" name="zipCode" value={shippingAddress.zipCode} onChange={handleAddressChange} placeholder="10001" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input id="country" name="country" value={shippingAddress.country} onChange={handleAddressChange} placeholder="United States" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="phoneNumber">Phone</Label>
                                <Input id="phoneNumber" name="phoneNumber" value={shippingAddress.phoneNumber} onChange={handleAddressChange} placeholder="+1 (555) 000-0000" />
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <CreditCardIcon className="h-5 w-5" />
                            <h2 className="text-xl font-semibold">Payment Method</h2>
                        </div>

                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                            <div className={`flex items-center space-x-3 border p-4 rounded-lg cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
                                <RadioGroupItem value="cod" id="cod" />
                                <Label htmlFor="cod" className="flex-1 cursor-pointer font-medium">Cash on Delivery (COD)</Label>
                            </div>
                            <div className={`flex items-center space-x-3 border p-4 rounded-lg cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
                                <RadioGroupItem value="online" id="online" />
                                <Label htmlFor="online" className="flex-1 cursor-pointer font-medium">Online Payment (Credit/Debit/UPI)</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:w-2/5">
                    <div className="bg-white p-6 rounded-xl border shadow-sm sticky top-8">
                        <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 mb-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 py-2 border-b last:border-0">
                                    <div className="relative aspect-square h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                        <img
                                            src={item.image.startsWith('http') ? item.image : `${API_URL}${item.image}`}
                                            alt={item.name}
                                            className="object-cover w-full h-full"
                                        />
                                        <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm text-gray-900">{item.name} - {item.sizeName}</p>
                                    </div>
                                    <div className="text-sm font-medium">
                                        {formatPrice(item.price * item.quantity)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Coupon Code */}
                        <div className="flex gap-2 mb-6">
                            <Input
                                placeholder="Discount code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                disabled={!!appliedCoupon}
                            />
                            {appliedCoupon ? (
                                <Button variant="outline" onClick={() => { setAppliedCoupon(null); setCouponCode(""); }}>
                                    Remove
                                </Button>
                            ) : (
                                <Button onClick={handleApplyCoupon} disabled={!couponCode || isValidatingCoupon}>
                                    {isValidatingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                                </Button>
                            )}
                        </div>

                        {/* Totals */}
                        <div className="space-y-2 border-t pt-4 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            {appliedCoupon && (
                                <div className="flex justify-between text-green-600">
                                    <span className="flex items-center gap-1"><TicketIcon className="h-3 w-3" /> Discount ({appliedCoupon.code})</span>
                                    <span>-{formatPrice(discountAmount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 mt-2 border-t">
                                <span>Total</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                        </div>

                        <Button
                            className="w-full bg-black text-white hover:bg-gray-800 mt-6 h-12 text-lg"
                            onClick={handlePlaceOrder}
                            disabled={isProcessing || items.length === 0}
                        >
                            {isProcessing ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin" /> Processing...
                                </div>
                            ) : (
                                `Pay ${formatPrice(total)}`
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutClient;
