import React from 'react';
import { useStore } from '../store/StoreProvider';

const Admin = () => {
  const { user, orders, books, updateBook, addBook, notifications } = useStore();

  if (!user || user.role !== 'admin') {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold">Access Denied</h2>
        <p>Admin access required</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold">Total Books</h3>
          <p className="text-2xl">{books.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold">Total Orders</h3>
          <p className="text-2xl">{orders.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold">Notifications</h3>
          <p className="text-2xl">{notifications?.length || 0}</p>
        </div>
      </div>

      {/* Add your admin functionality here */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl font-bold mb-2">Book Management</h3>
        <p>Book management features will be implemented here.</p>
      </div>
    </div>
  );
};

export default Admin;
