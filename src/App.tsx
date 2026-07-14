import { lazy, Suspense } from "react";
import {
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { useAuth } from "./context/AuthContext";
import { Layout } from "./components/Layout";
// import { Chatbox } from "./components/chatbox";
import Home from "./pages/Home";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Setup from "./pages/Setup";
import LookupOrder from "./pages/LookupOrder";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const OrderDetail = lazy(() => import("./pages/OrderDetail"));
const AccountOrders = lazy(() => import("./pages/AccountOrders"));
const Services = lazy(() => import("./pages/Services"));
const Designs = lazy(() => import("./pages/Designs"));
const Estimate = lazy(() => import("./pages/Estimate"));
const OwnerLayout = lazy(() =>
  import("./components/OwnerLayout").then((m) => ({ default: m.OwnerLayout })),
);
const OwnerDashboardHome = lazy(
  () => import("./pages/owner/OwnerDashboardHome"),
);
const OwnerProducts = lazy(() => import("./pages/owner/OwnerProducts"));
const OwnerStockImport = lazy(() => import("./pages/owner/OwnerStockImport"));
const OwnerCategories = lazy(() => import("./pages/owner/OwnerCategories"));
const OwnerOrdersLayout = lazy(() => import("./pages/owner/OwnerOrdersLayout"));
const OwnerOrders = lazy(() => import("./pages/owner/OwnerOrders"));
const OwnerCustomers = lazy(() => import("./pages/owner/OwnerCustomers"));
const OwnerCustomerDetail = lazy(
  () => import("./pages/owner/OwnerCustomerDetail"),
);
const OwnerContact = lazy(() => import("./pages/owner/OwnerContact"));
const OwnerOrderFromInvoice = lazy(
  () => import("./pages/owner/OwnerOrderFromInvoice"),
);
const OwnerOrderCreateManual = lazy(
  () => import("./pages/owner/OwnerOrderCreateManual"),
);
const OwnerOrderDetail = lazy(() => import("./pages/owner/OwnerOrderDetail"));
const OwnerSettings = lazy(() => import("./pages/owner/OwnerSettings"));
const OwnerCoupons = lazy(() => import("./pages/owner/OwnerCoupons"));
const OwnerReviews = lazy(() => import("./pages/owner/OwnerReviews"));
const ProductForm = lazy(() => import("./pages/owner/ProductForm"));
const CategoryForm = lazy(() => import("./pages/owner/CategoryForm"));
const CouponForm = lazy(() => import("./pages/owner/CouponForm"));
const OwnerDesigns = lazy(() => import("./pages/owner/OwnerDesigns"));

function RedirectOwnerOrderId() {
  const { id } = useParams();
  return <Navigate to={`/owner/orders/${id}`} replace />;
}

function PageFallback() {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"
        aria-hidden
      />
    </div>
  );
}

function OwnerGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isOwner } = useAuth();
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login?redirect=/account/owner" replace />;
  if (!isOwner) return <Navigate to="/account" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <>
      <ScrollToTop />
      {/* <Chatbox /> */}
      <Layout>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/designs" element={<Designs />} />
            <Route path="/estimate" element={<Estimate />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route
              path="/order-confirmation/:id"
              element={<OrderConfirmation />}
            />
            <Route path="/account" element={<Account />} />
            <Route path="/account/orders" element={<AccountOrders />} />
            <Route path="/account/orders/:id" element={<OrderDetail />} />
            <Route path="/lookup-order" element={<LookupOrder />} />
            <Route path="/about" element={<About />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/setup" element={<Setup />} />
            <Route
              path="/account/owner"
              element={
                <OwnerGuard>
                  <OwnerLayout />
                </OwnerGuard>
              }
            >
              <Route index element={<OwnerDashboardHome />} />
              <Route
                path="widgets"
                element={<OwnerDashboardHome showAllWidgets />}
              />
              <Route path="products" element={<OwnerProducts />} />
              <Route path="products/import" element={<OwnerStockImport />} />
              <Route path="products/:id" element={<ProductForm />} />
              <Route path="categories" element={<OwnerCategories />} />
              <Route path="categories/:id" element={<CategoryForm />} />
              <Route path="designs" element={<OwnerDesigns />} />
              <Route path="coupons" element={<OwnerCoupons />} />
              <Route path="coupons/:id" element={<CouponForm />} />

              <Route
                path="orders/create-manual"
                element={<Navigate to="/owner/orders/create-manual" replace />}
              />
              <Route path="orders/:id" element={<RedirectOwnerOrderId />} />
              <Route
                path="orders"
                element={<Navigate to="/owner/orders" replace />}
              />
              <Route path="customers" element={<OwnerCustomers />} />
              <Route
                path="customers/:customerKey"
                element={<OwnerCustomerDetail />}
              />
              <Route path="reviews" element={<OwnerReviews />} />
              <Route path="contact" element={<OwnerContact />} />
              <Route path="settings" element={<OwnerSettings />} />
            </Route>
            <Route
              path="/owner"
              element={
                <OwnerGuard>
                  <OwnerLayout />
                </OwnerGuard>
              }
            >
              <Route path="orders" element={<OwnerOrdersLayout />}>
              <Route index element={<OwnerOrders />} />
              </Route>
              <Route
                path="orders/from-invoice"
                element={<OwnerOrderFromInvoice />}
              />
              <Route
                path="orders/create-manual"
                element={<OwnerOrderCreateManual />}
              />
              <Route path="orders/:id" element={<OwnerOrderDetail />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </>
  );
}

export default App;
