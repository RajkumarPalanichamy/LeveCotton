import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

// Verify transporter configuration
export const verifyEmailConfig = async () => {
    try {
        await transporter.verify();
        console.log('Email server is ready to send messages');
        return true;
    } catch (error) {
        console.error('Email configuration error:', error);
        return false;
    }
};

// Send order confirmation email to customer
export const sendOrderConfirmationEmail = async (orderData: {
    orderId: string;
    customerName: string;
    customerEmail: string;
    items: any[];
    totalAmount: number;
    shippingAddress: string;
    orderType: string;
}) => {
    const { orderId, customerName, customerEmail, items, totalAmount, shippingAddress, orderType } = orderData;

    const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price * item.quantity}</td>
    </tr>
  `).join('');

    const mailOptions = {
        from: `"LeveCotton" <${process.env.SMTP_USER}>`,
        to: customerEmail,
        subject: `Order Confirmation - ${orderId}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #9333EA 0%, #EC4899 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">LeveCotton</h1>
          <p style="color: #f3e8ff; margin: 10px 0 0 0;">Premium Fashion</p>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #9333EA; margin-top: 0;">Order Confirmed! 🎉</h2>
          <p>Dear ${customerName},</p>
          <p>Thank you for your order! We're excited to get your items to you.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #9333EA;">
            <h3 style="margin-top: 0; color: #9333EA;">Order Details</h3>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Order Type:</strong> ${orderType === 'online' ? 'Online Payment' : 'WhatsApp Order'}</p>
            <p><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}</p>
          </div>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #9333EA;">Items Ordered</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f3e8ff;">
                  <th style="padding: 10px; text-align: left;">Item</th>
                  <th style="padding: 10px; text-align: center;">Qty</th>
                  <th style="padding: 10px; text-align: right;">Price</th>
                  <th style="padding: 10px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr style="background: #f3e8ff; font-weight: bold;">
                  <td colspan="3" style="padding: 15px; text-align: right;">Total Amount:</td>
                  <td style="padding: 15px; text-align: right; color: #9333EA; font-size: 18px;">₹${totalAmount.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #9333EA;">Shipping Address</h3>
            <p style="margin: 0;">${shippingAddress}</p>
          </div>

          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <p style="margin: 0;"><strong>What's Next?</strong></p>
            <p style="margin: 10px 0 0 0;">We'll send you another email when your order ships. You can track your order status anytime.</p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 14px;">Need help? Contact us at support@levecotton.com</p>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">© 2026 LeveCotton. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Order confirmation email sent to ${customerEmail}`);
        return true;
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
        return false;
    }
};

// Send order status update email
export const sendOrderStatusUpdateEmail = async (orderData: {
    orderId: string;
    customerName: string;
    customerEmail: string;
    orderStatus: string;
    trackingNumber?: string;
}) => {
    const { orderId, customerName, customerEmail, orderStatus, trackingNumber } = orderData;

    const statusMessages = {
        pending: { title: 'Order Received', message: 'We have received your order and will start processing it soon.' },
        processing: { title: 'Order Processing', message: 'Your order is being prepared for shipment.' },
        shipped: { title: 'Order Shipped! 📦', message: 'Your order is on its way!' },
        delivered: { title: 'Order Delivered! 🎉', message: 'Your order has been delivered. We hope you love it!' },
        cancelled: { title: 'Order Cancelled', message: 'Your order has been cancelled as requested.' },
    };

    const status = statusMessages[orderStatus as keyof typeof statusMessages] || statusMessages.pending;

    const mailOptions = {
        from: `"LeveCotton" <${process.env.SMTP_USER}>`,
        to: customerEmail,
        subject: `${status.title} - Order ${orderId}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Status Update</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #9333EA 0%, #EC4899 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">LeveCotton</h1>
          <p style="color: #f3e8ff; margin: 10px 0 0 0;">Premium Fashion</p>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #9333EA; margin-top: 0;">${status.title}</h2>
          <p>Dear ${customerName},</p>
          <p>${status.message}</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #9333EA;">
            <h3 style="margin-top: 0; color: #9333EA;">Order Information</h3>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Status:</strong> <span style="color: #9333EA; text-transform: uppercase; font-weight: bold;">${orderStatus}</span></p>
            ${trackingNumber ? `<p><strong>Tracking Number:</strong> ${trackingNumber}</p>` : ''}
            <p><strong>Updated:</strong> ${new Date().toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}</p>
          </div>

          ${orderStatus === 'shipped' ? `
            <div style="background: #dcfce7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
              <p style="margin: 0;"><strong>Track Your Package</strong></p>
              <p style="margin: 10px 0 0 0;">Your order is on the way! ${trackingNumber ? `Use tracking number: ${trackingNumber}` : 'You will receive tracking details soon.'}</p>
            </div>
          ` : ''}

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 14px;">Questions? Contact us at support@levecotton.com</p>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">© 2026 LeveCotton. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Order status update email sent to ${customerEmail}`);
        return true;
    } catch (error) {
        console.error('Error sending order status update email:', error);
        return false;
    }
};

