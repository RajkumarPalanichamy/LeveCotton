import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export async function POST(request: NextRequest) {
    try {
        const formData = await request.json();
        const {
            businessName,
            contactPerson,
            email,
            phone,
            gstNumber,
            address,
            city,
            state,
            pincode,
            productCategories,
            estimatedQuantity,
            message
        } = formData;

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@levecotton.com';
        const supportPhone = process.env.SUPPORT_PHONE || '+91 93458 68005';

        // Email to admin
        const adminMailOptions = {
            from: `"LeveCotton Wholesale" <${process.env.SMTP_USER}>`,
            to: adminEmail,
            subject: `🏢 New Wholesale Inquiry from ${businessName}`,
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wholesale Inquiry</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
    <div style="background: #6D3B2C; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🏢 New Wholesale Inquiry</h1>
        <p style="color: #E5D5C8; margin: 10px 0 0 0;">LeveCotton - Premium Fashion</p>
    </div>
    
    <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #6D3B2C;">
            <h2 style="color: #6D3B2C; margin-top: 0;">Business Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; width: 40%;">Business Name:</td>
                    <td style="padding: 8px 0;">${businessName}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Contact Person:</td>
                    <td style="padding: 8px 0;">${contactPerson}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                    <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #6D3B2C;">${email}</a></td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
                    <td style="padding: 8px 0;"><a href="tel:${phone}" style="color: #6D3B2C;">${phone}</a></td>
                </tr>
                ${gstNumber ? `
                <tr>
                    <td style="padding: 8px 0; font-weight: bold;">GST Number:</td>
                    <td style="padding: 8px 0;">${gstNumber}</td>
                </tr>
                ` : ''}
            </table>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #6D3B2C; margin-top: 0;">Business Address</h3>
            <p style="margin: 0; line-height: 1.8;">
                ${address}<br>
                ${city}, ${state} - ${pincode}
            </p>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #6D3B2C; margin-top: 0;">Product Requirements</h3>
            <p><strong>Categories:</strong> ${productCategories.join(', ')}</p>
            <p><strong>Estimated Monthly Quantity:</strong> ${estimatedQuantity}</p>
            ${message ? `
            <div style="background: #E5D5C8; padding: 15px; border-radius: 8px; margin-top: 15px;">
                <p style="margin: 0;"><strong>Additional Message:</strong></p>
                <p style="margin: 10px 0 0 0;">${message}</p>
            </div>
            ` : ''}
        </div>

        <div style="background: #dcfce7; padding: 15px; border-radius: 8px; border-left: 4px solid #22c55e;">
            <p style="margin: 0;"><strong>⏰ Inquiry Received:</strong> ${new Date().toLocaleString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}</p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666; font-size: 14px;">Contact the customer at ${phone} or ${email}</p>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">© 2026 LeveCotton. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
            `,
        };

        // Confirmation email to customer
        const customerMailOptions = {
            from: `"LeveCotton" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `Thank you for your wholesale inquiry - LeveCotton`,
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wholesale Inquiry Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #6D3B2C; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">LeveCotton</h1>
        <p style="color: #E5D5C8; margin: 10px 0 0 0;">Premium Fashion - Wholesale Division</p>
    </div>
    
    <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #6D3B2C; margin-top: 0;">Thank You for Your Interest! 🎉</h2>
        <p>Dear ${contactPerson},</p>
        <p>Thank you for your wholesale inquiry with LeveCotton. We've received your request and our team will review it shortly.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6D3B2C;">
            <h3 style="margin-top: 0; color: #6D3B2C;">Your Inquiry Details</h3>
            <p><strong>Business:</strong> ${businessName}</p>
            <p><strong>Product Categories:</strong> ${productCategories.join(', ')}</p>
            <p><strong>Estimated Quantity:</strong> ${estimatedQuantity}</p>
        </div>

        <div style="background: #dcfce7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
            <p style="margin: 0;"><strong>What's Next?</strong></p>
            <p style="margin: 10px 0 0 0;">Our wholesale team will contact you within 24 hours to discuss pricing, minimum order quantities, and delivery terms.</p>
        </div>

        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <p style="margin: 0;"><strong>Need Immediate Assistance?</strong></p>
            <p style="margin: 10px 0 0 0;">Call us at ${supportPhone} or reply to this email.</p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 14px;">Questions? Contact us at ${supportPhone}</p>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">© 2026 LeveCotton. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
            `,
        };

        // Send both emails
        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(customerMailOptions);

        return NextResponse.json({ success: true, message: 'Inquiry sent successfully' });
    } catch (error) {
        console.error('Error sending wholesale inquiry:', error);
        return NextResponse.json({ error: 'Failed to send inquiry' }, { status: 500 });
    }
}
