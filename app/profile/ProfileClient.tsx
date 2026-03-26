"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ShoppingBag, MapPin, Settings, User } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { API_URL } from "@/lib/config";

interface Order {
    id: number;
    total: number;
    createdAt: string;
    isPaid: boolean;
    status?: string;
}

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
    orders: Order[];
    shippingAddress: ShippingAddress | null;
}

interface ProfileClientProps {
    initialUser: UserProfile;
}

export default function ProfileClient({ initialUser }: ProfileClientProps) {
    const router = useRouter();
    const [user, setUser] = useState(initialUser);
    const [username, setUsername] = useState(initialUser.username);
    const [isLoading, setIsLoading] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    // Shipping Address State from Initial User
    const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(initialUser.shippingAddress);

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const validateShippingForm = (data: Record<string, string>) => {
        const errors: Record<string, string> = {};
        if (!data.firstName?.trim()) errors.firstName = "First name is required";
        if (!data.lastName?.trim()) errors.lastName = "Last name is required";
        if (!data.phoneNumber?.trim()) errors.phoneNumber = "Phone number is required";
        if (!data.address1?.trim()) errors.address1 = "Address is required";
        if (!data.city?.trim()) errors.city = "City is required";
        if (!data.state?.trim()) errors.state = "State is required";
        if (!data.zipCode?.trim()) errors.zipCode = "ZIP code is required";
        if (!data.country?.trim()) errors.country = "Country is required";
        return errors;
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) {
            toast.error("Username cannot be empty");
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/users/profile/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username }),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                // Optimistically update local state
                setUser({ ...user, username: updatedUser.username });
                toast.success("Profile updated successfully");
            } else {
                toast.error("Failed to update profile");
            }
        } catch (error) {
            console.error("Failed to update profile:", error);
            toast.error("Failed to update profile");
        }
        setIsLoading(false);
    };

    const handleShippingAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const addressData = Object.fromEntries(formData.entries());

        // Validate form
        const errors = validateShippingForm(addressData as Record<string, string>);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/users/address/${user.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(addressData),
            });

            if (response.ok) {
                const data = await response.json();
                setShippingAddress(data);
                toast.success("Shipping address saved successfully");
            } else {
                toast.error("Failed to save shipping address");
            }
        } catch (error) {
            console.error("Failed to save shipping address:", error);
            toast.error("Failed to save shipping address");
        }
        setIsLoading(false);
    };

    const handleLogout = async () => {
        try {
            await logoutAction();
            toast.success("Logged out successfully");
            toast.success("Logged out successfully");
            // Force a hard reload to ensure all client-side state is reset
            window.location.href = "/";

        } catch (error) {
            console.error("Error during logout:", error);
            toast.error("Failed to logout. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
            <div className="mx-auto max-w-5xl">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 tracking-tight">My Account</h1>

                <Tabs defaultValue="profile" className="space-y-8">
                    <TabsList className="bg-white p-1 rounded-xl border shadow-sm w-full md:w-auto inline-flex h-auto">
                        <TabsTrigger value="profile" className="flex-1 md:flex-none px-6 py-2.5 data-[state=active]:bg-black data-[state=active]:text-white rounded-lg transition-all">
                            <User className="h-4 w-4 mr-2" /> Profile
                        </TabsTrigger>
                        <TabsTrigger value="orders" className="flex-1 md:flex-none px-6 py-2.5 data-[state=active]:bg-black data-[state=active]:text-white rounded-lg transition-all">
                            <ShoppingBag className="h-4 w-4 mr-2" /> Orders
                        </TabsTrigger>
                        <TabsTrigger value="shipping" className="flex-1 md:flex-none px-6 py-2.5 data-[state=active]:bg-black data-[state=active]:text-white rounded-lg transition-all">
                            <MapPin className="h-4 w-4 mr-2" /> Address
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="flex-1 md:flex-none px-6 py-2.5 data-[state=active]:bg-black data-[state=active]:text-white rounded-lg transition-all">
                            <Settings className="h-4 w-4 mr-2" /> Settings
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="animate-in fade-in-50 slide-in-from-left-2 duration-300">
                        <div className="bg-white p-8 rounded-2xl border shadow-sm max-w-2xl">
                            <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="max-w-md"
                                    />
                                    <p className="text-sm text-gray-500">This is your public display name.</p>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        value={user.email}
                                        disabled
                                        className="max-w-md bg-gray-50 text-gray-500 cursor-not-allowed"
                                    />
                                    <p className="text-sm text-gray-500">Email cannot be changed.</p>
                                </div>
                                <Button type="submit" disabled={isLoading} className="bg-black hover:bg-gray-800 text-white">
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </Button>
                            </form>
                        </div>
                    </TabsContent>

                    <TabsContent value="orders" className="animate-in fade-in-50 slide-in-from-left-2 duration-300">
                        <div className="bg-white p-8 rounded-2xl border shadow-sm">
                            <h2 className="text-xl font-semibold mb-6">Order History</h2>
                            {user.orders && user.orders.length > 0 ? (
                                <div className="grid gap-4">
                                    {user.orders.map((order) => (
                                        <div
                                            key={order.id}
                                            onClick={() => router.push(`/order/${order.id}`)}
                                            className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-xl border hover:border-black/50 transition-all cursor-pointer hover:shadow-md bg-gray-50/50 hover:bg-white"
                                        >
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${order.isPaid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                                        {order.isPaid ? "Paid" : "Pending"}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-right mt-4 sm:mt-0">
                                                <p className="font-bold text-lg">${Number(order.total).toFixed(2)}</p>
                                                <p className="text-sm text-gray-500 group-hover:text-black transition-colors">View Details →</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
                                        <ShoppingBag className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
                                    <p className="text-gray-500 mt-1 mb-6">Looks like you haven't placed any orders yet.</p>
                                    <Button onClick={() => router.push("/")} variant="outline">Start Shopping</Button>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="shipping" className="animate-in fade-in-50 slide-in-from-left-2 duration-300">
                        <div className="bg-white p-8 rounded-2xl border shadow-sm max-w-3xl">
                            <h2 className="text-xl font-semibold mb-6">
                                {shippingAddress ? "Edit Shipping Address" : "Add Shipping Address"}
                            </h2>
                            <form onSubmit={handleShippingAddressSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input id="firstName" name="firstName" defaultValue={shippingAddress?.firstName} className={formErrors.firstName ? "border-red-500" : ""} />
                                        {formErrors.firstName && <p className="text-xs text-red-500">{formErrors.firstName}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input id="lastName" name="lastName" defaultValue={shippingAddress?.lastName} className={formErrors.lastName ? "border-red-500" : ""} />
                                        {formErrors.lastName && <p className="text-xs text-red-500">{formErrors.lastName}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phoneNumber">Phone Number</Label>
                                        <Input id="phoneNumber" name="phoneNumber" defaultValue={shippingAddress?.phoneNumber} className={formErrors.phoneNumber ? "border-red-500" : ""} />
                                        {formErrors.phoneNumber && <p className="text-xs text-red-500">{formErrors.phoneNumber}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="address1">Address Line 1</Label>
                                        <Input id="address1" name="address1" defaultValue={shippingAddress?.address1} className={formErrors.address1 ? "border-red-500" : ""} />
                                        {formErrors.address1 && <p className="text-xs text-red-500">{formErrors.address1}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                                        <Input id="address2" name="address2" defaultValue={shippingAddress?.address2 || ""} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input id="city" name="city" defaultValue={shippingAddress?.city} className={formErrors.city ? "border-red-500" : ""} />
                                        {formErrors.city && <p className="text-xs text-red-500">{formErrors.city}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="state">State</Label>
                                        <Input id="state" name="state" defaultValue={shippingAddress?.state} className={formErrors.state ? "border-red-500" : ""} />
                                        {formErrors.state && <p className="text-xs text-red-500">{formErrors.state}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="zipCode">ZIP Code</Label>
                                        <Input id="zipCode" name="zipCode" defaultValue={shippingAddress?.zipCode} className={formErrors.zipCode ? "border-red-500" : ""} />
                                        {formErrors.zipCode && <p className="text-xs text-red-500">{formErrors.zipCode}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Input id="country" name="country" defaultValue={shippingAddress?.country} className={formErrors.country ? "border-red-500" : ""} />
                                        {formErrors.country && <p className="text-xs text-red-500">{formErrors.country}</p>}
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button type="submit" disabled={isLoading} className="bg-black hover:bg-gray-800 text-white min-w-[150px]">
                                        {isLoading ? "Saving..." : "Save Address"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </TabsContent>

                    <TabsContent value="settings" className="animate-in fade-in-50 slide-in-from-left-2 duration-300">
                        <div className="bg-white p-8 rounded-2xl border shadow-sm max-w-2xl">
                            <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
                            <div className="p-6 bg-red-50 rounded-xl border border-red-100">
                                <h3 className="text-lg font-medium text-red-900 mb-2">Danger Zone</h3>
                                <p className="text-sm text-red-600 mb-6">
                                    Signing out will remove your session data from this device. You will need to log in again to access your account.
                                </p>
                                <Button
                                    variant="destructive"
                                    onClick={() => setShowLogoutDialog(true)}
                                >
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Logout</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to logout? You will need to login again to access your account.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={handleLogout}>Logout</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
