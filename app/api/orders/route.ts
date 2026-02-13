import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET orders (for admin dashboard)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');

        let query = supabaseAdmin
            .from('orders')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false });

        if (status) {
            query = query.eq('order_status', status);
        }

        const startIndex = (page - 1) * limit;
        query = query.range(startIndex, startIndex + limit - 1);

        const { data: orders, error, count } = await query;

        if (error) {
            return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
        }

        return NextResponse.json({
            orders: orders || [],
            total: count || 0,
            page,
            totalPages: Math.ceil((count || 0) / limit),
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

// CREATE order (for WhatsApp or direct orders)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const orderId = body.id || `LC-${Date.now()}`;

        const { error } = await supabaseAdmin.from('orders').insert({
            id: orderId,
            customer_name: body.customerName,
            customer_email: body.customerEmail || null,
            customer_phone: body.customerPhone,
            shipping_address: body.shippingAddress,
            items: body.items || [],
            total_amount: body.totalAmount,
            razorpay_order_id: body.razorpayOrderId || null,
            razorpay_payment_id: body.razorpayPaymentId || null,
            payment_status: body.paymentStatus || 'pending',
            order_status: body.orderStatus || 'pending',
            order_type: body.orderType || 'whatsapp',
        });

        if (error) {
            return NextResponse.json({ error: 'Failed to create order', details: error.message }, { status: 500 });
        }

        // Send email notifications (don't wait for them to complete)
        if (body.customerEmail) {
            // Send order confirmation to customer
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'order_confirmation',
                    orderData: {
                        orderId,
                        customerName: body.customerName,
                        customerEmail: body.customerEmail,
                        items: body.items || [],
                        totalAmount: body.totalAmount,
                        shippingAddress: body.shippingAddress,
                        orderType: body.orderType || 'whatsapp',
                    }
                })
            }).catch(err => console.error('Failed to send confirmation email:', err));

            // Send admin notification
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'admin_notification',
                    orderData: {
                        orderId,
                        customerName: body.customerName,
                        customerEmail: body.customerEmail,
                        customerPhone: body.customerPhone,
                        totalAmount: body.totalAmount,
                        orderType: body.orderType || 'whatsapp',
                    }
                })
            }).catch(err => console.error('Failed to send admin notification:', err));
        }

        return NextResponse.json({ success: true, orderId });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}

// UPDATE order status
export async function PUT(request: NextRequest) {
    try {
        const { id, orderStatus, paymentStatus } = await request.json();

        const update: any = {};
        if (orderStatus) update.order_status = orderStatus;
        if (paymentStatus) update.payment_status = paymentStatus;

        const { error } = await supabaseAdmin
            .from('orders')
            .update(update)
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
