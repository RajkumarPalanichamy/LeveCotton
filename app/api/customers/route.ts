import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET all customers (for admin)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');

        const startIndex = (page - 1) * limit;

        const { data: customers, error, count } = await supabaseAdmin
            .from('customers')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(startIndex, startIndex + limit - 1);

        if (error) {
            return NextResponse.json({ error: 'Failed to fetch customers', details: error.message }, { status: 500 });
        }

        return NextResponse.json({
            customers: (customers || []).map(c => ({
                id: c.id,
                name: c.name,
                email: c.email,
                phone: c.phone,
                address: c.address,
                orderCount: c.order_count,
                totalSpent: c.total_spent,
                createdAt: c.created_at,
            })),
            total: count || 0,
            page,
            totalPages: Math.ceil((count || 0) / limit),
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
    }
}

// CREATE or upsert a customer
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const customerId = body.id || `cust_${Date.now()}`;

        // Check if customer with same email already exists
        if (body.email) {
            const { data: existing } = await supabaseAdmin
                .from('customers')
                .select('*')
                .eq('email', body.email)
                .single();

            if (existing) {
                // Update existing customer's order count
                await supabaseAdmin
                    .from('customers')
                    .update({
                        order_count: (existing.order_count || 0) + 1,
                        total_spent: (existing.total_spent || 0) + (body.orderAmount || 0),
                    })
                    .eq('id', existing.id);

                return NextResponse.json({
                    success: true,
                    customer: {
                        id: existing.id,
                        name: existing.name,
                        email: existing.email,
                        phone: existing.phone,
                        address: existing.address,
                        orderCount: existing.order_count + 1,
                        totalSpent: (existing.total_spent || 0) + (body.orderAmount || 0),
                        createdAt: existing.created_at,
                    },
                    isExisting: true,
                });
            }
        }

        // Create new customer
        const { error } = await supabaseAdmin.from('customers').insert({
            id: customerId,
            name: body.name,
            email: body.email || null,
            phone: body.phone || null,
            address: body.address || null,
            order_count: 1,
            total_spent: body.orderAmount || 0,
        });

        if (error) {
            return NextResponse.json({ error: 'Failed to create customer', details: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            customer: {
                id: customerId,
                name: body.name,
                email: body.email,
                phone: body.phone,
                address: body.address,
                orderCount: 1,
                totalSpent: body.orderAmount || 0,
                createdAt: new Date().toISOString(),
            },
            isExisting: false,
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
    }
}
