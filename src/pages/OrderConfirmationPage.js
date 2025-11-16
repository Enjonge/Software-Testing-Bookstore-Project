import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store/StoreProvider';
import { formatCurrency } from '../config/currency';

const OrderDetailPage = () => {
  const { id } = useParams();
  const { orders } = useStore();

  const order = useMemo(() => {
    return orders.find(order => order.id === id);
  }, [orders, id]);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
        <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
        <Link to="/catalog" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="text-gray-600">Order #{order.id}</p>
          <p className="text-gray-600">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
          order.status === 'paid' ? 'bg-green-100 text-green-800' : 
          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-gray-100 text-gray-800'
        }`}>
          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.book.image}
                    alt={item.book.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{item.book.title}</h3>
                    <p className="text-gray-600 text-sm">by {item.book.author}</p>
                    <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(item.book.price * item.quantity)}</p>
                  <p className="text-gray-600 text-sm">{formatCurrency(item.book.price)} each</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Breakdown */}
          {order.orderBreakdown && (
            <div className="border-t pt-4 mt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(order.orderBreakdown.subtotal)}</span>
              </div>
              
              {order.orderBreakdown.tax > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>VAT ({order.orderBreakdown.taxRate}%)</span>
                  <span>{formatCurrency(order.orderBreakdown.tax)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>
                  {order.orderBreakdown.shipping === 0 ? 'FREE' : formatCurrency(order.orderBreakdown.shipping)}
                </span>
              </div>
              
              {order.orderBreakdown.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({order.orderBreakdown.discountRate}%)</span>
                  <span>-{formatCurrency(order.orderBreakdown.discount)}</span>
                </div>
              )}

              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>{formatCurrency(order.orderBreakdown.total)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Shipping Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
            {order.shippingAddress ? (
              <div className="space-y-2">
                <p className="font-semibold">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.country} {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.email}</p>
                <p>{order.shippingAddress.phone}</p>
              </div>
            ) : (
              <p className="text-gray-600">No shipping address provided</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Payment Information</h2>
            <div className="space-y-2">
              <p><span className="font-semibold">Method:</span> {order.paymentMethod || 'Not specified'}</p>
              {order.paymentReference && (
                <p><span className="font-semibold">Reference:</span> {order.paymentReference}</p>
              )}
              <p><span className="font-semibold">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  order.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                </span>
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/catalog"
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;