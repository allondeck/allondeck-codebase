export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
};
export type CategoryInsert = Partial<CategoryRow>;
export type CategoryUpdate = Partial<CategoryRow>;

export type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  sku: string | null;
  stock_quantity: number;
  low_stock_threshold: number | null;
  is_published: boolean;
  is_featured: boolean;
  image_url: string | null;
  category_id: string | null;
  created_at: string;
  updated_at: string;
};
export type ProductInsert = Partial<ProductRow>;
export type ProductUpdate = Partial<ProductRow>;

export type ProductWithCategory = ProductRow & {
  categories?: CategoryRow | null;
};

export type ProductWithCategories = ProductRow & {
  product_categories?: { categories: CategoryRow | null }[];
};

export type CouponScope = "all" | "featured" | "categories" | "products";

export type CouponRow = {
  id: string;
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  scope: CouponScope;
  scope_ids: string[];
  starts_at: string | null;
  ends_at: string | null;
  usage_limit: number | null;
  usage_count: number;
  created_at: string;
  updated_at: string;
};
export type CouponInsert = Partial<CouponRow>;
export type CouponUpdate = Partial<CouponRow>;

export type OrderRow = {
  id: string;
  user_id: string | null;
  guest_email: string | null;
  customer_email: string | null;
  status: string;
  total: number | string;
  subtotal: number | string;
  shipping_total: number | string;
  tax_total: number | string;
  discount_amount: number | string | null;
  coupon_id: string | null;
  shipping_address: Json;
  billing_address: Json;
  tracking_number: string | null;
  carrier: string | null;
  created_at: string;
  updated_at: string;
};
export type OrderInsert = Partial<OrderRow>;
export type OrderUpdate = Partial<OrderRow>;

export type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_price: number | string;
  deal_id: string | null;
  quantity: number;
  created_at: string;
};
export type OrderItemInsert = Partial<OrderItemRow>;
export type OrderItemUpdate = Partial<OrderItemRow>;

export type HomepageSectionRow = {
  id: string;
  type:
    | "hero"
    | "featured_products"
    | "category_products"
    | "banner"
    | "recently_viewed"
    | "feature"
    | "content_banner"
    | "text"
    | "image_text"
    | "values"
    | "cta";
  title: string | null;
  config: Record<string, unknown>;
  sort_order: number;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
};
export type HomepageSectionInsert = Partial<HomepageSectionRow>;
export type HomepageSectionUpdate = Partial<HomepageSectionRow>;

export type AboutSectionType =
  | "content_banner"
  | "text"
  | "image_text"
  | "values"
  | "cta"
  | "feature"
  | "hero"
  | "featured_products"
  | "category_products"
  | "banner"
  | "recently_viewed";

export type AboutSectionRow = {
  id: string;
  type: AboutSectionType;
  title: string | null;
  content: string | null;
  image_url: string | null;
  config: Record<string, unknown>;
  sort_order: number;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
};
export type AboutSectionInsert = Partial<AboutSectionRow>;
export type AboutSectionUpdate = Partial<AboutSectionRow>;

export type ReviewRow = {
  id: string;
  product_id: string;
  user_id: string | null;
  rating: number;
  body: string | null;
  hidden: boolean;
  created_at: string;
  reviewer_email: string | null;
};
export type ReviewInsert = Partial<ReviewRow>;
export type ReviewUpdate = Partial<ReviewRow>;

export type ContactRequestRow = {
  id: string;
  name: string;
  email: string;
  message: string;
  phone: string | null;
  subject: string | null;
  notes: string | null;
  created_at: string;
};
export type ContactRequestInsert = Partial<ContactRequestRow>;
export type ContactRequestUpdate = Partial<ContactRequestRow>;

export type DealRow = {
  id: string;
  name: string;
  total_price: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
};
export type DealInsert = Partial<DealRow>;
export type DealUpdate = Partial<DealRow>;

export type DealItemRow = {
  id: string;
  deal_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
};
export type DealItemInsert = Partial<DealItemRow>;
export type DealItemUpdate = Partial<DealItemRow>;

export type ProductCategoryRow = {
  product_id: string;
  category_id: string;
  created_at: string;
};
export type ProductCategoryInsert = Partial<ProductCategoryRow>;

export type Database = {
  public: {
    Tables: {
      about_sections: {
        Row: AboutSectionRow;
        Insert: AboutSectionInsert;
        Update: AboutSectionUpdate;
        Relationships: [];
      };
      categories: {
        Row: CategoryRow;
        Insert: CategoryInsert;
        Update: CategoryUpdate;
        Relationships: [];
      };
      coupons: {
        Row: CouponRow;
        Insert: CouponInsert;
        Update: CouponUpdate;
        Relationships: [];
      };
      homepage_sections: {
        Row: HomepageSectionRow;
        Insert: HomepageSectionInsert;
        Update: HomepageSectionUpdate;
        Relationships: [];
      };
      products: {
        Row: ProductRow;
        Insert: ProductInsert;
        Update: ProductUpdate;
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<{
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          role: string;
          created_at: string;
          updated_at: string;
        }>;
        Update: Partial<{
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          role: string;
          created_at: string;
          updated_at: string;
        }>;
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      store_settings: {
        Row: { id: string; key: string; value: Json; updated_at: string };
        Insert: Partial<{
          id: string;
          key: string;
          value: Json;
          updated_at: string;
        }>;
        Update: Partial<{
          id: string;
          key: string;
          value: Json;
          updated_at: string;
        }>;
        Relationships: [];
      };
      orders: {
        Row: OrderRow;
        Insert: OrderInsert;
        Update: OrderUpdate;
        Relationships: [
          {
            foreignKeyName: "orders_coupon_id_fkey";
            columns: ["coupon_id"];
            referencedRelation: "coupons";
            referencedColumns: ["id"];
          },
        ];
      };
      order_items: {
        Row: OrderItemRow;
        Insert: OrderItemInsert;
        Update: OrderItemUpdate;
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      contact_requests: {
        Row: ContactRequestRow;
        Insert: ContactRequestInsert;
        Update: ContactRequestUpdate;
        Relationships: [];
      };
      customer_notes: {
        Row: {
          customer_key: string;
          note: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<{
          customer_key: string;
          note: string;
          created_at: string;
          updated_at: string;
        }>;
        Update: Partial<{
          customer_key: string;
          note: string;
          created_at: string;
          updated_at: string;
        }>;
        Relationships: [];
      };
      deals: {
        Row: DealRow;
        Insert: DealInsert;
        Update: DealUpdate;
        Relationships: [];
      };
      deal_items: {
        Row: DealItemRow;
        Insert: DealItemInsert;
        Update: DealItemUpdate;
        Relationships: [
          {
            foreignKeyName: "deal_items_deal_id_fkey";
            columns: ["deal_id"];
            referencedRelation: "deals";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "deal_items_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_categories: {
        Row: ProductCategoryRow;
        Insert: ProductCategoryInsert;
        Update: Partial<ProductCategoryRow>;
        Relationships: [
          {
            foreignKeyName: "product_categories_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_categories_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      product_reviews: {
        Row: ReviewRow;
        Insert: ReviewInsert;
        Update: ReviewUpdate;
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_owner: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      claim_owner: {
        Args: Record<PropertyKey, never>;
        Returns: void;
      };
      has_purchased_product: {
        Args: { p_product_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
