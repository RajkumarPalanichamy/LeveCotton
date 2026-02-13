import { NextRequest, NextResponse } from 'next/server';
import {
    sendOrderConfirmationEmail,
    sendOrderStatusUpdateEmail,
    sendInvoiceEmail,
    sendAdminOrderNotification,
} from '@/lib/emailService';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, orderData } = body;

        let result = false;

        switch (type) {
            case 'order_confirmation':
                result = await sendOrderConfirmationEmail(orderData);
                break;

            case 'status_update':
                result = await sendOrderStatusUpdateEmail(orderData);
                break;

            case 'invoice':
                result = await sendInvoiceEmail(orderData);
                break;

            case 'admin_notification':
                result = await sendAdminOrderNotification(orderData);
                break;

            default:
                return NextResponse.json(
                    { error: 'Invalid email type' },
                    { status: 400 }
                );
        }

        if (result) {
            return NextResponse.json({ success: true, message: 'Email sent successfully' });
        } else {
            return NextResponse.json(
                { error: 'Failed to send email' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Email API error:', error);
        return NextResponse.json(
            { error: 'Failed to send email' },
            { status: 500 }
        );
    }
}
