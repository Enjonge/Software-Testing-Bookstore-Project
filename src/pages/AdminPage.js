import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/StoreProvider';

const AdminPage = () => {
  const { books, orders } = useStore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Check if user is admin on component mount
  useEffect(() => {
    const checkAdminStatus = () => {
      const storedUser = localStorage.getItem('app.user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setIsAdmin(user.role === 'admin');
      }
    };

    checkAdminStatus();
    // Also check when localStorage changes
    window.addEventListener('storage', checkAdminStatus);
    return () => window.removeEventListener('storage', checkAdminStatus);
  }, []);

  const loginAsAdmin = () => {
    const adminUser = {
      id: 1,
      name: 'Admin User',
      email: 'admin@bookstore.com',
      role: 'admin'
    };
    localStorage.setItem('app.user', JSON.stringify(adminUser));
    setIsAdmin(true);
    // Force refresh to update navbar
    window.dispatchEvent(new Event('storage'));
    alert('Logged in as Admin! Admin link will now appear in navigation.');
  };

  const logout = () => {
    localStorage.removeItem('app.user');
    setIsAdmin(false);
    window.dispatchEvent(new Event('storage'));
    alert('Logged out!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
          
          {isAdmin ? (
            <div>
              <p className="text-gray-600 mb-4">
                Welcome back, <span className="font-semibold">Admin User</span>!
                <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                  Administrator
                </span>
              </p>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-4">You need admin access to view this page</p>
              <button
                onClick={loginAsAdmin}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark font-semibold"
              >
                Click to Login as Admin
              </button>
            </div>
          )}
        </div>

        {isAdmin && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                {['dashboard', 'books', 'orders'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                      activeTab === tab
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded">
                    <h3 className="font-semibold">Books</h3>
                    <p className="text-2xl">{books.length}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded">
                    <h3 className="font-semibold">Orders</h3>
                    <p className="text-2xl">{orders.length}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded">
                    <h3 className="font-semibold">Revenue</h3>
                    <p className="text-xl">Ksh {orders.reduce((sum, order) => sum + (order.orderBreakdown?.total || 0), 0).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'books' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Books</h2>
                <div className="space-y-3">
                  {books.map(book => (
                    <div key={book.id} className="flex justify-between items-center p-3 border rounded">
                      <span>{book.title}</span>
                      <span>Ksh {book.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Orders</h2>
                <div className="space-y-3">
                  {orders.map(order => (
                    <div key={order.id} className="p-3 border rounded">
                      <div className="flex justify-between">
                        <span>Order #{order.id}</span>
                        <span>Ksh {order.orderBreakdown?.total?.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-8">
          <Link to="/catalog" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark">
            Back to Catalog
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;