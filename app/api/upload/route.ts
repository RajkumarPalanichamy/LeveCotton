import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('product-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase upload error details:', {
        message: uploadError.message,
        name: uploadError.name,
        stack: uploadError.stack,
        fileName
      });
      // Fallback to base64 if storage fails
      const base64 = buffer.toString('base64');
      const imageUrl = `data:${file.type};base64,${base64}`;
      return NextResponse.json({ success: true, imageUrl });
    }

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('product-images')
      .getPublicUrl(fileName);

    if (!publicUrlData.publicUrl) {
      console.error('Failed to get public URL for:', fileName);
      return NextResponse.json({ error: 'Failed to retrieve image URL' }, { status: 500 });
    }

    // Ensure URL is absolute (Supabase should return absolute, but let's be safe)
    let imageUrl = publicUrlData.publicUrl;
    if (imageUrl.startsWith('/')) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (supabaseUrl) {
        imageUrl = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/product-images/${fileName}`;
      }
    }

    console.log('Upload successful. Image URL:', imageUrl);

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({
      error: 'Upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}