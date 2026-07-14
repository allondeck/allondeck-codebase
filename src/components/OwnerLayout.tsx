import { Link, Outlet, useLocation } from "react-router-dom";

const navItems = [
  { to: "/account/owner", label: "Overview" },
  { to: "/owner/orders", label: "Orders" },
  { to: "/account/owner/products", label: "Products" },
  { to: "/account/owner/customers", label: "Customers" },
  { to: "/account/owner/reviews", label: "Reviews" },
  { to: "/account/owner/categories", label: "Categories" },
  { to: "/account/owner/coupons", label: "Discounts" },
  { to: "/account/owner/contact", label: "Contact" },
  { to: "/account/owner/designs", label: "Designs" },
  { to: "/account/owner/settings", label: "Store Settings" },
];

export function OwnerLayout() {
  const location = useLocation();

  return (
    <div className="mx-auto max-w-[1400px] px-6 lg:px-12 pb-20 pt-8">
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        {/* Vertical sidebar - desktop */}
        <aside className="hidden w-48 shrink-0 md:block text-left">
          <div className="sticky top-24 space-y-1 rounded-lg border border-[#066175]/35 bg-[#052631] p-2">
            {navItems.map(({ to, label }) => {
              const isActive =
                to === "/account/owner"
                  ? location.pathname === "/account/owner"
                  : to === "/owner/orders"
                    ? location.pathname.startsWith("/owner/orders")
                    : location.pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`block rounded-md px-3 py-2 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-[#066175] text-[#f6ebd4] shadow-md border-l-4 border-[#e38622]"
                      : "text-brand-cream/80 hover:bg-[#066175]/30 hover:text-white"
                  }`}
                >
                  {isActive ? label : label}
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Mobile: horizontal scroll pills (scrollbar hidden) */}
        <div className="md:hidden -mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-2">
            {navItems.map(({ to, label }) => {
              const isActive =
                to === "/account/owner"
                  ? location.pathname === "/account/owner"
                  : to === "/owner/orders"
                    ? location.pathname.startsWith("/owner/orders")
                    : location.pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[#e38622] text-white"
                      : "bg-[#052631] text-brand-cream/80 border border-[#066175]/30 hover:bg-[#066175]/30 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1 pb-16">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
