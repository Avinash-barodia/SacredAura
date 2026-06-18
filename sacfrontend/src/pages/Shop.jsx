import { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../utils/api";
import { Search, Filter, X, ChevronDown, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import styles from "./Shop.module.css";
import { getCategoryIcon } from "../constants/categoryIcons";

function Shop() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openCategory, setOpenCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  const [screen, setScreen] = useState(window.innerWidth);

  // Pagination & Load More State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Sidebar premium state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState(searchParams.get("search") || "");

  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();

  // Safari vh fix for mobile drawer
  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty(
        '--vh', `${window.innerHeight * 0.01}px`
      );
    };
    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();

    // Fly animation logic
    const card = e.currentTarget.closest(`.${styles.productCard}`);
    const imgElement = card ? card.querySelector('img') : null;
    if (imgElement) {
      const clonedImg = imgElement.cloneNode(true);
      const rect = imgElement.getBoundingClientRect();

      clonedImg.style.position = 'fixed';
      clonedImg.style.top = `${rect.top}px`;
      clonedImg.style.left = `${rect.left}px`;
      clonedImg.style.width = `${rect.width}px`;
      clonedImg.style.height = `${rect.height}px`;
      clonedImg.style.objectFit = 'contain';
      clonedImg.style.zIndex = '1000'; // Fixed z-index
      clonedImg.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
      document.body.appendChild(clonedImg);

      // Force reflow
      void clonedImg.offsetWidth;

      // Target position (cart icon is usually top right)
      clonedImg.style.top = '20px';
      clonedImg.style.left = 'calc(100vw - 80px)';
      clonedImg.style.width = '30px';
      clonedImg.style.height = '30px';
      clonedImg.style.opacity = '0.3';
      clonedImg.style.transform = 'scale(0.1)';

      setTimeout(() => {
        if (document.body.contains(clonedImg)) document.body.removeChild(clonedImg);
      }, 800);
    }

    addToCart(product);
  };

  // Load categories only on mount
  useEffect(() => {
    api.get("/categories").then(res => setCategories(res.data)).catch(console.error);
  }, []);

  // Watch URL params to fetch products
  useEffect(() => {
    const page = parseInt(searchParams.get("page")) || 1;
    const categoryQuery = searchParams.get("category") || null;
    const searchQuery = searchParams.get("search") || "";

    fetchProducts(page, categoryQuery, searchQuery, page > 1 && products.length > 0);
  }, [searchParams]);

  useEffect(() => {
    const handleResize = () => setScreen(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchProducts = async (page, categoryId, searchStr, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setIsFetchingMore(true);
      } else {
        setLoading(true);
      }

      let url = `/products?page=${page}&limit=12`;
      if (categoryId) url += `&category=${categoryId}`;
      if (searchStr) url += `&search=${searchStr}`;

      const res = await api.get(url);
      
      if (isLoadMore) {
        setProducts(prev => {
          const existingIds = new Set(prev.map(p => p._id));
          const newProducts = res.data.products.filter(p => !existingIds.has(p._id));
          return [...prev, ...newProducts];
        });
      } else {
        setProducts(res.data.products || []);
      }
      
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);

    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to load products.");
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !isFetchingMore) {
      fetchProducts(currentPage + 1, selectedCategory, sidebarSearchQuery, true);
    }
  };

  const updateFilters = (newCategoryId, newSearchStr) => {
    const params = new URLSearchParams(searchParams);
    if (newCategoryId) params.set("category", newCategoryId);
    else params.delete("category");
    
    if (newSearchStr) params.set("search", newSearchStr);
    else params.delete("search");

    params.set("page", "1");
    setSearchParams(params);
  };

  const mainCategories = categories.filter((cat) => !cat.parent);

  const getSubCategories = (parentId) => {
    return categories.filter(
      (cat) =>
        cat.parent &&
        cat.parent.toString() === parentId.toString()
    );
  };

  const handleMainClick = (id) => {
    setOpenCategory(openCategory === id ? null : id);
    setSelectedCategory(id);
    updateFilters(id, sidebarSearchQuery);
  };

  const handleSubClick = (id) => {
    setSelectedCategory(id);
    updateFilters(id, sidebarSearchQuery);
  };

  const handleAllProducts = () => {
    setSelectedCategory(null);
    setOpenCategory(null);
    updateFilters(null, sidebarSearchQuery);
  };

  // 🔥 SEARCH DEBOUNCE
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (sidebarSearchQuery !== (searchParams.get("search") || "")) {
        updateFilters(selectedCategory, sidebarSearchQuery);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [sidebarSearchQuery]);

  // Sort by stock
  const sortedProducts = [...(products || [])].sort((a, b) => {
    const aInStock = a.stock > 0 ? 1 : 0;
    const bInStock = b.stock > 0 ? 1 : 0;
    return bInStock - aInStock;
  });

  // Helper for Product Counts (Estimates based on currently loaded products)
  const getProductCount = (categoryId) => {
    return (products || []).filter(p => p.category?._id === categoryId || p.category === categoryId || p.category?.parent === categoryId).length;
  };

  return (
    <div className={styles.pageWrapper}>
      <Helmet>
        <title>Shop All Products | SacredAura</title>
        <meta name="description" content="Browse our complete catalog of premium smart home devices, lighting, and automation products at SacredAura." />
      </Helmet>

      {/* ================= MOBILE FILTER BUTTON ================= */}
      {screen < 768 && (
        <button
          className={styles.mobileFilterButton}
          onClick={() => setIsMobileFilterOpen(true)}
        >
          <Filter size={18} /> Filters
        </button>
      )}

      {/* ================= PREMIUM SIDEBAR ================= */}
      <AnimatePresence>
        {(screen >= 768 || isMobileFilterOpen) && (
          <>
            {/* Mobile Overlay */}
            {screen < 768 && isMobileFilterOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileFilterOpen(false)}
                className={styles.overlay}
              />
            )}

            <motion.div
              initial={screen < 768 ? { y: "100%" } : { opacity: 1 }}
              animate={screen < 768 ? { y: 0 } : { opacity: 1 }}
              exit={screen < 768 ? { y: "100%" } : { opacity: 1 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={screen < 768 ? styles.mobileDrawer : styles.sidebar}
            >
              {/* Header */}
              <div>
                <div className={styles.flexBetween}>
                  <div style={{ fontSize: "12px", fontWeight: "700", color: "#0077FF", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "4px" }}>
                    FILTERS
                  </div>
                  {screen < 768 && (
                    <button onClick={() => setIsMobileFilterOpen(false)} style={{ background: "transparent", border: "none", color: "#6B7280", cursor: "pointer" }}>
                      <X size={24} />
                    </button>
                  )}
                </div>
                <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#111827", margin: 0, letterSpacing: "-0.5px" }}>Discover</h2>
                <p style={{ fontSize: "14px", color: "#6B7280", marginTop: "4px", margin: 0 }}>Find your perfect smart solution.</p>
              </div>

              {/* Search Bar */}
              <div style={{ position: "relative" }}>
                <Search size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={sidebarSearchQuery}
                  onChange={(e) => setSidebarSearchQuery(e.target.value)}
                  className={styles.sidebarSearch}
                />
              </div>

              {/* Categories */}
              <div className={styles.categoryList}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", marginBottom: "4px" }}>Categories</h3>

                {/* All Products */}
                <div
                  onClick={handleAllProducts}
                  className={`${styles.categoryItem} ${selectedCategory === null ? styles.categoryItemActive : ""}`}
                >
                  <div className={styles.iconWrapper} style={{ background: selectedCategory === null ? "#0077FF" : "#F3F4F6", color: selectedCategory === null ? "#fff" : "#6B7280" }}>
                    <Layers size={18} />
                  </div>
                  <div style={{ flex: 1 }}>All Products</div>
                </div>

                {/* Main Categories */}
                {mainCategories.map((mainCat) => {
                  const subCategories = getSubCategories(mainCat._id);
                  const Icon = getCategoryIcon(mainCat.name);
                  const isActive = selectedCategory === mainCat._id || subCategories.some(sub => sub._id === selectedCategory);
                  const isOpen = openCategory === mainCat._id;

                  return (
                    <div key={mainCat._id}>
                      <div
                        onClick={() => handleMainClick(mainCat._id)}
                        className={`${styles.categoryItem} ${isActive ? styles.categoryItemActive : ""}`}
                      >
                        <div className={styles.iconWrapper} style={{ background: isActive ? "#0077FF" : "#F3F4F6", color: isActive ? "#fff" : "#6B7280" }}>
                          <Icon size={18} />
                        </div>
                        <div style={{ flex: 1 }}>
                          {mainCat.name}
                        </div>
                        {subCategories.length > 0 && (
                          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }} style={{ color: "#9CA3AF", display: "flex" }}>
                            <ChevronDown size={18} />
                          </motion.div>
                        )}
                      </div>

                      {/* Subcategories */}
                      <AnimatePresence>
                        {isOpen && subCategories.length > 0 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            style={{ overflow: "hidden" }}
                          >
                            <div style={{ padding: "8px 16px 8px 48px", display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
                              {subCategories.map((sub) => (
                                <div
                                  key={sub._id}
                                  onClick={() => handleSubClick(sub._id)}
                                  className={styles.subcategoryItem}
                                  style={{
                                    background: selectedCategory === sub._id ? "#E0F2FE" : "transparent",
                                    color: selectedCategory === sub._id ? "#0369A1" : "#4B5563"
                                  }}
                                >
                                  <span>{sub.name}</span>
                                  <span style={{ background: selectedCategory === sub._id ? "#BAE6FD" : "#E5E7EB", padding: "2px 8px", borderRadius: "100px", fontSize: "12px", color: selectedCategory === sub._id ? "#0369A1" : "#6B7280" }}>
                                    {getProductCount(sub._id)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Mobile apply button */}
              {screen < 768 && (
                <div style={{ marginTop: "auto", paddingTop: "20px" }}>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    style={{
                      width: "100%", boxSizing: "border-box", padding: "16px", background: "#0077FF", color: "#fff",
                      border: "none", borderRadius: "100px", fontSize: "16px", fontWeight: "700",
                      boxShadow: "0 4px 15px rgba(0,119,255,0.3)", cursor: "pointer"
                    }}
                  >
                    Show Results
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ================= PRODUCTS ================= */}
      <div className={styles.productGridWrapper}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p className={styles.loadingText}>Loading amazing products...</p>
          </div>
        ) : sortedProducts.length === 0 ? (
          <p>No products found</p>
        ) : (
          <>
            <div className={styles.productGrid}>
              {sortedProducts.map((product) => (
                <div
                  className={`${styles.productCard} ${product.stock === 0 ? styles.outOfStockCard : ""}`}
                  key={product._id}
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <div className={styles.productImageWrapper}>
                    <img
                      src={product.mainImage || product.image || "https://via.placeholder.com/300"}
                      alt={product.name}
                      loading="lazy"
                      className={styles.productImage}
                    />
                    {product.stock === 0 && (
                      <div className={styles.outOfStockBadge}>
                        Out of Stock
                      </div>
                    )}
                  </div>

                  <div className={styles.productCardBody}>
                    {/* 🔥 TITLE + ADD BUTTON */}
                    <div className={styles.productNameRow}>
                      <h4 className={styles.productName}>
                        {product.name}
                      </h4>
                      
                      {/* ADD BUTTON OR QUANTITY SELECTOR */}
                      {(() => {
                        if (product.stock === 0) {
                          return (
                            <div className={styles.availableSoon}>
                              Available Soon
                            </div>
                          );
                        }
                        const cartItem = cart.find(item => item._id === product._id);
                        if (cartItem) {
                          return (
                            <div className={styles.quantityControl} onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => {
                                  if (cartItem.quantity === 1) {
                                    removeFromCart(product._id);
                                  } else {
                                    updateQuantity(product._id, -1);
                                  }
                                }}
                              >
                                -
                              </button>
                              <span>{cartItem.quantity}</span>
                              <button onClick={() => updateQuantity(product._id, 1)}>
                                +
                              </button>
                            </div>
                          );
                        } else {
                          return (
                            <button
                              className={styles.addButton}
                              onClick={(e) => handleAddToCart(e, product)}
                            >
                              ADD
                            </button>
                          );
                        }
                      })()}
                    </div>

                    {/* ⭐ RATING */}
                    <div className={styles.ratingRow}>
                      <span className={styles.ratingStars}>
                        {"★".repeat(Math.round(product.rating || 0)) + "☆".repeat(5 - Math.round(product.rating || 0))}
                      </span>
                      <span className={styles.ratingValue}>
                        {product.rating?.toFixed(1) || "0.0"}
                      </span>
                      <span className={styles.ratingCount}>
                        ({product.reviews?.length || 0} reviews)
                      </span>
                    </div>

                    {/* 💰 PRICE */}
                    <p className={styles.productPrice}>
                      ₹{product.price}
                      {product.discount > 0 && (
                        <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span className={styles.originalPrice}>
                            ₹{product.originalPrice}
                          </span>
                          <span className={styles.discountBadge}>
                            {product.discount}% OFF
                          </span>
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* LOAD MORE BUTTON / TEXT */}
            {currentPage < totalPages ? (
              <button
                className={styles.loadMoreBtn}
                onClick={handleLoadMore}
                disabled={isFetchingMore}
              >
                {isFetchingMore ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div className={styles.loadingSpinner} style={{ width: "16px", height: "16px", borderWidth: "2px" }}></div>
                    Loading...
                  </div>
                ) : (
                  "Load More"
                )}
              </button>
            ) : sortedProducts.length > 0 ? (
              <p className={styles.allLoadedText}>You've seen it all</p>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

export default Shop;