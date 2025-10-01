import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function OrderConfirmation() {
  const location = useLocation();
  const { order } = location.state || {};
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (order?.userId) {
      const fetchUser = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/user/${order.userId}`);
          const userData = await response.json();
          if (response.ok) {
            setUser(userData);
          }
        } catch (error) {
          console.error('Failed to fetch user data', error);
        }
      };
      fetchUser();
    }
  }, [order]);

  const handleDownloadInvoice = () => {
    if (!order || !user) return;

    const senderInfo = {
      name: 'DMart',
      addressLine1: '123 DMart Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India',
    };

    const invoiceContent = `
      <html>
      <head>
        <title>Invoice</title>
        <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
        <style>
          body { font-family: sans-serif; margin: 20px; }
          .container { width: 80%; margin: auto; border: 1px solid #eee; padding: 20px; }
          h1, h2 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .text-right { text-align: right; }
          .total { font-weight: bold; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Invoice</h1>
          <div class="info-grid">
            <div>
              <h2>Sender Information</h2>
              <p><strong>${senderInfo.name}</strong></p>
              <p>${senderInfo.addressLine1}</p>
              <p>${senderInfo.city}, ${senderInfo.state} ${senderInfo.postalCode}</p>
              <p>${senderInfo.country}</p>
            </div>
            <div>
              <h2>Customer Information</h2>
              <p><strong>${user.name}</strong></p>
              <p>${order.shippingAddress.addressLine1}</p>
              ${order.shippingAddress.addressLine2 ? `<p>${order.shippingAddress.addressLine2}</p>` : ''}
              <p>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}</p>
              <p>${order.shippingAddress.country}</p>
            </div>
          </div>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <svg id="barcode"></svg>
          <h2>Items</h2>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.price.toFixed(2)}</td>
                  <td>₹${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div style="margin-top: 20px; text-align: right;">
            <p>Subtotal: ₹${order.subtotal.toFixed(2)}</p>
            ${order.totalDiscount > 0 ? `<p>Discount: -₹${order.totalDiscount.toFixed(2)}</p>` : ''}
            <p>GST: ₹${order.gstAmount.toFixed(2)}</p>
            <p>Shipping: ₹${order.shippingCharge.toFixed(2)}</p>
            <h3 class="total">Order Total: ₹${order.totalAmount.toFixed(2)}</h3>
          </div>
        </div>
        <script>
          JsBarcode("#barcode", "${order._id}");
        </script>
      </body>
      </html>
    `;

    const newWindow = window.open();
    newWindow.document.write(invoiceContent);
    newWindow.document.close();
    newWindow.print();
  };

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Order Confirmation</h1>
        <p className="text-xl">No order details found.</p>
        <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">Go to Homepage</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-green-500 mb-4">Congratulations!</h1>
        <p className="text-xl mb-8">Your order has been placed successfully.</p>

        <div className="text-left">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p><strong>Status:</strong> {order.orderStatus}</p>
              <p><strong>Total:</strong> ₹{order.totalAmount.toFixed(2)}</p>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Shipping Address</h3>
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.country}</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Items</h3>
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">Product</th>
                  <th className="py-2 px-4 text-left">Quantity</th>
                  <th className="py-2 px-4 text-left">Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map(item => (
                  <tr key={item.productId} className="border-b">
                    <td className="py-2 px-4">{item.name}</td>
                    <td className="py-2 px-4">{item.quantity}</td>
                    <td className="py-2 px-4">₹{item.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Link to="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Continue Shopping
          </Link>
          <button onClick={handleDownloadInvoice} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
