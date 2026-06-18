const GST_RATE = 18;

function calculateOrderTotal(items, discount = 0) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discountedSubtotal = subtotal - discount;
  const gstAmount = parseFloat(((discountedSubtotal * GST_RATE) / 100).toFixed(2));
  const totalAmount = parseFloat((discountedSubtotal + gstAmount).toFixed(2));
  return { subtotal, gstRate: GST_RATE, gstAmount, totalAmount };
}

module.exports = { calculateOrderTotal, GST_RATE };
