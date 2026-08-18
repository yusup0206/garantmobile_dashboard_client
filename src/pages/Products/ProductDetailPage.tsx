import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Layers, Settings2, Sliders } from "lucide-react";
import { useLangStore } from "@/store/i18n.store";
import { useProductDetail } from "@/services/products/useProducts";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { Card } from "@/components/ui/Card";
import { ProductSpecsTab } from "./ui/ProductSpecsTab";
import { ProductVariantsTab } from "./ui/ProductVariantsTab";
import { ProductOptionsTab } from "./ui/ProductOptionsTab";

type TabKey = "specs" | "variants" | "options";

export default function ProductDetailPage() {
  const { id: productId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lang = useLangStore((s) => s.lang);

  const [activeTab, setActiveTab] = useState<TabKey>("specs");

  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useProductDetail(productId ?? null);

  const productName =
    product
      ? (lang as string) === "tm"
        ? product.nameTm || product.nameRu
        : product.nameRu || product.nameTm
      : "Товар";

  const tabs: { key: TabKey; label: string; icon: typeof Sliders }[] = [
    { key: "specs", label: "Характеристики", icon: Sliders },
    { key: "variants", label: "Варианты товара", icon: Layers },
    { key: "options", label: "Опции товара", icon: Settings2 },
  ];

  if (isLoading) return <LoadingState />;
  if (isError || !productId) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-surface text-muted transition-colors hover:bg-canvas hover:text-ink"
            aria-label="Назад к товарам"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
                {productName}
              </h1>
            </div>
            <p className="text-sm text-muted">
              {product?.shortRu || product?.shortTm || "Детальная информация о товаре"}
            </p>
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <Card className="p-1.5 flex items-center gap-1.5 bg-surface border-line">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                isActive
                  ? "bg-brand text-white shadow-sm"
                  : "text-muted hover:bg-canvas hover:text-ink"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </Card>

      {/* Tab Content */}
      <div>
        {activeTab === "specs" && <ProductSpecsTab productId={productId} />}
        {activeTab === "variants" && <ProductVariantsTab productId={productId} />}
        {activeTab === "options" && <ProductOptionsTab productId={productId} />}
      </div>
    </div>
  );
}
