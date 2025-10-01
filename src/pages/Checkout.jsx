import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import toast from 'react-hot-toast'; // Import toast
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const navigate = useNavigate();
  const { userId } = useAuth(); // Get userId from AuthContext
  const [cartItems, setCartItems] = useState([]); // Initialize with empty array
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [newAddress, setNewAddress] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    landmark: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const [cartResponse, userResponse] = await Promise.all([
          fetch(`http://localhost:5000/api/cart/${userId}`),
          fetch(`http://localhost:5000/api/user/${userId}`),
        ]);

        const cartData = await cartResponse.json();
        const userData = await userResponse.json();

        if (cartResponse.ok) {
          setCartItems(cartData.items || []);
        } else {
          console.error('Failed to fetch cart:', cartData.message);
          setCartItems([]);
        }

        if (userResponse.ok) {
          setUser(userData);
        } else {
          console.error('Failed to fetch user:', userData.message);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const [shippingAddressOption, setShippingAddressOption] = useState('original'); // 'original' or 'new'
  const [paymentMethod, setPaymentMethod] = useState('creditCard'); // 'creditCard' or 'paypal'
  const [billingAddressOption, setBillingAddressOption] = useState('sameAsShipping'); // 'sameAsShipping' or 'newBillingAddress'

  useEffect(() => {
    if (user && (!user.addresses || user.addresses.length === 0)) {
      setShippingAddressOption('new');
    }
  }, [user]);

  const handleNewAddressChange = (e) => {
    const { id, value } = e.target;
    setNewAddress(prev => ({ ...prev, [id]: value }));
  };

  const handleQuantityChange = async (productId, delta) => {
    if (!userId) return;

    const item = cartItems.find(item => item.productId._id === productId);
    if (!item) return;

    const newQuantity = item.quantity + delta;

    try {
      const response = await fetch(`http://localhost:5000/api/cart/${userId}/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      const data = await response.json();
      if (response.ok) {
        setCartItems(data.items || []);
      } else {
        console.error('Failed to update cart item quantity:', data.message);
      }
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
    }
  };

  const handleRemoveItem = async (productId) => {
    if (!userId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/cart/${userId}/${productId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.ok) {
        setCartItems(data.items || []);
      } else {
        console.error('Failed to remove cart item:', data.message);
      }
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!userId) {
      toast.error('Please log in to place an order.');
      return;
    }
    if (cartItems.length === 0) {
      toast.error('Your cart is empty. Please add items before placing an order.');
      return;
    }

    const loadingToast = toast.loading("Placing your order...");

    let shippingAddress = {};
    if (shippingAddressOption === 'original') {
      const defaultAddress = user?.addresses.find(addr => addr.isDefault);
      if (!defaultAddress) {
        toast.error('Please select or add a shipping address.', { id: loadingToast });
        setShippingAddressOption('new');
        return;
      }
      shippingAddress = defaultAddress;
    } else {
      // Validation for new address
      if (!newAddress.addressLine1 || !newAddress.city || !newAddress.state || !newAddress.postalCode || !newAddress.country) {
        toast.error('Please fill in all required address fields.', { id: loadingToast });
        return;
      }
      shippingAddress = newAddress;

      // Save the new address to the user's profile
      try {
        const saveAddressResponse = await fetch(`http://localhost:5000/api/user/${userId}/address`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newAddress),
        });
        if (!saveAddressResponse.ok) {
          const errorData = await saveAddressResponse.json();
          throw new Error(errorData.message || 'Failed to save new address.');
        }
        toast.success('New address saved to your profile!', { id: loadingToast });
      } catch (error) {
        console.error('Error saving new address:', error);
        toast.error(error.message || 'Failed to save new address.', { id: loadingToast });
        return; // Prevent order placement if address saving fails
      }
    }

    let billingAddress = {};
    if (billingAddressOption === 'sameAsShipping') {
      billingAddress = shippingAddress;
    } else {
      // TODO: Implement new billing address form
      toast.error('Entering a different billing address is not supported yet.', { id: loadingToast });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          shippingAddress,
          billingAddress,
          paymentMethod,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Order placed successfully!', { id: loadingToast });
        setCartItems([]); // Clear local cart after successful order
        navigate('/order-confirmation', { state: { order: data.order } });
      } else {
        toast.error(data.message || 'Failed to place order.', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Error placing order.', { id: loadingToast });
    }
  };

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalDiscount = cartItems.reduce((acc, item) => {
    const itemDiscount = item.discount ? (item.price * item.quantity * item.discount) / 100 : 0;
    return acc + itemDiscount;
  }, 0);
  const priceAfterDiscount = subtotal - totalDiscount;
  const gstRate = 0.18; // 18%
  const totalGst = priceAfterDiscount * gstRate;
  const shippingCharge = 5.00; // Flat shipping charge
  const finalTotal = priceAfterDiscount + totalGst + shippingCharge;

  

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div className="text-center text-xl font-semibold">Loading cart...</div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1: Contact Information and Shipping Address */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Contact & Shipping</h2>
          <form>
            {/* Information Section */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={user?.name || ''}
                    readOnly
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={user?.email || ''}
                    readOnly
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address Section */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <input
                    type="radio"
                    id="originalAddress"
                    name="shippingAddressOption"
                    value="original"
                    checked={shippingAddressOption === 'original'}
                    onChange={() => setShippingAddressOption('original')}
                    className="mr-2"
                    disabled={!user?.addresses.some(addr => addr.isDefault)}
                  />
                  <label htmlFor="originalAddress">Same as original address</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="newAddress"
                    name="shippingAddressOption"
                    value="new"
                    checked={shippingAddressOption === 'new'}
                    onChange={() => setShippingAddressOption('new')}
                    className="mr-2"
                  />
                  <label htmlFor="newAddress">Add another address</label>
                </div>
              </div>

              {shippingAddressOption === 'original' ? (
                <div className="p-4 bg-gray-100 rounded-md">
                  {user?.addresses.find(addr => addr.isDefault) ? (
                    <div>
                      <p>{user.addresses.find(addr => addr.isDefault).addressLine1}</p>
                      {user.addresses.find(addr => addr.isDefault).addressLine2 && <p>{user.addresses.find(addr => addr.isDefault).addressLine2}</p>}
                      <p>{user.addresses.find(addr => addr.isDefault).city}, {user.addresses.find(addr => addr.isDefault).state} {user.addresses.find(addr => addr.isDefault).postalCode}</p>
                      <p>{user.addresses.find(addr => addr.isDefault).country}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500">No default address found. Please add a new one.</p>
                  )}
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="addressLine1">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      id="addressLine1"
                      value={newAddress.addressLine1}
                      onChange={handleNewAddressChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="addressLine2">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      id="addressLine2"
                      value={newAddress.addressLine2}
                      onChange={handleNewAddressChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        value={newAddress.city}
                        onChange={handleNewAddressChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="state">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        value={newAddress.state}
                        onChange={handleNewAddressChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="postalCode">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        value={newAddress.postalCode}
                        onChange={handleNewAddressChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">
                        Country
                      </label>
                      <input
                        type="text"
                        id="country"
                        value={newAddress.country}
                        onChange={handleNewAddressChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="landmark">
                      Landmark
                    </label>
                    <input
                      type="text"
                      id="landmark"
                      value={newAddress.landmark}
                      onChange={handleNewAddressChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                </>
              )}
            </div>
          </form>
        </div>

        {/* Column 2: Payment Method and Billing Address */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Payment & Billing</h2>
          <form>
            {/* Payment Method Section */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
              <div className="flex items-center mb-4">
                <input
                  type="radio"
                  id="creditCard"
                  name="paymentMethod"
                  value="creditCard"
                  checked={paymentMethod === 'creditCard'}
                  onChange={() => setPaymentMethod('creditCard')}
                  className="mr-2"
                />
                <label htmlFor="creditCard">Credit Card</label>
              </div>
              <div className="flex items-center mb-4">
                <input
                  type="radio"
                  id="debitCard"
                  name="paymentMethod"
                  value="debitCard"
                  checked={paymentMethod === 'debitCard'}
                  onChange={() => setPaymentMethod('debitCard')}
                  className="mr-2"
                />
                <label htmlFor="debitCard">Debit Card</label>
              </div>
              <div className="flex items-center mb-4">
                <input
                  type="radio"
                  id="upi"
                  name="paymentMethod"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="mr-2"
                />
                <label htmlFor="upi">UPI</label>
              </div>
              <div className="flex items-center mb-4">
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mr-2"
                />
                <label htmlFor="cod">Cash on Delivery</label>
              </div>

              {paymentMethod === 'creditCard' && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cardNumber">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nameOnCard">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      id="nameOnCard"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="expiry">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        id="expiry"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="securityCode">
                        Security Code
                      </label>
                      <input
                        type="text"
                        id="securityCode"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'debitCard' && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cardNumber">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nameOnCard">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      id="nameOnCard"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="expiry">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        id="expiry"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="securityCode">
                        Security Code
                      </label>
                      <input
                        type="text"
                        id="securityCode"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="mt-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="upiId">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    id="upiId"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              )}
            </div>

            {/* Billing Address Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Billing Address</h3>
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <input
                    type="radio"
                    id="sameAsShipping"
                    name="billingAddressOption"
                    value="sameAsShipping"
                    checked={billingAddressOption === 'sameAsShipping'}
                    onChange={() => setBillingAddressOption('sameAsShipping')}
                    className="mr-2"
                  />
                  <label htmlFor="sameAsShipping">Same as shipping address</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="newBillingAddress"
                    name="billingAddressOption"
                    value="newBillingAddress"
                    checked={billingAddressOption === 'newBillingAddress'}
                    onChange={() => setBillingAddressOption('newBillingAddress')}
                    className="mr-2"
                  />
                  <label htmlFor="newBillingAddress">Add new billing address</label>
                </div>
              </div>

              {billingAddressOption === 'sameAsShipping' ? (
                <div className="p-4 bg-gray-100 rounded-md">
                  {shippingAddressOption === 'original' ? (
                    user?.addresses.find(addr => addr.isDefault) ? (
                      <div>
                        <p>{user.addresses.find(addr => addr.isDefault).addressLine1}</p>
                        {user.addresses.find(addr => addr.isDefault).addressLine2 && <p>{user.addresses.find(addr => addr.isDefault).addressLine2}</p>}
                        <p>{user.addresses.find(addr => addr.isDefault).city}, {user.addresses.find(addr => addr.isDefault).state} {user.addresses.find(addr => addr.isDefault).postalCode}</p>
                        <p>{user.addresses.find(addr => addr.isDefault).country}</p>
                      </div>
                    ) : (
                      <p className="text-gray-500">No default address found.</p>
                    )
                  ) : (
                    <div>
                      <p>{newAddress.addressLine1}</p>
                      {newAddress.addressLine2 && <p>{newAddress.addressLine2}</p>}
                      <p>{newAddress.city}, {newAddress.state} {newAddress.postalCode}</p>
                      <p>{newAddress.country}</p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="billingAddress">
                      Address
                    </label>
                    <input
                      type="text"
                      id="billingAddress"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="billingCity">
                        City
                      </label>
                      <input
                        type="text"
                        id="billingCity"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="billingState">
                        State
                      </label>
                      <input
                        type="text"
                        id="billingState"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="billingZip">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        id="billingZip"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </form>
        </div>

        {/* Column 3: Order Summary */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex justify-between items-center">
                <div className="flex items-center">
                  <img src={`http://localhost:5000${item.imageUrl}`} alt={item.name} className="w-16 h-16 object-cover rounded mr-4" />
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => handleQuantityChange(item.productId._id, -1)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded-l"
                      >
                        -
                      </button>
                      <span className="py-1 px-4 bg-gray-100">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.productId._id, 1)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded-r"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <p className="font-semibold mr-4">₹{(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => handleRemoveItem(item.productId._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between text-red-500">
                <span>Discount:</span>
                <span>-₹{totalDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>GST ({(gstRate * 100).toFixed(0)}%):</span>
              <span>₹{totalGst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>₹{shippingCharge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mt-4 pt-2 border-t">
              <span className="font-bold text-lg">Order Total:</span>
              <span className="font-bold text-lg">₹{finalTotal.toFixed(2)}</span>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded w-full mt-4"
            >
              Place Order
            </button>
            
          </div>
        </div>
        </div> {/* Closing div for the grid container */}
      </>
      )}
    </div>
  );
}
