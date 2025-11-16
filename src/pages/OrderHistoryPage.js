import React from 'react';
import { useStore } from '../store/StoreProvider';
import { Link } from 'react-router-dom';

const OrderHistoryPage = () => {
  const { orders } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No orders yet</p>
          <Link to="/catalog" className="bg-primary text-white px-6 py-2 rounded-lg">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">Order #{order.id.slice(-6)}</h3>
                  <p className="text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-gray-600">{order.items.length} items</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">Ksh {order.total.toFixed(2)}</p>
                  <p className={`px-2 py-1 rounded-full text-xs ${
                    order.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </p>
                </div>
              </div>
              <Link 
                to={`/orders/${order.id}`} 
                className="text-primary hover:underline mt-4 inline-block"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;