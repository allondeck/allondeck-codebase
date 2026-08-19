import { Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useParams,
} from "react-router-dom";
import { ScrollToTop } from "./components/features/ScrollToTop";
import { useAuth } from "./context/AuthContext";
import { Layout } from "./components/layouts/Layout";
import { CastAndReelProvider } from "./components/ui/CastAndReelSplash";
// import { Chatbox } from "./components/features/chatbox";
import Home from "./pages/public/home/index";
import Account from "./pages/account/Account";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Setup from "./pages/auth/Setup";
import LookupOrder from "./pages/account/LookupOrder";
import About from "./pages/public/about/index";
import NotFound from "./pages/public/notFound/index";

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
    <CastAndReelProvider>
      <ScrollToTop />
      {/* <Chatbox /> */}
      <Layout>
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </Layout>
    </CastAndReelProvider>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/services", lazy: async () => ({ Component: (await import("./pages/public/services/index")).default }) },
      { path: "/designs", lazy: async () => ({ Component: (await import("./pages/public/designs/index")).default }) },
      { path: "/gallery", lazy: async () => ({ Component: (await import("./pages/public/gallery/index")).default }) },
      { path: "/estimate", lazy: async () => ({ Component: (await import("./pages/public/estimate/index")).default }) },
      { path: "/products", lazy: async () => ({ Component: (await import("./pages/public/products/index")).default }) },
      { path: "/products/:slug", lazy: async () => ({ Component: (await import("./pages/public/productDetail/index")).default }) },
      { path: "/cart", lazy: async () => ({ Component: (await import("./pages/public/cart/index")).default }) },
      { path: "/wishlist", lazy: async () => ({ Component: (await import("./pages/account/Wishlist")).default }) },
      { path: "/checkout", lazy: async () => ({ Component: (await import("./pages/public/checkout/index")).default }) },
      { path: "/order-confirmation/:id", lazy: async () => ({ Component: (await import("./pages/public/orderConfirmation/index")).default }) },
      { path: "/account", element: <Account /> },
      { path: "/account/orders", lazy: async () => ({ Component: (await import("./pages/account/AccountOrders")).default }) },
      { path: "/account/orders/:id", lazy: async () => ({ Component: (await import("./pages/account/OrderDetail")).default }) },
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
            lazy: async () => ({ Component: (await import("./components/layouts/OwnerLayout")).OwnerLayout }),
            children: [
              { index: true, lazy: async () => ({ Component: (await import("./pages/owner/ownerDashboardHome/index")).default }) },
              {
                path: "widgets",
                lazy: async () => {
                  const module = await import("./pages/owner/ownerDashboardHome/index");
                  return {
                    Component: () => <module.default showAllWidgets />
                  };
                }
              },
              { path: "products", lazy: async () => ({ Component: (await import("./pages/owner/ownerProducts/index")).default }) },
              { path: "products/import", lazy: async () => ({ Component: (await import("./pages/owner/ownerStockImport/index")).default }) },
              { path: "products/:id", lazy: async () => ({ Component: (await import("./pages/owner/productForm/index")).default }) },
              { path: "categories", lazy: async () => ({ Component: (await import("./pages/owner/ownerCategories/index")).default }) },
              { path: "categories/:id", lazy: async () => ({ Component: (await import("./pages/owner/categoryForm/index")).default }) },
              { path: "designs", lazy: async () => ({ Component: (await import("./pages/owner/ownerDesigns/index")).default }) },
              { path: "services", lazy: async () => ({ Component: (await import("./pages/owner/ownerServices/index")).default }) },
              { path: "gallery", element: <Navigate to="/account/owner/services?tab=gallery" replace /> },
              { path: "coupons", lazy: async () => ({ Component: (await import("./pages/owner/ownerCoupons/index")).default }) },
              { path: "coupons/:id", lazy: async () => ({ Component: (await import("./pages/owner/couponForm/index")).default }) },

              { path: "orders/create-manual", element: <Navigate to="/owner/orders/create-manual" replace /> },
              { path: "orders/:id", element: <RedirectOwnerOrderId /> },
              { path: "orders", element: <Navigate to="/owner/orders" replace /> },

              { path: "customers", lazy: async () => ({ Component: (await import("./pages/owner/ownerCustomers/index")).default }) },
              { path: "customers/:customerKey", lazy: async () => ({ Component: (await import("./pages/owner/ownerCustomerDetail/index")).default }) },
              { path: "reviews", lazy: async () => ({ Component: (await import("./pages/owner/ownerReviews/index")).default }) },
              { path: "contact", lazy: async () => ({ Component: (await import("./pages/owner/ownerContact/index")).default }) },
              { path: "settings", lazy: async () => ({ Component: (await import("./pages/owner/ownerSettings/index")).default }) },
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
            lazy: async () => ({ Component: (await import("./components/layouts/OwnerLayout")).OwnerLayout }),
            children: [
              {
                path: "orders",
                lazy: async () => ({ Component: (await import("./pages/owner/ownerOrdersLayout/index")).default }),
                children: [
                  { index: true, lazy: async () => ({ Component: (await import("./pages/owner/ownerOrders/index")).default }) }
                ]
              },
              { path: "orders/from-invoice", lazy: async () => ({ Component: (await import("./pages/owner/ownerOrderFromInvoice/index")).default }) },
              { path: "orders/create-manual", lazy: async () => ({ Component: (await import("./pages/owner/ownerOrderCreateManual/index")).default }) },
              { path: "orders/:id", lazy: async () => ({ Component: (await import("./pages/owner/ownerOrderDetail/index")).default }) },
              { path: "services", lazy: async () => ({ Component: (await import("./pages/owner/ownerServices/index")).default }) },
              { path: "gallery", element: <Navigate to="/account/owner/services?tab=gallery" replace /> },
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
