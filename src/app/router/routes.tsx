import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { LoadingState } from "@/components/common/LoadingState";

const LoginPage = lazy(() => import("@/pages/Login"));
const AcceptInvitePage = lazy(() => import("@/pages/AcceptInvite"));
const DashboardPage = lazy(() => import("@/pages/Dashboard"));
const AnalyticsPage = lazy(() => import("@/pages/Analytics"));
const OrdersPage = lazy(() => import("@/pages/Orders"));
const PreordersPage = lazy(() => import("@/pages/Preorders"));
const PaymentsPage = lazy(() => import("@/pages/Payments"));
const DeliveryPage = lazy(() => import("@/pages/Delivery"));
const DriversPage = lazy(() => import("@/pages/Drivers"));
const TradeinPage = lazy(() => import("@/pages/Tradein"));
const ProductSpecDefinitionsPage = lazy(
  () => import("@/pages/ProductSpecDefinitions"),
);
const ProductSpecDefinitionDetailPage = lazy(
  () =>
    import(
      "@/pages/ProductSpecDefinitions/ProductSpecDefinitionDetail"
    ),
);
const CatalogPage = lazy(() => import("@/pages/Catalog"));
const ProductsPage = lazy(() => import("@/pages/Products"));
const ProductDetailPage = lazy(
  () => import("@/pages/Products/ProductDetailPage"),
);
const InventoryPage = lazy(() => import("@/pages/Inventory"));
const CategoriesPage = lazy(() => import("@/pages/Categories"));
const BrandsPage = lazy(() => import("@/pages/Brands"));
const UnitsPage = lazy(() => import("@/pages/Units"));
const CustomersPage = lazy(() => import("@/pages/Customers"));
const ReviewsPage = lazy(() => import("@/pages/Reviews"));
const ChatPage = lazy(() => import("@/pages/Chat"));
const MarketingPage = lazy(() => import("@/pages/Marketing"));
const HomeBuilderPage = lazy(() => import("@/pages/HomeBuilder"));
const HeroSlidesPage = lazy(() => import("@/pages/HeroSlides"));
const PromocodesPage = lazy(() => import("@/pages/Promocodes"));
const BannersPage = lazy(() => import("@/pages/Banners"));
const BlogPage = lazy(() => import("@/pages/Blog"));
const TagsPage = lazy(() => import("@/pages/Tags"));
const WarrantyPage = lazy(() => import("@/pages/Warranty"));
const FaqPage = lazy(() => import("@/pages/Faq"));
const AdminsPage = lazy(() => import("@/pages/Admins"));
const RolesPage = lazy(() => import("@/pages/Roles"));
const AuditPage = lazy(() => import("@/pages/Audit"));
const NotificationsPage = lazy(() => import("@/pages/Notifications"));

function withSuspense(node: React.ReactNode) {
  return <Suspense fallback={<LoadingState />}>{node}</Suspense>;
}

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: withSuspense(<LoginPage />) },
      { path: "/accept-invite", element: withSuspense(<AcceptInvitePage />) },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/", element: <Navigate to="/dashboard" replace /> },
          { path: "/dashboard", element: withSuspense(<DashboardPage />) },
          { path: "/analytics", element: withSuspense(<AnalyticsPage />) },
          { path: "/orders", element: withSuspense(<OrdersPage />) },
          { path: "/preorders", element: withSuspense(<PreordersPage />) },
          { path: "/payments", element: withSuspense(<PaymentsPage />) },
          { path: "/delivery", element: withSuspense(<DeliveryPage />) },
          { path: "/drivers", element: withSuspense(<DriversPage />) },
          { path: "/tradein", element: withSuspense(<TradeinPage />) },
          {
            path: "/product-spec-definitions",
            element: withSuspense(<ProductSpecDefinitionsPage />),
          },
          {
            path: "/product-spec-definitions/:id",
            element: withSuspense(<ProductSpecDefinitionDetailPage />),
          },
          { path: "/catalog", element: withSuspense(<CatalogPage />) },
          { path: "/products", element: withSuspense(<ProductsPage />) },
          {
            path: "/products/:id",
            element: withSuspense(<ProductDetailPage />),
          },
          { path: "/inventory", element: withSuspense(<InventoryPage />) },
          { path: "/categories", element: withSuspense(<CategoriesPage />) },
          { path: "/brands", element: withSuspense(<BrandsPage />) },
          { path: "/units", element: withSuspense(<UnitsPage />) },
          { path: "/customers", element: withSuspense(<CustomersPage />) },
          { path: "/reviews", element: withSuspense(<ReviewsPage />) },
          { path: "/chat", element: withSuspense(<ChatPage />) },
          { path: "/marketing", element: withSuspense(<MarketingPage />) },
          { path: "/home-builder", element: withSuspense(<HomeBuilderPage />) },
          { path: "/hero-slides", element: withSuspense(<HeroSlidesPage />) },
          { path: "/promocodes", element: withSuspense(<PromocodesPage />) },
          { path: "/banners", element: withSuspense(<BannersPage />) },
          { path: "/blog", element: withSuspense(<BlogPage />) },
          { path: "/tags", element: withSuspense(<TagsPage />) },
          { path: "/warranty", element: withSuspense(<WarrantyPage />) },
          { path: "/faq", element: withSuspense(<FaqPage />) },
          { path: "/admins", element: withSuspense(<AdminsPage />) },
          { path: "/roles", element: withSuspense(<RolesPage />) },
          { path: "/audit", element: withSuspense(<AuditPage />) },
          { path: "/notifications", element: withSuspense(<NotificationsPage />) },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/dashboard" replace /> },
]);
