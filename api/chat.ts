import { streamText, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";
import { createClient } from "@supabase/supabase-js";

export const config = {
  runtime: "edge",
};

// ─── Supabase (anon key — only reads public data) ────────────────────────────
// On Vercel, use SUPABASE_URL / SUPABASE_ANON_KEY (server-safe, no VITE_ prefix needed)
// Falls back to VITE_ prefixed names so local .env works without duplication
const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY ?? "";

// ─── Types ───────────────────────────────────────────────────────────────────
type SettingRow = { key: string; value: unknown };
type ProductRow = {
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  stock_quantity: number;
  is_published: boolean;
};
type CategoryRow = { name: string; description: string | null };

// ─── Helpers ─────────────────────────────────────────────────────────────────
function parseStr(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v.replace(/^"|"$/g, "").trim();
  return "";
}

function fmt(price: number): string {
  return `$${price.toFixed(2)}`;
}

// ─── Build store-aware system prompt ─────────────────────────────────────────
async function buildSystemPrompt(): Promise<string> {
  // Fail gracefully — if Supabase creds missing, fall back to generic prompt
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return FALLBACK_PROMPT;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Fetch in parallel
  const [settingsRes, productsRes, categoriesRes] = await Promise.all([
    supabase.from("store_settings").select("key, value"),
    supabase
      .from("products")
      .select(
        "name, slug, description, price, compare_at_price, stock_quantity, is_published",
      )
      .eq("is_published", true)
      .order("is_featured", { ascending: false })
      .limit(30), // Reduced limit to speed up DB query
    supabase
      .from("categories")
      .select("name, description")
      .eq("is_visible", true),
  ]);

  // Parse settings into a map
  const settings: Record<string, string> = {};
  for (const row of (settingsRes.data ?? []) as SettingRow[]) {
    settings[row.key] = parseStr(row.value);
  }

  const storeName = settings.store_name || "this store";
  const storeType = settings.store_type || "general";
  const estimatedDelivery = settings.estimated_delivery || "varies by location";
  const shippingCountriesRaw = settings.shipping_countries;
  let shippingCountries = "not specified";
  if (shippingCountriesRaw) {
    try {
      const parsed: unknown = JSON.parse(shippingCountriesRaw);
      if (Array.isArray(parsed) && parsed.length > 0)
        shippingCountries = (parsed as string[]).join(", ");
    } catch {
      shippingCountries = shippingCountriesRaw;
    }
  }

  // Build product catalog section
  const products = (productsRes.data ?? []) as ProductRow[];
  let productSection = "";
  if (products.length > 0) {
    const lines = products.map((p) => {
      const price =
        p.compare_at_price && p.compare_at_price > p.price
          ? `${fmt(p.price)} (was ${fmt(p.compare_at_price)})`
          : fmt(p.price);
      const stock =
        p.stock_quantity <= 0 ? "out of stock" : `${p.stock_quantity} in stock`;
      const desc = p.description ? ` — ${p.description.slice(0, 120)}` : "";
      return `- ${p.name}: ${price}, ${stock}${desc} (slug: ${p.slug})`;
    });
    productSection = `\n\nCURRENT PRODUCT CATALOG (${products.length} items):\n${lines.join("\n")}`;
  } else {
    productSection = "\n\nCURRENT PRODUCT CATALOG: No products are listed yet.";
  }

  // Build categories section
  const categories = (categoriesRes.data ?? []) as CategoryRow[];
  let categorySection = "";
  if (categories.length > 0) {
    const lines = categories.map((c) =>
      c.description ? `- ${c.name}: ${c.description}` : `- ${c.name}`,
    );
    categorySection = `\n\nPRODUCT CATEGORIES:\n${lines.join("\n")}`;
  }

  const aiInstructions = settings.ai_instructions;
  let customInstructionsSection = "";
  if (aiInstructions) {
    customInstructionsSection = `\n\nCUSTOM STORE INSTRUCTIONS (HIGH PRIORITY):\n${aiInstructions}`;
  }

  return `You are the AI assistant for "All On Deck Home Services" — a premium marine deck fabrication company based in Florida.

YOUR ROLE:
- Help customers learn about All On Deck's services, products, custom deck designs, and ordering process.
- Answer questions about the company, team, materials, colors, and patterns.
- Guide users through the website: services, getting an estimate, browsing designs, shopping, and contacting the team.
- Stay strictly on-topic: only discuss topics relevant to All On Deck and marine deck fabrication.
- If asked something unrelated (e.g. politics, coding, general trivia), politely decline: "I'm here to help you with your All On Deck experience!"
- Be warm, professional, and concise.

COMPANY OVERVIEW:
- Company name: All On Deck Home Services
- Industry: Marine deck flooring and fabrication
- Location: Florida, USA
- Specialties: Custom deck designs, marine floor manufacturing, precision cutting and installation
- Mission: To set the standard in marine deck fabrication by combining state-of-the-art CAD modeling with hands-on nautical engineering expertise.
- Tagline: "Your trusted partner in marine deck flooring solutions."

SERVICES (link to [Services](/services)):
- Custom Deck Designs: Fully custom marine deck designs tailored to any boat.
- Floor Manufacturing: Premium marine-grade floor fabrication using EVA foam, synthetic teak, and composite decking.
- Cutting and Installation: Precision CAD-guided cutting and professional installation.
- Free Estimate: Every customer can get a free estimate — link them to [Get Free Estimate](/estimate).
- Custom Design at No Additional Cost: Custom design consultation is included with every order.

DESIGNS & MATERIALS (link to [Designs](/designs)):
- Patterns: Traditional teak strips, carbon-fiber textures, and more.
- Colors: A full palette of UV-stable, salt-resistant marine-grade pigments. Can match RAL or Pantone codes.
- Materials: EVA foam, synthetic teak, and composite decking engineered for durability, comfort, and style.

OUR TEAM:
- Ernesto Alvarez — President. A strategist with a vision for nautical innovation. Leads the expansion of All On Deck, combining cutting-edge materials with the highest standards of safety and comfort at sea.
- Roselena Oropesa — Vice President. Responsible for process optimization and technical precision. Oversees digital measurement and CAD design, ensuring millimeter-precise, high-end finishes.
(Link users to [Meet the Team](/about) to learn more.)

STORE & PRODUCTS (link to [Shop](/products)):
- ${storeName} also sells merchandise and boating accessories online.
- Estimated delivery: ${estimatedDelivery}
- Ships to: ${shippingCountries}

NAVIGATION LINKS (use these when directing users):
- Home: [Home](/)
- Services: [Services](/services)
- Designs & Gallery: [Designs](/designs)
- Shop / Products: [Shop](/products)
- About & Team: [About](/about)
- Get an Estimate: [Free Estimate](/estimate)
- Contact: [Contact Us](/contact)
- Track Order: [Look Up Order](/lookup-order)
- Account: [My Account](/account)
${productSection}${categorySection}

POLICIES & SUPPORT:
- Returns: Customers should reach out to the team. Link: [Contact Us](/contact)
- Shipping: We ship to ${shippingCountries}. Estimated delivery is ${estimatedDelivery}.
- Payments: Standard online payment methods accepted at checkout.
- Order tracking: [Look Up Order](/lookup-order)

FORMATTING RULES:
1. When recommending a product, mention the price and ALWAYS include a markdown link: [Product Name](/products/slug).
2. When directing users to any page, ALWAYS use a markdown link.
3. Do not invent products, prices, or policies not listed above.
4. Keep responses warm, helpful, and concise (1–3 paragraphs max unless asked for more detail).
5. If asked something unrelated to All On Deck or marine decking, politely redirect.${customInstructionsSection}`;

}

const FALLBACK_PROMPT = `You are a helpful shopping assistant. Help customers with product questions, orders, and shopping. Stay on topic — only discuss shopping-related queries. If asked something unrelated, politely redirect.`;

// ─── Handler ─────────────────────────────────────────────────────────────────
export default async function POST(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as { messages?: unknown };
    const messages = body?.messages;

    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "messages must be an array" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const systemPrompt = await buildSystemPrompt();

    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("[chat] error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
