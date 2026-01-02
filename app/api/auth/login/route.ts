import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // Admin credentials check
    if (email === 'admin@levecotton.com' && password === 'Admin@123') {
      const adminUser = {
        _id: 'admin-001',
        email: 'admin@levecotton.com',
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