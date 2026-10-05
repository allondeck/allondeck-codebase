import { useProducts } from "../../../../hooks/useProducts";
import { Button } from "../../../../components/ui/Button";
import { Icon } from "../../../../components/ui/Icon";
import { ShopCard } from "../../../../components/features/ShopCard";
import { ProductCarousel } from "../../../../components/features/ProductCarousel";

export function ShopSection() {
  const { products, loading } = useProducts({ limit: 8 });

  return (
    <section
      className="scroll-mt-16 pt-8 sm:pt-10 lg:pt-12 pb-8 sm:pb-10 lg:pb-10 bg-brand-dark text-white overflow-hidden"
      id="shop"
    >
      <div className="mx-auto max-w-content px-6 lg:px-12">
        <div className="text-center flex flex-col items-center">
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <Icon
              name="cart"
              size={48}
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-brand-orange shrink-0"
              color="currentColor"
            />
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black tracking-widest text-brand-cream uppercase drop-shadow-md">
              OUR SHOP
            </h2>
          </div>
          <p className="mt-2.5 sm:mt-3 max-w-[320px] sm:max-w-[380px] md:max-w-[440px] lg:max-w-[450px] text-sm sm:text-base md:text-lg text-brand-light italic tracking-wide text-center leading-relaxed">
            Join the community and carry our spirit on every journey. We'll see
            you out on the water!
          </p>
        </div>

        <ProductCarousel className="mt-5 sm:mt-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="snap-start shrink-0 w-[220px] sm:w-[240px] md:w-[250px] lg:w-[260px] xl:w-[270px] h-72 sm:h-80 animate-pulse rounded-[1.5rem] sm:rounded-[1.75rem] bg-brand-medium/50 shadow-md"
                />
              ))
            : products.map((product) => (
                <ShopCard key={product.id} product={product} />
              ))}
        </ProductCarousel>

        <div className="mt-4 sm:mt-5 text-center">
          <Button to="/products" variant="outline" size="md">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}
