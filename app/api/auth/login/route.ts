import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Admin credentials check
    // In production, you should store admin credentials in Supabase auth
    // For now, keeping the hardcoded admin check with environment fallback
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@levecotton.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

    if (email === adminEmail && password === adminPassword) {
      const adminUser = {
        _id: 'admin-001',
        email: adminEmail,
        name: 'LeveCotton Admin',
        role: 'admin'
      };

      return NextResponse.json({
        user: adminUser,
        isAdmin: true
      });
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}