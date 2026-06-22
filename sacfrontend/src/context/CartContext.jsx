import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const clearCart = () => {
  setCart([]);
};

  // Load from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (!savedCart || savedCart === "undefined") {
        localStorage.removeItem("cart");
      } else {
        setCart(JSON.parse(savedCart));
      }
    } catch (err) {
      localStorage.removeItem("cart");
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ADD TO CART
  const addToCart = (product) => {
    const exists = cart.find((item) => item._id === product._id);

    if (exists) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1, stock: product.stock || 0 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1, stock: product.stock || 0 }]);
    }
  };

  // UPDATE QUANTITY (+ / -)
  const updateQuantity = (id, change) => {
    setCart(
      cart.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + change),
            }
          : item
      )
    );
  };

  // REMOVE
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  
  const gstAmount = parseFloat(((subtotal * 18) / 100).toFixed(2));
  const totalAmount = parseFloat((subtotal + gstAmount).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        subtotal,
        gstAmount,
        totalAmount,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
