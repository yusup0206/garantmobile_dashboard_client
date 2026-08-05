import { useQuery } from "@tanstack/react-query";
import { getBoard } from "./analyticsBoard.api";

export const analyticsBoardKeys = {
  board: ["analyticsBoard", "board"] as const,
};

export function useAnalyticsBoard() {
  return useQuery({
    queryKey: analyticsBoardKeys.board,
    queryFn: getBoard,
  });
}
