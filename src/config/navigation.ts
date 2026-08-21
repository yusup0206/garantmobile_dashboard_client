import {
  LayoutDashboard,
  BarChart3,
  ShoppingCart,
  ClipboardList,
  CreditCard,
  Truck,
  Bike,
  Repeat,
  Package,
  Boxes,
  ScrollText,
  FolderTree,
  BadgeCheck,
  Store,
  Users,
  Star,
  MessageSquare,
  Megaphone,
  TicketPercent,
  Image,
  Images,
  Newspaper,
  Tag,
  ShieldCheck,
  HelpCircle,
  UserCog,
  History,
  Bell,
  LayoutTemplate,
  ListChecks,
  type LucideIcon,
} from "lucide-react";
import type { TKey } from "@/i18n/dict";

export type NavItem = {
  /** i18n key resolved via useT in the sidebar. */
  label: TKey;
  to: string;
  icon: LucideIcon;
  /** Hide this item unless the signed-in staff holds this permission. */
  permission?: string;
};

export type NavGroup = {
  /** i18n key resolved via useT in the sidebar. */
  title: TKey;
  items: NavItem[];
};

/** Grouped sidebar navigation — labels are i18n keys (see src/i18n). */
export const NAV_GROUPS: NavGroup[] = [
  // {
  //   title: "nav.group.overview",
  //   items: [
  //     { label: "nav.dashboard", to: "/dashboard", icon: LayoutDashboard },
  //     { label: "nav.analytics", to: "/analytics", icon: BarChart3 },
  //   ],
  // },
  {
    title: "nav.group.sales",
    items: [
      { label: "nav.orders", to: "/orders", icon: ShoppingCart },
      // { label: "nav.preorders", to: "/preorders", icon: ClipboardList },
      { label: "nav.payments", to: "/payments", icon: CreditCard },
      { label: "nav.delivery", to: "/delivery", icon: Truck },
      // { label: "nav.drivers", to: "/drivers", icon: Bike },
      // { label: "nav.tradein", to: "/tradein", icon: Repeat },
    ],
  },
  {
    title: "nav.group.catalog",
    items: [
      // { label: "nav.catalog", to: "/catalog", icon: Package },
      { label: "nav.products", to: "/products", icon: Boxes },
      // { label: "nav.inventory", to: "/inventory", icon: ScrollText },
      { label: "nav.categories", to: "/categories", icon: FolderTree },
      {
        label: "nav.productSpecDefinitions",
        to: "/product-spec-definitions",
        icon: ListChecks,
      },
      { label: "nav.brands", to: "/brands", icon: BadgeCheck },
      { label: "nav.units", to: "/units", icon: Store },
    ],
  },
  // {
  //   title: "nav.group.customers",
  //   items: [
  //     { label: "nav.customers", to: "/customers", icon: Users },
  //     { label: "nav.reviews", to: "/reviews", icon: Star },
  //     { label: "nav.chat", to: "/chat", icon: MessageSquare },
  //   ],
  // },
  {
    title: "nav.group.marketing",
    items: [
      // { label: "nav.home", to: "/home-builder", icon: LayoutTemplate },
      // { label: "nav.hero", to: "/hero-slides", icon: Images },
      // { label: "nav.marketing", to: "/marketing", icon: Megaphone },
      { label: "nav.promocodes", to: "/promocodes", icon: TicketPercent },
      { label: "nav.banners", to: "/banners", icon: Image },
      { label: "nav.blog", to: "/blog", icon: Newspaper },
      { label: "nav.tags", to: "/tags", icon: Tag },
    ],
  },
  {
    title: "nav.group.service",
    items: [
      // { label: "nav.warranty", to: "/warranty", icon: ShieldCheck },
      { label: "nav.faq", to: "/faq", icon: HelpCircle },
    ],
  },
  {
    title: "nav.group.system",
    items: [
      { label: "nav.admins", to: "/admins", icon: UserCog, permission: "staff:read" },
      { label: "nav.roles", to: "/roles", icon: ShieldCheck },
      // { label: "nav.audit", to: "/audit", icon: History, permission: "audit:read" },
      // { label: "nav.notifications", to: "/notifications", icon: Bell },
    ],
  },
];
