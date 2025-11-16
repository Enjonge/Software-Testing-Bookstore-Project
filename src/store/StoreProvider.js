import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from 'react';
import { books } from '../data/books';

export const StoreContext = createContext();

// localStorage helper
const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }
};

// Load initial state from localStorage
const getInitialState = () => ({
  user: storage.get('app.user'),
  cart: storage.get('app.cart', []),
  books: books,
  orders: storage.get('app.orders', []),
  shippingAddress: storage.get('app.shippingAddress'),
  paymentMethod: storage.get('app.paymentMethod')
});

function storeReducer(state, action) {
  console.log('Action:', action.type, action.payload);
  
  let newState;

  switch (action.type) {
    case 'SET_USER':
      newState = { ...state, user: action.payload };
      storage.set('app.user', action.payload);
      return newState;
    
    case 'ADD_TO_CART':
      const { book, quantity = 1 } = action.payload;
      const existingItem = state.cart.find(item => item.book.id === book.id);
      
      if (existingItem) {
        newState = {
          ...state,
          cart: state.cart.map(item =>
            item.book.id === book.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        };
      } else {
        newState = {
          ...state,
          cart: [...state.cart, { book, quantity }]
        };
      }
      storage.set('app.cart', newState.cart);
      return newState;
    
    case 'REMOVE_FROM_CART':
      console.log('BEFORE REMOVAL - Cart:', state.cart);
      console.log('Removing bookId:', action.payload.bookId);
      
      const filteredCart = state.cart.filter(item => {
        console.log('Checking item:', item.book.id, 'against:', action.payload.bookId);
        return item.book.id !== action.payload.bookId;
      });
      
      console.log('AFTER REMOVAL - Cart:', filteredCart);
      newState = {
        ...state,
        cart: filteredCart
      };
      storage.set('app.cart', filteredCart);
      return newState;
    
    case 'UPDATE_CART_QUANTITY':
      newState = {
        ...state,
        cart: state.cart.map(item =>
          item.book.id === action.payload.bookId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
      storage.set('app.cart', newState.cart);
      return newState;
    
    case 'CLEAR_CART':
      newState = { ...state, cart: [] };
      storage.set('app.cart', []);
      return newState;
    
    case 'SET_SHIPPING_ADDRESS':
      newState = { ...state, shippingAddress: action.payload };
      storage.set('app.shippingAddress', action.payload);
      return newState;
    
    case 'SET_PAYMENT_METHOD':
      newState = { ...state, paymentMethod: action.payload };
      storage.set('app.paymentMethod', action.payload);
      return newState;
    
    case 'CREATE_ORDER':
      const newOrder = {
        id: Date.now().toString(),
        ...action.payload,
        status: 'paid',
        createdAt: new Date().toISOString()
      };
      newState = {
        ...state,
        orders: [...state.orders, newOrder],
        cart: []
      };
      storage.set('app.orders', newState.orders);
      storage.set('app.cart', []);
      return newState;
    
    default:
      return state;
  }
}

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, getInitialState());

  const { cart } = state;

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);
  }, [cart]);

  const addToCart = useCallback((book, quantity = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { book, quantity } });
  }, []);

  const removeFromCart = useCallback((bookId) => {
    console.log('DISPATCHING REMOVE:', bookId);
    dispatch({ type: 'REMOVE_FROM_CART', payload: { bookId } });
  }, []);

  const updateCartQuantity = useCallback((bookId, quantity) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { bookId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const setShippingAddress = useCallback((address) => {
    dispatch({ type: 'SET_SHIPPING_ADDRESS', payload: address });
  }, []);

  const setPaymentMethod = useCallback((method) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: method });
  }, []);

  const createOrder = useCallback((orderData) => {
    dispatch({ type: 'CREATE_ORDER', payload: orderData });
  }, []);

  const value = {
    ...state,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    setShippingAddress,
    setPaymentMethod,
    createOrder
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export default StoreProvider;

export{ storeReducer };