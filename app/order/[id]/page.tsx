import { getOrderById } from "@/app/actions/order";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Clock, Package, Truck, XCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { API_URL } from '@/lib/config';

interface OrderPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
    const { id } = await params;
    const orderId = parseInt(id);

    if (isNaN(orderId)) {
        return notFound();
    }

    const order = await getOrderById(orderId);

    if (!order) {
        return notFound();
    }

    // Calculate discount if MRP is available, otherwise assume 0
    // In a real app, product might have an 'mrp' or 'originalPrice' field.
    // Here we will use the order item's price as the selling price.
    // If `product` in backend has `price` vs `salePrice`, we could calculate savings.
    // For now, we'll try to deduce from backend data structure.

    // Based on the orders.service.ts, items include 'product'.
    // Let's assume order.items[i].product.price might be the MRP if it exists, 
    // and order.items[i].price is the sold price.

    // Calculate total savings
    let totalSavings = 0;
    let totalMRP = 0;

    order.items.forEach((item: any) => {
        const originalPrice = item.product?.price || item.price; // Fallback to sold price if no product price
        // Note: item.price in OrderItem is usually the price at which it was sold.
        // If product.price is higher, that's the savings.
        // However, without strict schema knowledge of 'product.price' meaning MRP, 
        // we might just show the sold price.
        // Let's check if we have a way to know discount. 
        // The previous page showed "29% off".

        // For now, let's just sum up the totals as per order record.
        // If couponDiscount is present, that's a saving.
        totalMRP += (item.price * item.quantity);
    });

    // If there's a coupon discount, that is the savings
    const couponDiscount = order.couponDiscount || 0;
    // If we had original MRP in line items we'd add that too. 
    // Since we don't strictly know 'original price' from the `items` include in `orders.service.ts` 
    // (it just includes `product: true`, standard Prisma fetch), 
    // we will rely on `couponDiscount` for explicit savings display for now, 
    // or just show the totals as recorded.

    // Helper to format currency
    // Helper to format currency
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    // Status Helper
    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered': return <CheckCircle2 className="w-[50px] h-[50px] text-green-500 mr-2 flex-shrink-0" />;
            case 'cancelled': return <XCircle className="w-[50px] h-[50px] text-red-500 mr-2 flex-shrink-0" />;
            case 'shipped': return <Truck className="w-[50px] h-[50px] text-blue-500 mr-2 flex-shrink-0" />;
            default: return <Package className="w-[50px] h-[50px] text-orange-500 mr-2 flex-shrink-0" />;
        }
    };

    const getStatusMessage = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered': return "Your order has been delivered";
            case 'cancelled': return "Your order has been cancelled";
            case 'shipped': return "Your order is on the way";
            case 'order_placed': return "Your order is confirmed";
            default: return `Order Status: ${status.replace('_', ' ')}`;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered': return "text-green-500";
            case 'cancelled': return "text-red-500";
            case 'shipped': return "text-blue-500";
            default: return "text-orange-500";
        }
    }


    return (
        <div className="min-h-screen bg-gray-100">
            {/* Main container for the order page content */}
            <div className="max-w-full mx-auto bg-white shadow-md">
                <div className="p-4 md:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Back to Home link */}
                        <div className="flex items-center mb-4">
                            <Link href="/" className="flex items-center text-sm font-medium hover:underline">
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Home
                            </Link>
                        </div>

                        {/* Thank You message and Order ID */}
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold uppercase">THANK YOU {order.user?.username || 'Customer'}</h1>
                            <p className="text-gray-600">Order ID: #{order.id}</p>
                        </div>

                        {/* Order Details Section */}
                        <div className="mb-6 border rounded-lg overflow-hidden">
                            <div className="flex flex-wrap">
                                {/* Order number */}
                                <div className="w-full sm:w-1/2 md:w-1/5 p-4 border-b sm:border-b-0 sm:border-r">
                                    <div className="font-semibold text-sm mb-1">
                                        ORDER NUMBER:
                                    </div>
                                    <div>#{order.id}</div>
                                </div>

                                {/* Order date */}
                                <div className="w-full sm:w-1/2 md:w-1/4 p-4 border-b md:border-b-0 md:border-r">
                                    <div className="font-semibold text-sm mb-1">DATE:</div>
                                    <div>{formatDate(order.orderDate)}</div>
                                </div>

                                {/* Customer email */}
                                <div className="w-full sm:w-1/2 md:w-1/4 p-4 sm:border-r">
                                    <div className="font-semibold text-sm mb-1">EMAIL:</div>
                                    <div className="truncate">{order.user?.email}</div>
                                </div>

                                {/* Total amount */}
                                <div className="w-full sm:w-1/2 md:w-1/4 p-4">
                                    <div className="font-semibold text-sm mb-1">TOTAL:</div>
                                    <div>{formatPrice(order.total)}</div>
                                </div>
                            </div>

                            {/* Payment method */}
                            <div className="border-t p-4 flex justify-between items-center">
                                <div>
                                    <div className="font-semibold text-sm mb-1">
                                        PAYMENT METHOD:
                                    </div>
                                    <div>{order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : order.paymentMethod}</div>
                                </div>
                                <div>
                                    <div className="font-semibold text-sm mb-1">
                                        PAYMENT STATUS:
                                    </div>
                                    <div className={`capitalize font-medium ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {order.paymentStatus.replace('_', ' ')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order confirmation and delivery information */}
                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="flex-1">
                                {/* Confirmation message */}
                                <div className="flex items-center mb-4">
                                    {getStatusIcon(order.orderStatus)}
                                    <div>
                                        <h2 className={`text-xl font-semibold capitalize ${getStatusColor(order.orderStatus)}`}>
                                            {getStatusMessage(order.orderStatus)}
                                        </h2>
                                        <p className="text-gray-600">
                                            We will notify you with updates.
                                        </p>
                                    </div>
                                </div>

                                {/* Shipping address */}
                                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                                    <div className="flex justify-between mb-2">
                                        <span className="font-medium capitalize">{order.user?.username}</span>
                                        {/* Phone number if available in address, currently stored in 'phoneNumber' in Order model if updated schema, 
                        Wait, schema check: OrdersService create uses `phoneNumber` in `data`. Prisma schema `Order` likely has `phoneNumber`.
                        Let's try to display it if it's there. 
                        Actually, looking at `orders.service.ts` create method, `street`, `city`, etc are on Order.
                      */}
                                        <span className="text-gray-600">{order.phoneNumber}</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {order.street}
                                        <br />
                                        {order.city}, {order.state}
                                        <br />
                                        ZipCode: {order.zipCode},
                                        <br />
                                        {order.country}.
                                    </p>
                                </div>

                                {/* Ordered items list */}
                                <div className="border rounded-lg p-4">
                                    {order.items.map((item: any) => (
                                        <div key={item.id} className="mb-4 last:mb-0 border-b last:border-0 pb-4 last:pb-0">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-medium">{item.quantity} Item(s)</span>
                                                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                                            </div>

                                            {/* Product details */}
                                            <div className="flex items-center">
                                                {/* 
                                Using product image from relation if available. 
                                `item.product` is included in `orders.service.ts`.
                                Assuming `product` has `images` array or `thumbnail`.
                                Checking `cart` logic: images are usually array of objects with url.
                                Let's assume `item.product.images` exists and is a JSON or relation.
                                If strict typing fails, we might need a placeholder or check schema.
                                For now, trying to access `item.product?.images?.[0]?.url` or similar.
                                If the product schema in `nest_prisma7` has `images` as `Json`, we access accordingly. 
                                `orders.service.ts` includes `items: { include: { product: true } }`.
                            */}
                                                <div className="mr-4 w-[60px] h-[60px] bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                                    {/* Safe image rendering */}
                                                    {item.product?.images && Array.isArray(item.product.images) && item.product.images.length > 0 ? (
                                                        <img
                                                            src={item.product.images[0].url.startsWith('http')
                                                                ? item.product.images[0].url
                                                                : `${API_URL}${item.product.images[0].url}`}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No Img</div>
                                                    )}
                                                </div>

                                                <div>
                                                    <h3 className="font-medium">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">{item.size} • Qty {item.quantity}</p>
                                                    <div className="flex items-center mt-1">
                                                        <span className="font-medium mr-2">{formatPrice(item.price)}</span>
                                                        {/* If we had original price/discount logic per item */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Billing and Savings Section */}
                            <div className="flex-1">
                                {/* Savings message */}
                                {couponDiscount > 0 && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                        <div className="flex items-center">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                                            <span className="text-green-700">
                                                Yay! You have saved {formatPrice((totalMRP * couponDiscount) / 100)} on this order with coupon {order.couponCode}
                                            </span>
                                        </div>
                                    </div>
                                )}


                                {/* Bill details */}
                                <div className="bg-gray-100 rounded-lg p-4">
                                    <h2 className="text-lg font-semibold mb-4">Bill Details</h2>
                                    <div className="space-y-2">
                                        {/* Subtotal before discount */}
                                        <div className="flex justify-between">
                                            <span>Subtotal</span>
                                            <span>{formatPrice(totalMRP)}</span>
                                        </div>

                                        {/* Total discount */}
                                        {couponDiscount > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Coupon Discount ({couponDiscount}%)</span>
                                                <span>- {formatPrice((totalMRP * couponDiscount) / 100)}</span>
                                            </div>
                                        )}

                                        {/* Shipping charges - Assuming free or included as per current logic */}
                                        <div className="flex justify-between">
                                            <span>Shipping Charges</span>
                                            <span className="text-green-600">Free</span>
                                        </div>

                                        {/* Final Total */}
                                        <div className="flex justify-between font-semibold pt-2 border-t">
                                            <span>Total</span>
                                            <span>{formatPrice(order.total)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Continue shopping button */}
                                <Link href={"/"}>
                                    <Button className="w-full mt-3 bg-black text-white hover:bg-gray-800">CONTINUE SHOPPING</Button>
                                </Link>

                                {/* View Orders button */}
                                <Link href={"/profile"}>
                                    <Button variant="outline" className="w-full mt-3">VIEW ALL ORDERS</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
