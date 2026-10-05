import { useEffect, useState } from "react";
import { Link, useLocation, matchRoutes, LinkProps } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useStoreSettings } from "../../hooks/useStoreSettings";
import { Icon } from "../ui/Icon";
import { supabase } from "../../lib/supabase";
import { router } from "../../App";

function PrefetchLink(props: LinkProps) {
  const prefetchRoute = () => {
    if (typeof props.to === "string") {
      const matches = matchRoutes(router.routes, props.to);
      if (matches) {
        for (const match of matches) {
          if (match.route.lazy) {
            match.route.lazy();
          }
        }
      }
    }
  };

  return (
    <Link
      {...props}
      onMouseEnter={(e) => {
        prefetchRoute();
        props.onMouseEnter?.(e);
      }}
      onFocus={(e) => {
        prefetchRoute();
        props.onFocus?.(e);
      }}
    />
  );
}

type LayoutProps = {
  children: React.ReactNode;
};

function parseSettingString(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v.replace(/^"|"$/g, "").trim();
  return "";
}

function getStoreName(settings: Record<string, unknown>): string {
  const v = settings.store_name;
  if (v == null) return "Store";
  const trimmed = parseSettingString(v);
  return trimmed || "Store";
}

export function Layout({ children }: LayoutProps) {
  const { itemCount } = useCart();
  const { user, loading: authLoading, isOwner } = useAuth();
  const { settings } = useStoreSettings();

  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [footerForm, setFooterForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [footerSubmitted, setFooterSubmitted] = useState(false);
  const [footerError, setFooterError] = useState<string | null>(null);
  const [footerSubmitting, setFooterSubmitting] = useState(false);

  const handleFooterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFooterError(null);
    setFooterSubmitting(true);
    const { error: err } = await supabase.from("contact_requests").insert({
      name: footerForm.name.trim(),
      email: footerForm.email.trim(),
      subject: footerForm.subject.trim() || null,
      message: footerForm.message.trim(),
    });
    setFooterSubmitting(false);
    if (err) {
      setFooterError(err.message);
      return;
    }
    setFooterSubmitted(true);
    setFooterForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setFooterSubmitted(false), 6000);
  };
  const storeName = getStoreName(settings);

  // Only set fallback title if none has been set yet
  useEffect(() => {
    if (!document.title || document.title === "Store") {
      document.title = storeName;
    }
  }, [storeName]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  return (
    <div className="flex min-h-screen flex-col bg-brand-dark text-white">
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-brand-orange focus:px-4 focus:py-2.5 focus:text-white focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-white font-bold tracking-wider text-sm uppercase"
      >
        Skip to main content
      </a>

      <nav className="sticky top-0 z-50 border-b border-brand-medium/35 bg-brand-dark/95 shadow-md backdrop-blur-sm">
        <div className="relative mx-auto max-w-content px-6 lg:px-12">
          <div className="flex h-16 items-center justify-between">
            {/* LEFT: Logo + Brand */}
            <PrefetchLink
              to="/"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-80 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-lg p-1"
            >
              <Icon name="logo" width={36} height={41} />
              <span className="font-heading text-base font-bold tracking-widest text-brand-light uppercase leading-tight">
                ALL ON DECK
              </span>
            </PrefetchLink>

            {/* RIGHT: Nav links & Icon buttons (desktop) */}
            <div className="hidden lg:flex items-center gap-8">
              {/* Nav links */}
              <div className="flex items-center gap-6 mt-0.5">
                {[
                  { to: "/about", label: "ABOUT US" },
                  { to: "/products", label: "SHOP" },
                  { to: "/services", label: "SERVICES" },
                  { to: "/gallery", label: "GALLERY" },
                  { to: "/designs", label: "DESIGNS" },
                ].map(({ to, label }) => {
                  const isActive =
                    to === "/"
                      ? location.pathname === "/"
                      : location.pathname.startsWith(to);
                  return (
                    <PrefetchLink
                      key={to}
                      to={to}
                      className={`relative inline-flex items-center justify-center min-h-[44px] px-2 text-sm font-semibold tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-lg
                        ${
                          isActive
                            ? "text-white after:absolute after:bottom-1 after:left-2 after:right-2 after:h-0.5 after:bg-brand-orange after:rounded-full"
                            : "text-brand-light hover:text-brand-cream"
                        }`}
                    >
                      {label}
                    </PrefetchLink>
                  );
                })}
              </div>

              {/* Icon buttons */}
              <div className="flex items-center gap-2">
                {/* Cart */}
                <Link
                  to="/cart"
                  className="relative flex items-center justify-center rounded-lg p-2.5 text-brand-orange hover:bg-brand-medium/35 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange min-h-[44px] min-w-[44px]"
                  aria-label={`Cart, ${itemCount} items`}
                >
                  <Icon name="cart" size={24} color="currentColor" />
                  {itemCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-brand-orange px-1 text-[10px] font-bold text-white leading-none ring-2 ring-brand-dark">
                      {itemCount}
                    </span>
                  )}
                </Link>

                {/* Profile */}
                {!authLoading && (
                  <Link
                    to={user ? "/account" : "/login"}
                    className="flex items-center justify-center rounded-lg p-2.5 text-brand-cream hover:bg-brand-medium/35 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange min-h-[44px] min-w-[44px]"
                    aria-label={user ? "My Account" : "Sign in to account"}
                  >
                    <Icon name="profile" size={24} color="currentColor" />
                  </Link>
                )}

                {/* Owner dashboard pill (only when owner) */}
                {!authLoading && user && isOwner && (
                  <Link
                    to="/account/owner"
                    className="ml-1 rounded-full bg-brand-orange/20 border border-brand-orange/40 px-3.5 py-1.5 text-xs font-bold text-brand-orange hover:bg-brand-orange/30 transition-colors tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                  >
                    DASHBOARD
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile / Tablet: right-side icons + hamburger */}
            <div className="flex lg:hidden items-center gap-1">
              <Link
                to="/cart"
                className="relative flex items-center justify-center rounded-lg p-2.5 text-brand-orange hover:bg-brand-medium/35 min-h-[44px] min-w-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                aria-label={`Cart, ${itemCount} items`}
              >
                <Icon name="cart" size={22} color="currentColor" />
                {itemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand-orange px-0.5 text-[9px] font-bold text-white leading-none ring-2 ring-brand-dark">
                    {itemCount}
                  </span>
                )}
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="rounded-lg p-2.5 text-brand-cream hover:bg-brand-medium/35 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                aria-label={
                  menuOpen ? "Close navigation menu" : "Open navigation menu"
                }
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  {menuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile / Tablet dropdown */}
          {menuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 top-16 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setMenuOpen(false)}
                aria-hidden="true"
              />
              <div
                id="mobile-nav"
                className="absolute left-0 right-0 top-full z-50 border-b border-brand-medium/30 bg-brand-dark py-3 shadow-2xl lg:hidden"
              >
                <div className="mx-auto max-w-7xl space-y-1 px-4 sm:px-6 lg:px-8">
                  {[
                    { to: "/about", label: "ABOUT US" },
                    { to: "/products", label: "SHOP" },
                    { to: "/services", label: "SERVICES" },
                    { to: "/gallery", label: "GALLERY" },
                    { to: "/designs", label: "DESIGNS" },
                  ].map(({ to, label }) => {
                    const isActive =
                      to === "/"
                        ? location.pathname === "/"
                        : location.pathname.startsWith(to);
                    return (
                      <PrefetchLink
                        key={to}
                        to={to}
                        onClick={() => setMenuOpen(false)}
                        className={`flex min-h-[48px] w-full items-center rounded-xl px-4 py-3 text-sm font-semibold tracking-wider transition-colors
                          ${
                            isActive
                              ? "bg-brand-medium/40 text-white border-l-4 border-brand-orange"
                              : "text-brand-cream/80 hover:bg-brand-medium/25 hover:text-white"
                          }`}
                      >
                        {label}
                      </PrefetchLink>
                    );
                  })}

                  <div className="my-2 border-t border-brand-medium/30" />

                  {!authLoading && (
                    <Link
                      to={user ? "/account" : "/login"}
                      onClick={() => setMenuOpen(false)}
                      className="flex min-h-[48px] w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-brand-cream/80 hover:bg-brand-medium/25 hover:text-white transition-colors"
                    >
                      <Icon name="profile" size={20} color="currentColor" />
                      {user ? "Account" : "Sign in"}
                    </Link>
                  )}
                  {!authLoading && user && isOwner && (
                    <Link
                      to="/account/owner"
                      onClick={() => setMenuOpen(false)}
                      className="flex min-h-[48px] w-full items-center rounded-xl px-4 py-3 text-sm font-bold text-brand-orange hover:bg-brand-orange/10 transition-colors tracking-wider"
                    >
                      DASHBOARD
                    </Link>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </nav>

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 w-full outline-none"
      >
        {children}
      </main>

      <div className="h-8 w-full bg-brand-cream" />
      <footer id="site-footer" className="mt-auto overflow-hidden font-sans">
        <div className="grid grid-cols-1 md:grid-cols-3 w-full">
          {/* Column 1: CONTACT US */}
          <div className="bg-brand-dark p-12 flex flex-col justify-start items-center text-center text-white">
            <h3 className="font-heading text-4xl font-black text-brand-cream tracking-widest leading-tight">
              CONTACT
              <br />
              US
            </h3>
            <svg
              className="w-16 h-3 text-brand-orange mt-3 mx-auto"
              viewBox="0 0 100 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.2"
            >
              <path d="M0,2 Q5,-2 10,2 T20,2 T30,2 T40,2 T50,2 T60,2 T70,2 T80,2 T90,2 T100,2" />
              <path d="M0,10 Q5,6 10,10 T20,10 T30,10 T40,10 T50,10 T60,10 T70,10 T80,10 T90,10 T100,10" />
            </svg>

            <div className="mt-8 space-y-1.5 md:space-y-6 flex flex-col items-center md:items-start w-full">
              <div className="flex items-center gap-4 text-left">
                <div className="shrink-0 flex items-center justify-center">
                  <svg
                    className="w-10 h-10"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    {/* Orange speech bubble background with bottom-left pointer */}
                    <path
                      fill="#e98e2e"
                      d="M12 2C6.48 2 2 6.48 2 12c0 2.17.69 4.19 1.87 5.84L2.5 21.5l3.82-1.33C7.91 21.28 9.89 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"
                    />
                    {/* Brand navy phone handset inside the bubble */}
                    <path
                      fill="#044155"
                      d="M16.27 14.12c-.25-.13-1.46-.72-1.68-.8-.22-.09-.39-.13-.55.13-.16.26-.63.8-.78.97-.15.16-.29.18-.55.05-.26-.13-1.09-.4-2.07-1.28-.77-.69-1.29-1.53-1.44-1.79-.15-.26-.02-.4.11-.53.12-.12.26-.29.39-.44.13-.15.17-.26.26-.43.09-.16.04-.31-.02-.44s-.55-1.33-.75-1.82c-.2-.47-.4-.41-.55-.42-.14-.01-.3-.01-.46-.01-.16 0-.43.06-.65.31-.22.25-.86.86-.86 2.08s.89 2.41 1.01 2.57c.13.16 1.76 2.68 4.26 3.76.6.26 1.06.41 1.42.52.6.19 1.15.16 1.58.1.48-.07 1.46-.6 1.66-1.17.21-.57.21-1.07.15-1.17-.06-.1-.22-.16-.48-.29z"
                    />
                  </svg>
                </div>
                <div className="font-sans text-base font-normal text-white space-y-1 flex flex-col">
                  <a
                    href="tel:7865758870"
                    className="hover:text-brand-orange transition-colors"
                  >
                    (786) 575 8870
                  </a>
                  <a
                    href="tel:7865708343"
                    className="hover:text-brand-orange transition-colors"
                  >
                    (786) 570 8343
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 text-left">
                <div className="text-brand-orange shrink-0">
                  <svg
                    className="w-10 h-10"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </div>
                <a
                  href="mailto:allondeckadm@gmail.com"
                  className="font-sans text-base text-white hover:text-brand-orange transition-colors"
                >
                  allondeckadm@gmail.com
                </a>
              </div>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-6 pt-4 text-left">
              <a
                href="https://www.facebook.com/all.on.deck.2023?mibextid=LQQJ4d"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-cream hover:text-brand-orange transition-colors"
                aria-label="Facebook"
              >
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/all_ondeck?igsh=dHM0Y2J4ZnJqMWd3&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-cream hover:text-brand-orange transition-colors"
                aria-label="Instagram"
              >
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: VISIT US */}
          <div className="bg-brand-medium p-12 flex flex-col justify-start items-center text-center text-white">
            <h3 className="font-heading text-4xl font-black text-brand-cream tracking-widest leading-tight">
              VISIT
              <br />
              US
            </h3>
            <svg
              className="w-16 h-3 text-brand-orange mt-3 mx-auto"
              viewBox="0 0 100 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.2"
            >
              <path d="M0,2 Q5,-2 10,2 T20,2 T30,2 T40,2 T50,2 T60,2 T70,2 T80,2 T90,2 T100,2" />
              <path d="M0,10 Q5,6 10,10 T20,10 T30,10 T40,10 T50,10 T60,10 T70,10 T80,10 T90,10 T100,10" />
            </svg>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-sm mx-auto items-start">
              {/* Miami Location */}
              <div className="flex flex-col items-center text-center group">
                <a
                  href="https://maps.google.com/?q=Miami,+FL"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center group-hover:text-brand-orange transition-colors"
                >
                  <div className="text-brand-orange shrink-0 mb-2 transition-transform group-hover:scale-110">
                    <svg
                      className="w-10 h-10"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                  <h4 className="font-sans text-base sm:text-lg font-bold tracking-wide text-brand-cream group-hover:text-brand-orange transition-colors">
                    Miami, Fl
                  </h4>
                </a>
              </div>

              {/* Orlando Location */}
              <div className="flex flex-col items-center text-center group">
                <a
                  href="https://maps.google.com/?q=Orlando,+FL"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center group-hover:text-brand-orange transition-colors"
                >
                  <div className="text-brand-orange shrink-0 mb-2 transition-transform group-hover:scale-110">
                    <svg
                      className="w-10 h-10"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                  <h4 className="font-sans text-base sm:text-lg font-bold tracking-wide text-brand-cream group-hover:text-brand-orange transition-colors">
                    Orlando, Fl
                  </h4>
                </a>
              </div>

              {/* New Jersey Location */}
              <div className="col-span-2 flex flex-col items-center text-center group pt-2 sm:pt-4">
                <a
                  href="https://maps.google.com/?q=New+Jersey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center group-hover:text-brand-orange transition-colors"
                >
                  <div className="text-brand-orange shrink-0 mb-2 transition-transform group-hover:scale-110">
                    <svg
                      className="w-10 h-10"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                  <h4 className="font-sans text-base sm:text-lg font-bold tracking-wide text-brand-cream group-hover:text-brand-orange transition-colors">
                    New Jersey
                  </h4>
                </a>
              </div>
            </div>
          </div>

          {/* Column 3: TELL US */}
          <div className="bg-brand-light p-12 flex flex-col justify-start items-center text-center text-white">
            <h3 className="font-heading text-4xl font-black text-brand-cream tracking-widest leading-tight">
              TALK
              <br />
              TO US
            </h3>
            <svg
              className="w-16 h-3 text-brand-orange mt-3 mx-auto"
              viewBox="0 0 100 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.2"
            >
              <path d="M0,2 Q5,-2 10,2 T20,2 T30,2 T40,2 T50,2 T60,2 T70,2 T80,2 T90,2 T100,2" />
              <path d="M0,10 Q5,6 10,10 T20,10 T30,10 T40,10 T50,10 T60,10 T70,10 T80,10 T90,10 T100,10" />
            </svg>

            {footerSubmitted ? (
              <div className="mt-8 w-full py-6 text-center font-heading text-lg font-black text-brand-dark tracking-widest">
                THANKS FOR YOUR MESSAGE
              </div>
            ) : (
              <form onSubmit={handleFooterSubmit} className="mt-6 w-full">
                {footerError && (
                  <div className="mb-3 rounded-lg bg-red-900/60 px-3 py-2 text-xs text-red-200">
                    {footerError}
                  </div>
                )}
                <div className="border-4 border-brand-dark bg-[#055b6d] rounded-2xl p-4 grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      required
                      placeholder="Name"
                      aria-label="Your Name"
                      value={footerForm.name}
                      onChange={(e) =>
                        setFooterForm({ ...footerForm, name: e.target.value })
                      }
                      className="bg-brand-dark text-white placeholder-white/70 px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange font-sans min-h-[42px]"
                    />
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      inputMode="email"
                      required
                      placeholder="Email"
                      aria-label="Email address"
                      value={footerForm.email}
                      onChange={(e) =>
                        setFooterForm({ ...footerForm, email: e.target.value })
                      }
                      className="bg-brand-dark text-white placeholder-white/70 px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange font-sans min-h-[42px]"
                    />
                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject (optional)"
                      aria-label="Subject"
                      value={footerForm.subject}
                      onChange={(e) =>
                        setFooterForm({
                          ...footerForm,
                          subject: e.target.value,
                        })
                      }
                      className="bg-brand-dark text-white placeholder-white/70 px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange font-sans min-h-[42px]"
                    />
                  </div>
                  <div className="flex flex-col justify-between gap-2">
                    <textarea
                      name="message"
                      required
                      placeholder="Message..."
                      aria-label="Message"
                      rows={3}
                      value={footerForm.message}
                      onChange={(e) =>
                        setFooterForm({
                          ...footerForm,
                          message: e.target.value,
                        })
                      }
                      className="flex-1 bg-brand-dark text-white placeholder-white/70 p-3 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none font-sans min-h-[80px]"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={footerSubmitting}
                        className="bg-brand-orange hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-lg transition-transform hover:scale-105 disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white min-h-[40px]"
                      >
                        {footerSubmitting ? "SENDING…" : "SEND"}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
