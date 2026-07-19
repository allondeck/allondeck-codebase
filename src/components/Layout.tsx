import { useEffect, useState } from "react";
import { Link, useLocation, matchRoutes, LinkProps } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useStoreSettings } from "../hooks/useStoreSettings";
import { Icon } from "./Icon";
import { supabase } from "../lib/supabase";
import { router } from "../App";

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
  const [footerForm, setFooterForm] = useState({ name: "", email: "", subject: "", message: "" });
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


  useEffect(() => {
    document.title = storeName;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", `${storeName} – Online store`);
    else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = `${storeName} – Online store`;
      document.head.appendChild(meta);
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", storeName);
    else {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:title");
      meta.content = storeName;
      document.head.appendChild(meta);
    }
  }, [storeName]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-[#044155] text-white">
      <nav className="sticky top-0 z-50 border-b border-[#066175]/35 bg-[#044155]/95 shadow-md backdrop-blur-sm">
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="flex h-16 items-center justify-between">

            {/* LEFT: Logo + Brand */}
            <PrefetchLink
              to="/"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-80 shrink-0"
            >
              <Icon name="logo" width={36} height={41} />
              <span className="font-heading text-base font-bold tracking-widest text-[#76abbf] uppercase leading-tight">
                ALL ON DECK
              </span>
            </PrefetchLink>

            {/* RIGHT: Nav links & Icon buttons (desktop) */}
            <div className="hidden md:flex items-center gap-8">
              {/* Nav links */}
              <div className="flex items-center gap-6">
                {[
                  { to: "/about", label: "ABOUT US" },
                  { to: "/products", label: "SHOP" },
                  { to: "/services", label: "SERVICES" },
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
                      className={`relative text-sm font-semibold tracking-wider transition-colors pb-1
                        ${isActive
                          ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#e38622] after:rounded-full"
                          : "text-[#76abbf] hover:text-[#f6ebd4]"
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
                  className="relative flex items-center justify-center rounded-lg p-2 text-[#f6ebd4] hover:bg-[#066175]/35 transition-colors"
                  aria-label="Cart"
                >
                  <Icon name="cart" size={24} color="currentColor" />
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-[#e38622] px-1 text-[10px] font-bold text-white leading-none">
                      {itemCount}
                    </span>
                  )}
                </Link>

                {/* Profile */}
                {!authLoading && (
                  <Link
                    to={user ? "/account" : "/login"}
                    className="flex items-center justify-center rounded-lg p-2 text-[#f6ebd4] hover:bg-[#066175]/35 transition-colors"
                    aria-label={user ? "Account" : "Sign in"}
                  >
                    <Icon name="profile" size={24} color="currentColor" />
                  </Link>
                )}

                {/* Owner dashboard pill (only when owner) */}
                {!authLoading && user && isOwner && (
                  <Link
                    to="/account/owner"
                    className="ml-1 rounded-full bg-[#e38622]/20 border border-[#e38622]/40 px-3 py-1 text-xs font-bold text-[#e38622] hover:bg-[#e38622]/30 transition-colors tracking-wider"
                  >
                    DASHBOARD
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile: right-side icons + hamburger */}
            <div className="flex md:hidden items-center gap-1">
              <Link
                to="/cart"
                className="relative flex items-center justify-center rounded-lg p-2 text-[#f6ebd4] hover:bg-[#066175]/35"
                aria-label="Cart"
              >
                <Icon name="cart" size={20} color="currentColor" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#e38622] px-0.5 text-[9px] font-bold text-white leading-none">
                    {itemCount}
                  </span>
                )}
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="rounded-lg p-2 text-[#f6ebd4] hover:bg-[#066175]/35"
                aria-label="Menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          {menuOpen && (
            <div
              id="mobile-nav"
              className="absolute left-0 right-0 top-full z-50 border-b border-[#066175]/30 bg-[#044155] py-3 shadow-lg md:hidden"
            >
              <div className="mx-auto max-w-7xl space-y-0.5 px-4 sm:px-6 lg:px-8">
                {[
                  { to: "/about", label: "ABOUT US" },
                  { to: "/products", label: "SHOP" },
                  { to: "/services", label: "SERVICES" },
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
                      className={`flex min-h-[44px] w-full items-center rounded-lg px-4 py-3 text-sm font-semibold tracking-wider transition-colors
                        ${isActive
                          ? "bg-[#066175]/40 text-white border-l-4 border-[#e38622]"
                          : "text-[#f6ebd4]/80 hover:bg-[#066175]/25 hover:text-white"
                        }`}
                    >
                      {label}
                    </PrefetchLink>
                  );
                })}

                <div className="my-2 border-t border-[#066175]/30" />

                {!authLoading && (
                  <Link
                    to={user ? "/account" : "/login"}
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-[44px] w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-[#f6ebd4]/80 hover:bg-[#066175]/25 hover:text-white transition-colors"
                  >
                    <Icon name="profile" size={20} color="currentColor" />
                    {user ? "Account" : "Sign in"}
                  </Link>
                )}
                {!authLoading && user && isOwner && (
                  <Link
                    to="/account/owner"
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-[44px] w-full items-center rounded-lg px-4 py-3 text-sm font-bold text-[#e38622] hover:bg-[#e38622]/10 transition-colors tracking-wider"
                  >
                    DASHBOARD
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="flex-1 w-full">
        {children}
      </main>

      <div className="h-8 w-full bg-[#f6ebd4]" />
      <footer className="mt-auto overflow-hidden font-sans">
        <div className="grid grid-cols-1 md:grid-cols-3 w-full">
          {/* Column 1: CONTACT US */}
          <div className="bg-[#044155] p-12 flex flex-col justify-start items-center text-center text-white">
            <h3 className="font-heading text-4xl font-black text-[#f6ebd4] tracking-widest leading-tight">
              CONTACT<br />US
            </h3>
            <svg className="w-16 h-3 text-[#e38622] mt-3 mx-auto" viewBox="0 0 100 12" fill="none" stroke="currentColor" strokeWidth="3.2">
              <path d="M0,2 Q5,-2 10,2 T20,2 T30,2 T40,2 T50,2 T60,2 T70,2 T80,2 T90,2 T100,2" />
              <path d="M0,10 Q5,6 10,10 T20,10 T30,10 T40,10 T50,10 T60,10 T70,10 T80,10 T90,10 T100,10" />
            </svg>

            <div className="mt-8 space-y-1.5 md:space-y-6 flex flex-col items-center md:items-start w-full">
              <div className="flex items-center gap-4 text-left">
                <div className="text-[#e38622] shrink-0">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 2.17.7 4.19 1.89 5.83L2.2 21.8l4.13-1.09C7.88 21.36 9.87 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm3.84 12.56c-.22.62-1.28 1.14-1.76 1.22-.42.07-.84.12-2.45-.55-2.06-.85-3.39-2.95-3.49-3.09-.1-.14-.83-1.1-1-2.1-.17-1-.03-1.48.16-1.68.19-.2.41-.25.55-.25s.28 0 .4.01c.13 0 .3.01.47.4.2.47.67 1.62.73 1.74.06.12.09.26.02.4-.07.14-.11.23-.21.35-.11.12-.22.28-.32.38-.11.11-.22.23-.09.45.12.21.55.9 1.18 1.47.81.72 1.49.94 1.7.94s.38-.02.51-.17c.13-.14.55-.64.69-.85.15-.22.3-.18.5-.1.2.08 1.28.6 1.5.71s.37.16.42.25c.06.09.06.54-.16 1.16z" />
                  </svg>
                </div>
                <div className="font-sans text-base font-semibold text-white space-y-1 flex flex-col">
                  <a href="tel:7865758870" className="hover:text-[#e38622] transition-colors">
                    (786) 575 8870
                  </a>
                  <a href="tel:7865708343" className="hover:text-[#e38622] transition-colors">
                    (786) 570 8343
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 text-left">
                <div className="text-[#e38622] shrink-0">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </div>
                <a href="mailto:allondeckadm@gmail.com" className="font-sans text-base font-semibold text-white hover:text-[#e38622] transition-colors">
                  allondeckadm@gmail.com
                </a>
              </div>
              </div>

              {/* Socials */}
              <div className="flex items-center gap-6 pt-4 text-left">
                <a href="https://www.facebook.com/all.on.deck.2023?mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer" className="text-[#f6ebd4] hover:text-[#e38622] transition-colors" aria-label="Facebook">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/all_ondeck?igsh=dHM0Y2J4ZnJqMWd3&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-[#f6ebd4] hover:text-[#e38622] transition-colors" aria-label="Instagram">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.555.556.9 1.11 1.152 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428-.254.66-.598 1.216-1.153 1.772-.556.555-1.11.9-1.772 1.152-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465-.66-.254-1.216-.598-1.772-1.153-.555-.556-.9-1.11-1.152-1.772-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428.254-.66.598-1.216 1.153-1.772.556-.555 1.11-.9 1.772-1.152.637-.248 1.363-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.987.01-4.042.059-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.055-.058 1.37-.058 4.041s.01 2.986.058 4.04c.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.04.058 2.67 0 2.986-.01 4.04-.058.975-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041s-.01-2.986-.058-4.04c-.045-.975-.207-1.504-.344-1.857-.182-.466-.399-.8-.748-1.15-.35-.35-.683-.566-1.15-.748-.353-.137-.882-.3-1.857-.344-1.055-.048-1.37-.058-4.04-.058zM12 6.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm5.338-9.87a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z"/>
                  </svg>
              </a>
            </div>
          </div>

          {/* Column 2: VISIT US */}
          <div className="bg-[#066175] p-12 flex flex-col justify-start items-center text-center text-white">
            <h3 className="font-heading text-4xl font-black text-[#f6ebd4] tracking-widest leading-tight">
              VISIT<br />US
            </h3>
            <svg className="w-16 h-3 text-[#e38622] mt-3 mx-auto" viewBox="0 0 100 12" fill="none" stroke="currentColor" strokeWidth="3.2">
              <path d="M0,2 Q5,-2 10,2 T20,2 T30,2 T40,2 T50,2 T60,2 T70,2 T80,2 T90,2 T100,2" />
              <path d="M0,10 Q5,6 10,10 T20,10 T30,10 T40,10 T50,10 T60,10 T70,10 T80,10 T90,10 T100,10" />
            </svg>

            <div className="mt-8 space-y-1.5 md:space-y-6 w-full max-w-xs flex flex-col items-center md:items-start">
              <div className="flex items-center gap-4 text-left">
                <div className="text-[#e38622] shrink-0">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-black tracking-wider text-[#f6ebd4]">
                    <a href="https://maps.google.com/?q=Miami,+FL" target="_blank" rel="noopener noreferrer" className="hover:text-[#e38622] transition-colors">
                      Miami, FL
                    </a>
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-4 text-left">
                <div className="text-[#e38622] shrink-0">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-black tracking-wider text-[#f6ebd4]">
                    <a href="https://maps.google.com/?q=Orlando,+FL" target="_blank" rel="noopener noreferrer" className="hover:text-[#e38622] transition-colors">
                      Orlando, FL
                    </a>
                  </h4>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: TELL US */}
          <div className="bg-[#76abbf] p-12 flex flex-col justify-start items-center text-center text-white">
            <h3 className="font-heading text-4xl font-black text-[#f6ebd4] tracking-widest leading-tight">
              TALK<br />TO US
            </h3>
            <svg className="w-16 h-3 text-[#e38622] mt-3 mx-auto" viewBox="0 0 100 12" fill="none" stroke="currentColor" strokeWidth="3.2">
              <path d="M0,2 Q5,-2 10,2 T20,2 T30,2 T40,2 T50,2 T60,2 T70,2 T80,2 T90,2 T100,2" />
              <path d="M0,10 Q5,6 10,10 T20,10 T30,10 T40,10 T50,10 T60,10 T70,10 T80,10 T90,10 T100,10" />
            </svg>

            {footerSubmitted ? (
              <div className="mt-8 w-full py-6 text-center font-heading text-lg font-black text-[#044155] tracking-widest">
                THANKS FOR YOUR MESSAGE
              </div>
            ) : (
              <form onSubmit={handleFooterSubmit} className="mt-6 w-full">
                {footerError && (
                  <div className="mb-3 rounded-lg bg-red-900/60 px-3 py-2 text-xs text-red-200">
                    {footerError}
                  </div>
                )}
                <div className="border-4 border-[#044155] bg-[#055b6d] rounded-2xl p-4 grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Name"
                      value={footerForm.name}
                      onChange={(e) => setFooterForm({ ...footerForm, name: e.target.value })}
                      className="bg-[#044155] text-white placeholder-brand-cream/40 px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-[#e38622] font-sans"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email"
                      value={footerForm.email}
                      onChange={(e) => setFooterForm({ ...footerForm, email: e.target.value })}
                      className="bg-[#044155] text-white placeholder-brand-cream/40 px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-[#e38622] font-sans"
                    />
                    <input
                      type="text"
                      placeholder="Subject (optional)"
                      value={footerForm.subject}
                      onChange={(e) => setFooterForm({ ...footerForm, subject: e.target.value })}
                      className="bg-[#044155] text-white placeholder-brand-cream/40 px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-[#e38622] font-sans"
                    />
                  </div>
                  <div className="flex flex-col justify-between gap-2">
                    <textarea
                      required
                      placeholder="Message..."
                      rows={3}
                      value={footerForm.message}
                      onChange={(e) => setFooterForm({ ...footerForm, message: e.target.value })}
                      className="flex-1 bg-[#044155] text-white placeholder-brand-cream/40 p-3 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-[#e38622] resize-none font-sans"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={footerSubmitting}
                        className="bg-[#e38622] hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider px-6 py-2 rounded-lg transition-transform hover:scale-105 disabled:opacity-70"
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
