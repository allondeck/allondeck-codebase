import { useProducts } from "../../../../hooks/useProducts";
import { Button } from "../../../../components/ui/Button";
import { ShopCard } from "../../../../components/features/ShopCard";
import { ProductCarousel } from "../../../../components/features/ProductCarousel";

export function ShopSection() {
  const { products, loading } = useProducts({ limit: 8 });

  return (
    <section
      className="py-20 bg-brand-dark text-white overflow-hidden"
      id="shop"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="text-center flex flex-col items-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <svg
              className="h-10 w-10 md:h-14 md:w-14 lg:h-20 lg:w-20 text-brand-orange"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 6h-3.5a5.5 5.5 0 00-11 0H1v16h18V6zm-8-3.5c1.93 0 3.5 1.57 3.5 3.5h-7c0-1.93 1.57-3.5 3.5-3.5zM3 20V8h12v12H3z" />
              <path d="M7.5 6a3.5 3.5 0 017 0H16a5.5 5.5 0 00-11 0h2.5z" />
            </svg>
            <h2 className="font-heading text-4xl md:text-6xl lg:text-8xl font-normal tracking-widest text-brand-cream">
              OUR SHOP
            </h2>
          </div>
          <p className="mt-4 max-w-xl text-base md:text-lg lg:text-xl text-brand-light italic tracking-wide">
            Join the community and carry our spirit on every journey. We'll see
            you out on the water!
          </p>
        </div>

        <ProductCarousel className="mt-12">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="snap-start shrink-0 w-72 h-96 animate-pulse rounded-[2rem] bg-brand-medium/50 shadow-md"
                />
              ))
            : products.map((product) => (
                <ShopCard key={product.id} product={product} />
              ))}
        </ProductCarousel>

        <div className="mt-4 text-center">
          <Button to="/products" variant="outline" size="md">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}
