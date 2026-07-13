import { useEffect, useState } from "react";

export default function OwnerCoupons() {
  const [Inner, setInner] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    import("./OwnerCouponsInner").then((m) => setInner(() => m.default));
  }, []);

  if (!Inner) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#066175]/35 border-t-[#e38622]" />
      </div>
    );
  }
  return <Inner />;
}
