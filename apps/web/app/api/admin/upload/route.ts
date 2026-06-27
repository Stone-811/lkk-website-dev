import { NextRequest, NextResponse } from 'next/server';
import { adminStorage } from '@/lib/firebase';
import { cookies } from 'next/headers';

// Check admin session
async function checkAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('admin_session');
  return !!sessionCookie?.value;
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const isAuthenticated = await checkAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: '請先登入' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';
    const filename = formData.get('filename') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: '請選擇檔案' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: '僅支援 JPG、PNG、WebP、GIF 格式' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: '檔案大小不可超過 5MB' },
        { status: 400 }
      );
    }

    // Generate filename
    const ext = file.name.split('.').pop() || 'jpg';
    const finalFilename = filename
      ? `${filename}.${ext}`
      : `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = `${folder}/${finalFilename}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Firebase Storage
    const bucket = adminStorage.bucket();
    const fileRef = bucket.file(filePath);

    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000',
      },
    });

    // Make file public
    await fileRef.makePublic();

    // Get public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        path: filePath,
        filename: finalFilename,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: '上傳失敗，請稍後再試' },
      { status: 500 }
    );
  }
}