// Send invoice email
export const sendInvoiceEmail = async (orderData: {
    orderId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    items: any[];
    totalAmount: number;
    shippingAddress: string;
    orderDate: string;
    paymentMethod: string;
}) => {
    const { orderId, customerName, customerEmail, customerPhone, items, totalAmount, shippingAddress, orderDate, paymentMethod } = orderData;

    const itemsHtml = items.map((item, index) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${index + 1}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price * item.quantity}</td>
    </tr>
  `).join('');

    const subtotal = totalAmount;
    const tax = 0; // Add tax calculation if needed
    const shipping = 0; // Add shipping cost if needed

    const mailOptions = {
        from: `"LeveCotton" <${process.env.SMTP_USER}>`,
        to: customerEmail,
        subject: `Invoice - ${orderId}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="background: white; border: 2px solid #9333EA; border-radius: 10px; overflow: hidden;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #9333EA 0%, #EC4899 100%); padding: 40px; color: white;">
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <div>
                <h1 style="margin: 0; font-size: 32px;">INVOICE</h1>
                <p style="margin: 5px 0 0 0; opacity: 0.9;">LeveCotton - Premium Fashion</p>
              </div>
              <div style="text-align: right;">
                <p style="margin: 0; font-size: 14px;">Invoice #</p>
                <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold;">${orderId}</p>
              </div>
            </div>
          </div>

          <div style="padding: 40px;">
            <!-- Invoice Details -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
              <div>
                <h3 style="color: #9333EA; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase;">Bill To:</h3>
                <p style="margin: 0; font-weight: bold; font-size: 16px;">${customerName}</p>
                <p style="margin: 5px 0 0 0; color: #666;">${customerEmail}</p>
                <p style="margin: 5px 0 0 0; color: #666;">${customerPhone}</p>
                <p style="margin: 10px 0 0 0; color: #666;">${shippingAddress}</p>
              </div>
              <div style="text-align: right;">
                <h3 style="color: #9333EA; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase;">Invoice Details:</h3>
                <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(orderDate).toLocaleDateString('en-IN')}</p>
                <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${paymentMethod}</p>
                <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #22c55e;">Paid</span></p>
              </div>
            </div>

            <!-- Items Table -->
            <table style="width: 100%; border-collapse: collapse; margin: 30px 0;">
              <thead>
                <tr style="background: #f3e8ff; color: #9333EA;">
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #9333EA;">#</th>
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #9333EA;">Item Description</th>
                  <th style="padding: 12px; text-align: center; border-bottom: 2px solid #9333EA;">Qty</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #9333EA;">Unit Price</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #9333EA;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <!-- Totals -->
            <div style="margin-top: 30px; text-align: right;">
              <div style="display: inline-block; min-width: 300px;">
                <div style="padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;">
                  <span>Subtotal:</span>
                  <span>₹${subtotal.toLocaleString()}</span>
                </div>
                ${tax > 0 ? `
                  <div style="padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;">
                    <span>Tax:</span>
                    <span>₹${tax.toLocaleString()}</span>
                  </div>
                ` : ''}
                ${shipping > 0 ? `
                  <div style="padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;">
                    <span>Shipping:</span>
                    <span>₹${shipping.toLocaleString()}</span>
                  </div>
                ` : ''}
                <div style="padding: 15px; background: #f3e8ff; border-radius: 8px; margin-top: 10px; display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; color: #9333EA;">
                  <span>Total:</span>
                  <span>₹${totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #eee; text-align: center;">
              <p style="color: #666; font-size: 14px; margin: 5px 0;">Thank you for your business!</p>
              <p style="color: #666; font-size: 12px; margin: 5px 0;">For any queries, contact us at support@levecotton.com</p>
              <p style="color: #999; font-size: 11px; margin: 20px 0 0 0;">© 2026 LeveCotton. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Invoice email sent to ${customerEmail}`);
        return true;
    } catch (error) {
        console.error('Error sending invoice email:', error);
        return false;
    }
};

// Send admin notification for new order
export const sendAdminOrderNotification = async (orderData: {
    orderId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    totalAmount: number;
    orderType: string;
}) => {
    const { orderId, customerName, customerEmail, customerPhone, totalAmount, orderType } = orderData;

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@levecotton.com';

    const mailOptions = {
        from: `"LeveCotton System" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        subject: `🔔 New Order Received - ${orderId}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Order Notification</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #1f2937; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">🛍️ New Order Alert</h1>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #9333EA;">Order Details</h2>
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #9333EA;">
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Order Type:</strong> ${orderType}</p>
            <p><strong>Total Amount:</strong> ₹${totalAmount.toLocaleString()}</p>
            <p><strong>Order Time:</strong> ${new Date().toLocaleString('en-IN')}</p>
          </div>

          <h3 style="color: #9333EA; margin-top: 20px;">Customer Information</h3>
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <p><strong>Name:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${customerEmail}</p>
            <p><strong>Phone:</strong> ${customerPhone}</p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="http://localhost:3000/admin/orders" style="display: inline-block; background: linear-gradient(135deg, #9333EA 0%, #EC4899 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">View Order Details</a>
          </div>
        </div>
      </body>
      </html>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Admin notification sent for order ${orderId}`);
        return true;
    } catch (error) {
        console.error('Error sending admin notification:', error);
        return false;
    }
};
