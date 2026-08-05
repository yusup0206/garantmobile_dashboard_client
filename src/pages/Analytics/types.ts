import type {
  AnalyticsCategory,
  AnalyticsKpis,
  AnalyticsMonth,
} from "@/services/analyticsBoard/analyticsBoard.types";

export type AnalyticsStatsProps = {
  kpis: AnalyticsKpis;
};

export type RevenueBarsProps = {
  months: AnalyticsMonth[];
};

export type CategoryBreakdownProps = {
  categories: AnalyticsCategory[];
};
