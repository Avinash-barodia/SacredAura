function orderConfirmationEmail(order, user) {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.product?.name || 'Product'}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${(item.price || 0).toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Order Confirmation</h2>
      <p>Dear ${user.firstName || 'Customer'},</p>
      <p>Thank you for your order! Your order <strong>${order.orderId}</strong> has been successfully placed.</p>
      
      <h3>Order Details</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr>
            <th style="padding: 8px; border: 1px solid #ddd; background-color: #f8f9fa;">Item</th>
            <th style="padding: 8px; border: 1px solid #ddd; background-color: #f8f9fa;">Qty</th>
            <th style="padding: 8px; border: 1px solid #ddd; background-color: #f8f9fa;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 8px; border: 1px solid #ddd; text-align: right;"><strong>Subtotal:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${(order.subtotal || 0).toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 8px; border: 1px solid #ddd; text-align: right;"><strong>GST (18%):</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${(order.gstAmount || 0).toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 8px; border: 1px solid #ddd; text-align: right;"><strong>Total:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right;"><strong>₹${(order.totalAmount || 0).toFixed(2)}</strong></td>
          </tr>
        </tfoot>
      </table>

      <h3>Shipping Information</h3>
      <p>
        ${order.shippingAddress?.address || ''}, ${order.shippingAddress?.apartment || ''}<br>
        ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} - ${order.shippingAddress?.pinCode || ''}
      </p>

      <p>Estimated Delivery: 3-5 business days</p>
      
      <p>Best regards,<br>The SacredAura Team</p>
    </div>
  `;

  const text = \`Dear \${user.firstName || 'Customer'},

Thank you for your order! Your order \${order.orderId} has been successfully placed.

Subtotal: ₹\${(order.subtotal || 0).toFixed(2)}
GST: ₹\${(order.gstAmount || 0).toFixed(2)}
Total Amount: ₹\${(order.totalAmount || 0).toFixed(2)}

Estimated Delivery: 3-5 business days

Best regards,
The SacredAura Team\`;

  return {
    subject: \`Order Confirmation - \${order.orderId}\`,
    html,
    text
  };
}

module.exports = { orderConfirmationEmail };
