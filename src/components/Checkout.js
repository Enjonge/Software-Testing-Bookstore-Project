import React from 'react';
import { useStore } from '../store/StoreProvider';

const Checkout = () => {
  const { cart, clearCart } = useStore();

  const handleCheckout = () => {
    // Implement checkout logic
    alert('Checkout functionality will be implemented here');
    clearCart();
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold">Checkout</h2>
        <p>Your cart is empty. Add some books to checkout.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      
      <div className="bg-white p-4 rounded shadow mb-4">
        <h3 className="text-lg font-bold mb-2">Order Summary</h3>
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between py-2 border-b">
            <span>{item.book?.title} x {item.quantity}</span>
            <span>Ksh {((item.book?.price || 0) * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold text-xl mt-4 pt-2 border-t">
          <span>Total:</span>
          <span>
            Ksh {cart.reduce((total, item) => total + (item.book?.price || 0) * item.quantity, 0).toFixed(2)}
          </span>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark w-full"
      >
        Proceed to Payment
      </button>
    </div>
  );
};

export default Checkout;
