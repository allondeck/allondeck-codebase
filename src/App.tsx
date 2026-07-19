import { Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
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

function RootLayout() {
  return (
    <>
      <ScrollToTop />
      {/* <Chatbox /> */}
      <Layout>
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </Layout>
    </>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/services", lazy: async () => ({ Component: (await import("./pages/Services")).default }) },
      { path: "/designs", lazy: async () => ({ Component: (await import("./pages/Designs")).default }) },
      { path: "/estimate", lazy: async () => ({ Component: (await import("./pages/Estimate")).default }) },
      { path: "/products", lazy: async () => ({ Component: (await import("./pages/Products")).default }) },
      { path: "/products/:slug", lazy: async () => ({ Component: (await import("./pages/ProductDetail")).default }) },
      { path: "/cart", lazy: async () => ({ Component: (await import("./pages/Cart")).default }) },
      { path: "/wishlist", lazy: async () => ({ Component: (await import("./pages/Wishlist")).default }) },
      { path: "/checkout", lazy: async () => ({ Component: (await import("./pages/Checkout")).default }) },
      { path: "/order-confirmation/:id", lazy: async () => ({ Component: (await import("./pages/OrderConfirmation")).default }) },
      { path: "/account", element: <Account /> },
      { path: "/account/orders", lazy: async () => ({ Component: (await import("./pages/AccountOrders")).default }) },
      { path: "/account/orders/:id", lazy: async () => ({ Component: (await import("./pages/OrderDetail")).default }) },
      { path: "/lookup-order", element: <LookupOrder /> },
      { path: "/about", element: <About /> },

      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/setup", element: <Setup /> },

      {
        path: "/account/owner",
        element: (
          <OwnerGuard>
            <Suspense fallback={<PageFallback />}>
              <Outlet />
            </Suspense>
          </OwnerGuard>
        ),
        children: [
          {
            path: "",
            lazy: async () => ({ Component: (await import("./components/OwnerLayout")).OwnerLayout }),
            children: [
              { index: true, lazy: async () => ({ Component: (await import("./pages/owner/OwnerDashboardHome")).default }) },
              {
                path: "widgets",
                lazy: async () => {
                  const module = await import("./pages/owner/OwnerDashboardHome");
                  return {
                    Component: () => <module.default showAllWidgets />
                  };
                }
              },
              { path: "products", lazy: async () => ({ Component: (await import("./pages/owner/OwnerProducts")).default }) },
              { path: "products/import", lazy: async () => ({ Component: (await import("./pages/owner/OwnerStockImport")).default }) },
              { path: "products/:id", lazy: async () => ({ Component: (await import("./pages/owner/ProductForm")).default }) },
              { path: "categories", lazy: async () => ({ Component: (await import("./pages/owner/OwnerCategories")).default }) },
              { path: "categories/:id", lazy: async () => ({ Component: (await import("./pages/owner/CategoryForm")).default }) },
              { path: "designs", lazy: async () => ({ Component: (await import("./pages/owner/OwnerDesigns")).default }) },
              { path: "coupons", lazy: async () => ({ Component: (await import("./pages/owner/OwnerCoupons")).default }) },
              { path: "coupons/:id", lazy: async () => ({ Component: (await import("./pages/owner/CouponForm")).default }) },

              { path: "orders/create-manual", element: <Navigate to="/owner/orders/create-manual" replace /> },
              { path: "orders/:id", element: <RedirectOwnerOrderId /> },
              { path: "orders", element: <Navigate to="/owner/orders" replace /> },

              { path: "customers", lazy: async () => ({ Component: (await import("./pages/owner/OwnerCustomers")).default }) },
              { path: "customers/:customerKey", lazy: async () => ({ Component: (await import("./pages/owner/OwnerCustomerDetail")).default }) },
              { path: "reviews", lazy: async () => ({ Component: (await import("./pages/owner/OwnerReviews")).default }) },
              { path: "contact", lazy: async () => ({ Component: (await import("./pages/owner/OwnerContact")).default }) },
              { path: "settings", lazy: async () => ({ Component: (await import("./pages/owner/OwnerSettings")).default }) },
            ]
          }
        ]
      },

      {
        path: "/owner",
        element: (
          <OwnerGuard>
            <Suspense fallback={<PageFallback />}>
              <Outlet />
            </Suspense>
          </OwnerGuard>
        ),
        children: [
          {
            path: "",
            lazy: async () => ({ Component: (await import("./components/OwnerLayout")).OwnerLayout }),
            children: [
              {
                path: "orders",
                lazy: async () => ({ Component: (await import("./pages/owner/OwnerOrdersLayout")).default }),
                children: [
                  { index: true, lazy: async () => ({ Component: (await import("./pages/owner/OwnerOrders")).default }) }
                ]
              },
              { path: "orders/from-invoice", lazy: async () => ({ Component: (await import("./pages/owner/OwnerOrderFromInvoice")).default }) },
              { path: "orders/create-manual", lazy: async () => ({ Component: (await import("./pages/owner/OwnerOrderCreateManual")).default }) },
              { path: "orders/:id", lazy: async () => ({ Component: (await import("./pages/owner/OwnerOrderDetail")).default }) },
            ]
          }
        ]
      },

      { path: "*", element: <NotFound /> }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
