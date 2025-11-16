import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/StoreProvider';
import { PaystackButton } from 'react-paystack';
import { APP_CURRENCY, SUPPORTED_CURRENCIES, formatCurrency } from '../config/currency';

// Fixed CURRENCY_CONFIG with all required properties for Kenya
const CURRENCY_CONFIG = {
  currency: APP_CURRENCY,
  supportedCurrencies: SUPPORTED_CURRENCIES,
  format: formatCurrency,
  symbol: 'KSh', // Kenyan Shilling symbol
  decimalPlaces: 2,
  code: 'KES', // Paystack requires currency code (KES for Kenyan Shillings)
  
  // Add the missing properties that your orderBreakdown calculation needs
  taxRate: 0.16, // 16% VAT for Kenya (adjust as needed)
  shipping: {
    freeThreshold: 1000, // Free shipping threshold in KES
    standard: 200 // Standard shipping cost in KES
  },
  discount: {
    threshold: 2000, // Minimum amount for discount in KES
    rate: 0.10 // 10% discount rate
  }
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, createOrder, clearCart } = useStore();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Kenya',
    zipCode: '',
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate order breakdown using centralized config - NOW FIXED
  const orderBreakdown = useMemo(() => {
    const subtotal = cartTotal;
    const { taxRate, shipping, discount } = CURRENCY_CONFIG;
    
    // Tax calculation
    const tax = subtotal * taxRate;
    
    // Shipping calculation
    let shippingCost = 0;
    if (subtotal > 0) {
      shippingCost = subtotal >= shipping.freeThreshold ? 0 : shipping.standard;
    }
    
    // Discount calculation
    let discountAmount = 0;
    if (subtotal >= discount.threshold) {
      discountAmount = subtotal * discount.rate;
    }
    
    const total = subtotal + tax + shippingCost - discountAmount;

    return {
      subtotal,
      tax,
      taxRate: taxRate * 100, // Convert to percentage for display
      shipping: shippingCost,
      discount: discountAmount,
      discountRate: discountAmount > 0 ? discount.rate * 100 : 0,
      total,
      freeShippingThreshold: shipping.freeThreshold,
      discountThreshold: discount.threshold
    };
  }, [cartTotal]);

  // Fixed Paystack configuration
  const paystackConfig = {
    reference: new Date().getTime().toString(),
    email: formData.email || 'customer@example.com',
    amount: orderBreakdown.total * 100, // Convert to kobo (100 kobo = 1 KES)
    publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
    currency: CURRENCY_CONFIG.code, // Now using 'KES' for Kenyan Shillings
    channels: ['card', 'bank', 'ussd', 'mobile_money'],
  };

  // Paystack event handlers
  const onPaystackSuccess = (response) => {
    console.log('Payment successful!', response);
    setIsProcessing(false);
    
    // Create order with complete breakdown
    const orderData = {
      id: new Date().getTime().toString(),
      items: [...cart],
      orderBreakdown: { ...orderBreakdown },
      shippingAddress: { ...formData },
      paymentMethod: 'paystack',
      paymentReference: response.reference,
      status: 'paid',
      createdAt: new Date().toISOString()
    };

    createOrder(orderData);
    clearCart();
    
    navigate('/order-confirmation', { 
      state: { 
        orderId: orderData.id,
        total: orderBreakdown.total,
        paymentReference: response.reference
      }
    });
  };

  const onPaystackClose = () => {
    console.log('Payment modal closed');
    setIsProcessing(false);
    alert('Payment was cancelled. You can try again.');
  };

  const componentProps = {
    ...paystackConfig,
    text: isProcessing ? 'Processing...' : `Pay ${formatCurrency(orderBreakdown.total)}`,
    onSuccess: onPaystackSuccess,
    onClose: onPaystackClose,
  };

  // Check if Paystack key is configured
  if (!process.env.REACT_APP_PAYSTACK_PUBLIC_KEY) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-red-800 mb-2">Paystack Not Configured</h2>
          <p className="text-red-600 mb-4">
            Please add your Paystack public key to the .env file as REACT_APP_PAYSTACK_PUBLIC_KEY
          </p>
          <button 
            onClick={() => navigate('/cart')}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
          >
            Return to Cart
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <button 
            onClick={() => navigate('/catalog')}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2].map((stepNumber) => (
            <React.Fragment key={stepNumber}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= stepNumber ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 2 && (
                <div className={`w-16 h-1 ${
                  step > stepNumber ? 'bg-primary' : 'bg-gray-300'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Form fields remain the same */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+254712345678"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="123 Main Street"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nairobi"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.country ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="Kenya">Kenya</option>
                    <option value="Uganda">Uganda</option>
                    <option value="Tanzania">Tanzania</option>
                    <option value="Rwanda">Rwanda</option>
                  </select>
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.zipCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="00100"
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Payment</h2>
              <div className="text-center">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Pay with Paystack</h3>
                  <p className="text-gray-600 mb-4">
                    Secure payment processed by Paystack. Accepts cards, mobile money, and bank transfers.
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold mb-2">Order Total</h4>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(orderBreakdown.total)}</p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <PaystackButton 
                    {...componentProps}
                    className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  />
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  <p>You'll be redirected to Paystack's secure payment page</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                onClick={handlePreviousStep}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
              >
                Back to Shipping
              </button>
            )}
            {step < 2 && (
              <button
                onClick={handleNextStep}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark ml-auto"
              >
                Continue to Payment
              </button>
            )}
          </div>
        </div>

        {/* Enhanced Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            {/* Cart Items */}
            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item.book.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <span className="text-gray-800 font-medium block">
                      {item.book.title}
                    </span>
                    <span className="text-gray-600 text-sm">
                      Qty: {item.quantity}
                    </span>
                  </div>
                  <span className="font-medium ml-2">
                    {formatCurrency(item.book.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Order Breakdown */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(orderBreakdown.subtotal)}</span>
              </div>
              
              {/* Tax */}
              <div className="flex justify-between text-gray-600">
                <span>VAT ({orderBreakdown.taxRate}%)</span>
                <span>{formatCurrency(orderBreakdown.tax)}</span>
              </div>
              
              {/* Shipping */}
              <div className="flex justify-between text-gray-600">
                <span>
                  Shipping
                  {orderBreakdown.shipping === 0 && (
                    <span className="text-green-600 text-sm ml-1">• FREE</span>
                  )}
                </span>
                <span>
                  {orderBreakdown.shipping === 0 ? 'FREE' : formatCurrency(orderBreakdown.shipping)}
                </span>
              </div>
              
              {/* Discount */}
              {orderBreakdown.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({orderBreakdown.discountRate}% off)</span>
                  <span>-{formatCurrency(orderBreakdown.discount)}</span>
                </div>
              )}

              {/* Promotional Messages */}
              <div className="text-xs text-gray-500 space-y-1 mt-2">
                {orderBreakdown.subtotal < orderBreakdown.freeShippingThreshold && (
                  <p>
                    Add {formatCurrency(orderBreakdown.freeShippingThreshold - orderBreakdown.subtotal)} more for free shipping!
                  </p>
                )}
                {orderBreakdown.subtotal < orderBreakdown.discountThreshold && (
                  <p>
                    Spend {formatCurrency(orderBreakdown.discountThreshold - orderBreakdown.subtotal)} more for 10% off!
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                <span>Total</span>
                <span>{formatCurrency(orderBreakdown.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;