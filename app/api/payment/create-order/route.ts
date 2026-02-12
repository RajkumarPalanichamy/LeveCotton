import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
    try {
        const { amount, currency = 'INR', receipt, notes } = await request.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        // Convert to paise (Razorpay requires amount in smallest currency unit)
        const amountInPaise = Math.round(amount * 100);

        const order = await razorpay.orders.create({
            amount: amountInPaise,
            currency,
            receipt: receipt || `receipt_${Date.now()}`,
            notes: notes || {},
        });

        return NextResponse.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error('Razorpay create order error:', error);
        return NextResponse.json({
            error: 'Failed to create payment order',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
