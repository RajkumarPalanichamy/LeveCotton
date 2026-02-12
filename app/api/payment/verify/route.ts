import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderDetails,
        } = await request.json();

        // Verify payment signature
        const keySecret = process.env.RAZORPAY_KEY_SECRET!;
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', keySecret)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
        }

        // Payment is verified — save order to Supabase
        const orderId = `LC-${Date.now()}`;

        const { error: orderError } = await supabaseAdmin.from('orders').insert({
            id: orderId,
            customer_name: orderDetails.customerName,
            customer_email: orderDetails.customerEmail || null,
            customer_phone: orderDetails.customerPhone,
            shipping_address: orderDetails.shippingAddress,
            items: orderDetails.items,
            total_amount: orderDetails.totalAmount,
            razorpay_order_id,
            razorpay_payment_id,
            payment_status: 'paid',
            order_status: 'confirmed',
            order_type: 'online',
        });

        if (orderError) {
            console.error('Order save error:', orderError);
            return NextResponse.json({
                error: 'Payment verified but failed to save order',
                details: orderError.message
            }, { status: 500 });
        }

        // Clear user's cart after successful payment
        if (orderDetails.sessionId) {
            await supabaseAdmin
                .from('cart_items')
                .delete()
                .eq('session_id', orderDetails.sessionId);
        }

        return NextResponse.json({
            success: true,
            orderId,
            message: 'Payment verified and order placed successfully',
        });
    } catch (error) {
        console.error('Payment verify error:', error);
        return NextResponse.json({
            error: 'Payment verification failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
