import { money, compact } from "@/lib/format";
import type { Lang } from "@/i18n/dict";
import type { ChartModel } from "../types";

function niceCeil(v: number): number {
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const f = v / p;
  const steps = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];
  for (const s of steps) {
    if (f <= s + 1e-9) return s * p;
  }
  return 10 * p;
}

/** Build a smooth SVG area chart model from a numeric series. */
export function buildChart(series: number[], lang: Lang = "ru"): ChartModel {
  const W = 1000;
  const H = 260;
  const padT = 16;
  const padB = 16;
  const innerH = H - padT - padB;
  const max = niceCeil(Math.max(...series) * 1.1);
  const n = series.length;
  const X = (i: number) => (n === 1 ? W / 2 : (i / (n - 1)) * W);
  const Y = (v: number) => padT + innerH * (1 - v / max);

  const points = series.map((v, i) => {
    const x = X(i);
    const y = Y(v);
    return {
      x,
      y,
      left: +((x / W) * 100).toFixed(2),
      top: +((y / H) * 100).toFixed(2),
      v,
      vfmt: money(v, lang),
    };
  });

  let line = "M " + points[0].x.toFixed(1) + " " + points[0].y.toFixed(1);
  for (let i = 1; i < n; i++) {
    const a = points[i - 1];
    const b = points[i];
    const cx = ((a.x + b.x) / 2).toFixed(1);
    line +=
      " C " +
      cx +
      " " +
      a.y.toFixed(1) +
      " " +
      cx +
      " " +
      b.y.toFixed(1) +
      " " +
      b.x.toFixed(1) +
      " " +
      b.y.toFixed(1);
  }
  const area = line + " L " + W + " " + H + " L 0 " + H + " Z";

  const ticks = [];
  for (let s = 0; s <= 4; s++) {
    const v = max * (1 - s / 4);
    ticks.push({ top: +((Y(v) / H) * 100).toFixed(2), label: compact(v, lang) });
  }

  return { line, area, points, ticks };
}
