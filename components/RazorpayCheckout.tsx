'use client';

import { useState } from 'react';

interface RazorpayCheckoutProps {
    amount: number; // in rupees
    customerInfo: {
        name: string;
        email?: string;
        phone: string;
        address: string;
    };
    items: {
        productId: string;
        productCode?: string;
        productName: string;
        price: number;
        quantity: number;
    }[];
    sessionId?: string;
    onSuccess: (orderId: string) => void;
    onError: (error: string) => void;
    className?: string;
    children?: React.ReactNode;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

export function RazorpayCheckout({
    amount,
    customerInfo,
    items,
    sessionId,
    onSuccess,
    onError,
    className,
    children,
}: RazorpayCheckoutProps) {
    const [loading, setLoading] = useState(false);

    const loadRazorpayScript = (): Promise<boolean> => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setLoading(true);

        try {
            // 1. Load Razorpay script
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                onError('Failed to load payment gateway. Please try again.');
                setLoading(false);
                return;
            }

            // 2. Create order on server
            const orderResponse = await fetch('/api/payment/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount,
                    currency: 'INR',
                    receipt: `receipt_${Date.now()}`,
                    notes: {
                        customerName: customerInfo.name,
                        customerPhone: customerInfo.phone,
                    },
                }),
            });

            const orderData = await orderResponse.json();

            if (!orderData.success) {
                onError(orderData.error || 'Failed to create payment order');
                setLoading(false);
                return;
            }

            // 3. Open Razorpay checkout
            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Leve Cottons',
                description: `Order - ${items.length} item(s)`,
                order_id: orderData.orderId,
                prefill: {
                    name: customerInfo.name,
                    email: customerInfo.email || '',
                    contact: customerInfo.phone,
                },
                notes: {
                    address: customerInfo.address,
                },
                theme: {
                    color: '#7c3aed', // Purple to match brand
                },
                handler: async function (response: any) {
                    // 4. Verify payment on server
                    try {
                        const verifyResponse = await fetch('/api/payment/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderDetails: {
                                    customerName: customerInfo.name,
                                    customerEmail: customerInfo.email,
                                    customerPhone: customerInfo.phone,
                                    shippingAddress: customerInfo.address,
                                    items: items.map(item => ({
                                        product_id: item.productId,
                                        product_code: item.productCode,
                                        product_name: item.productName,
                                        price: item.price,
                                        quantity: item.quantity,
                                    })),
                                    totalAmount: amount,
                                    sessionId,
                                },
                            }),
                        });

                        const verifyData = await verifyResponse.json();

                        if (verifyData.success) {
                            onSuccess(verifyData.orderId);
                        } else {
                            onError('Payment verification failed. Please contact support.');
                        }
                    } catch (err) {
                        onError('Payment verification failed. Please contact support.');
                    }
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.on('payment.failed', function (response: any) {
                onError(`Payment failed: ${response.error.description}`);
                setLoading(false);
            });

            razorpay.open();
            setLoading(false);
        } catch (error) {
            console.error('Payment error:', error);
            onError('Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={loading}
            className={className || 'w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3'}
        >
            {loading ? (
                <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                </>
            ) : (
                children || (
                    <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 18v1c0 1.1-.9 2-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14c1.1 0 2 .9 2 2v1h-9a2 2 0 00-2 2v8a2 2 0 002 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                        </svg>
                        Pay ₹{amount.toLocaleString('en-IN')} Online
                    </>
                )
            )}
        </button>
    );
}
