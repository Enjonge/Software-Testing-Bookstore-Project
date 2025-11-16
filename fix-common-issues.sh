#!/bin/bash
echo "=== Fixing Common React App Issues ==="

# 1. Create missing currency formatter
mkdir -p src/config
cat > src/config/currency.js << 'CURRENCY_EOF'
export const formatCurrency = (amount) => {
  return `Ksh ${typeof amount === 'number' ? amount.toFixed(2) : '0.00'}`;
};
CURRENCY_EOF
echo "✅ Created src/config/currency.js"

# 2. Create sample books data
mkdir -p src/data
cat > src/data/books.js << 'BOOKS_EOF'
export const books = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
    description: "A classic American novel about the Jazz Age"
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400",
    description: "A powerful story of racial injustice"
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400",
    description: "A dystopian social science fiction novel"
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    price: 11.99,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
    description: "A romantic novel of manners"
  },
  {
    id: 5,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    price: 13.99,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
    description: "A controversial novel of teenage rebellion"
  },
  {
    id: 6,
    title: "Lord of the Rings",
    author: "J.R.R. Tolkien",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1506260408121-e353d10b87c7?w=400",
    description: "An epic high fantasy adventure"
  }
];
BOOKS_EOF
echo "✅ Created src/data/books.js"

# 3. Update StoreProvider to use books data
cat > src/store/StoreProvider.js << 'STOREPROVIDER_EOF'
import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react';
import { books } from '../data/books';

export const StoreContext = createContext();

const initialState = {
  user: null,
  cart: [],
  books: books,
  orders: [],
  shippingAddress: null,
  paymentMethod: null
};

function storeReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'ADD_TO_CART':
      const { book, quantity = 1 } = action.payload;
      const existingItem = state.cart.find(item => item.book.id === book.id);
      
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.book.id === book.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, { book, quantity }]
        };
      }
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.book.id !== action.payload.bookId)
      };
    
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.book.id === action.payload.bookId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        cart: []
      };
    
    case 'SET_SHIPPING_ADDRESS':
      return {
        ...state,
        shippingAddress: action.payload
      };
    
    case 'SET_PAYMENT_METHOD':
      return {
        ...state,
        paymentMethod: action.payload
      };
    
    case 'CREATE_ORDER':
      const newOrder = {
        id: Date.now().toString(),
        ...action.payload,
        status: 'paid',
        createdAt: new Date().toISOString()
      };
      return {
        ...state,
        orders: [...state.orders, newOrder],
        cart: []
      };
    
    default:
      return state;
  }
}

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  const { cart } = state;

  const cartCount = useMemo(() => {
    if (!cart || !Array.isArray(cart)) return 0;
    return cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  }, [cart]);

  const cartTotal = useMemo(() => {
    if (!cart || !Array.isArray(cart)) return 0;
    return cart.reduce((sum, item) => sum + (item.book.price * item.quantity || 0), 0);
  }, [cart]);

  const addToCart = useCallback((book, quantity = 1) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { book, quantity }
    });
  }, []);

  const removeFromCart = useCallback((bookId) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: { bookId }
    });
  }, []);

  const updateCartQuantity = useCallback((bookId, quantity) => {
    dispatch({
      type: 'UPDATE_CART_QUANTITY',
      payload: { bookId, quantity }
    });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const setShippingAddress = useCallback((address) => {
    dispatch({
      type: 'SET_SHIPPING_ADDRESS',
      payload: address
    });
  }, []);

  const setPaymentMethod = useCallback((method) => {
    dispatch({
      type: 'SET_PAYMENT_METHOD',
      payload: method
    });
  }, []);

  const createOrder = useCallback((orderData) => {
    dispatch({
      type: 'CREATE_ORDER',
      payload: orderData
    });
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
    createOrder,
    dispatch
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
STOREPROVIDER_EOF
echo "✅ Updated StoreProvider with books data"

# 4. Check for missing dependencies
echo "=== Checking dependencies ==="
if [ ! -d "node_modules/react-paystack" ]; then
  echo "Installing react-paystack..."
  npm install react-paystack
fi

if [ ! -d "node_modules/axios" ]; then
  echo "Installing axios..."
  npm install axios
fi

echo "✅ Dependencies checked"

# 5. Verify key files exist
echo "=== Verifying key files ==="
required_files=(
  "src/App.js"
  "src/components/Navbar.js" 
  "src/pages/CatalogPage.js"
  "src/pages/CartPage.js"
  "src/pages/CheckoutPage.js"
  "src/pages/OrderConfirmationPage.js"
)

for file in "${required_files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file exists"
  else
    echo "❌ $file missing"
  fi
done

echo "=== Fixes completed ==="
echo "Now run: npm start"
