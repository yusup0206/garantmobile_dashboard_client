import { useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { useT } from "@/i18n/useT";
import { useLangStore } from "@/store/i18n.store";
import { ArrowLeft, Edit2, Link2Off, Plus } from "lucide-react";

import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { Dialog } from "@/components/ui/Dialog";
import { getImageUrl } from "@/lib/imageUrl";

import {
  useVariantOptionValues,
  useAttachVariantOptionValue,
  useDetachVariantOptionValue,
  useReplaceVariantOptionValue,
} from "@/services/productVariantOptionValues/useProductVariantOptionValues";
import type { VariantOptionValue } from "@/services/productVariantOptionValues/productVariantOptionValues.types";

import { useProductOptions } from "@/services/productOptions/useProductOptions";
import { getProductOptionValues } from "@/services/productOptionValues/productOptionValues.api";
import { productOptionValuesKeys } from "@/services/productOptionValues/useProductOptionValues";
import type { ProductVariant } from "@/services/productVariants/productVariants.types";

// ── Resolved option value info (with option group name) ─────────────────────
type ResolvedValue = {
  id: string;
  valueRu: string;
  valueTk: string;
  hex: string;
  sortOrder: number;
  optionNameRu: string;
  optionNameTk: string;
};

type Props = {
  variant: ProductVariant;
  productId: string;
  onBack: () => void;
};

export function ProductVariantOptionValuesPanel({ variant, productId, onBack }: Props) {
  const t = useT();
  const lang = useLangStore((s) => s.lang);

  // ── Linked option values ─────────────────────────────────────────────────
  const {
    data: linksData,
    isLoading: linksLoading,
    isError: linksError,
    refetch,
  } = useVariantOptionValues({ variantId: variant.id });

  const links = useMemo(() => linksData?.links ?? [], [linksData?.links]);

  // ── All product options ──────────────────────────────────────────────────
  const { data: optionsData } = useProductOptions({ productId });
  const allOptions = useMemo(() => optionsData?.options ?? [], [optionsData?.options]);

  // ── All option values per option (parallel queries) ──────────────────────
  const optionValueQueries = useQueries({
    queries: allOptions.map((opt) => ({
      queryKey: productOptionValuesKeys.list({ optionId: opt.id }),
      queryFn: () => getProductOptionValues({ optionId: opt.id }),
      enabled: !!opt.id,
    })),
  });

  // Build lookup: optionValueId → ResolvedValue
  const valueMap = useMemo(() => {
    const map = new Map<string, ResolvedValue>();
    optionValueQueries.forEach((q, i) => {
      const opt = allOptions[i];
      if (!opt || !q.data) return;
      q.data.values.forEach((v) => {
        map.set(v.id, {
          id: v.id,
          valueRu: v.valueRu,
          valueTk: v.valueTk,
          hex: v.hex,
          sortOrder: v.sortOrder,
          optionNameRu: opt.nameRu,
          optionNameTk: opt.nameTk,
        });
      });
    });
    return map;
  }, [optionValueQueries, allOptions]);

  // Flat list of all available values for the "attach" select
  const allValues = useMemo(() => Array.from(valueMap.values()), [valueMap]);

  // ── Mutations ────────────────────────────────────────────────────────────
  const attachMutation = useAttachVariantOptionValue();
  const replaceMutation = useReplaceVariantOptionValue();
  const detachMutation = useDetachVariantOptionValue();

  // ── Local state ──────────────────────────────────────────────────────────
  const [attachOpen, setAttachOpen] = useState(false);
  const [selectedValueId, setSelectedValueId] = useState("");
  const [replacing, setReplacing] = useState<VariantOptionValue | null>(null);
  const [replaceNewId, setReplaceNewId] = useState("");
  const [detaching, setDetaching] = useState<VariantOptionValue | null>(null);

  function nameOf(v: ResolvedValue | undefined, lang: string) {
    if (!v) return "—";
    return lang === "tk" || lang === "tm" ? v.valueTk || v.valueRu : v.valueRu || v.valueTk;
  }

  function optionNameOf(v: ResolvedValue | undefined, lang: string) {
    if (!v) return "—";
    return lang === "tk" || lang === "tm"
      ? v.optionNameTk || v.optionNameRu
      : v.optionNameRu || v.optionNameTk;
  }

  function handleAttach() {
    if (!selectedValueId) return;
    attachMutation.mutate(
      { variantId: variant.id, optionValueId: selectedValueId },
      {
        onSuccess: () => {
          setAttachOpen(false);
          setSelectedValueId("");
        },
      },
    );
  }

  function openReplace(link: VariantOptionValue) {
    setReplacing(link);
    setReplaceNewId(link.optionValueId); // pre-select the current value
  }

  function handleReplace() {
    if (!replacing || !replaceNewId) return;
    replaceMutation.mutate(
      {
        variantId: replacing.variantId,
        oldOptionValueId: replacing.optionValueId,
        newOptionValueId: replaceNewId,
      },
      {
        onSuccess: () => {
          setReplacing(null);
          setReplaceNewId("");
        },
      },
    );
  }

  function confirmDetach() {
    if (!detaching) return;
    detachMutation.mutate(
      { variantId: detaching.variantId, optionValueId: detaching.optionValueId },
      { onSuccess: () => setDetaching(null) },
    );
  }

  // Already-linked value IDs for disabling in the select
  const linkedIds = new Set(links.map((l) => l.optionValueId));

  // Group allValues by option for the select
  const grouped = useMemo(() => {
    const groups = new Map<string, { optionName: string; values: ResolvedValue[] }>();
    allValues.forEach((v) => {
      const key = `${v.optionNameRu}|${v.optionNameTk}`;
      const optName =
        lang !== "ru"
          ? v.optionNameTk || v.optionNameRu
          : v.optionNameRu || v.optionNameTk;
      if (!groups.has(key)) groups.set(key, { optionName: optName, values: [] });
      groups.get(key)!.values.push(v);
    });
    return Array.from(groups.values());
  }, [allValues, lang]);

  return (
    <div className="space-y-6">
      {/* Sub-header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-surface text-muted transition-colors hover:bg-canvas hover:text-ink"
            aria-label="Назад к вариантам"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-ink">
              Вариант:{" "}
              <span className="font-mono text-brand">
                {variant.barcode || variant.id}
              </span>
            </h2>
            <p className="text-sm text-muted">
              Привязанные значения опций • Цена:{" "}
              <strong>{Number(variant.price).toLocaleString()} TMT</strong> • Остаток:{" "}
              <strong>{variant.stock} шт</strong>
            </p>
          </div>
        </div>
        <Button size="sm" onClick={() => setAttachOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Привязать значение
        </Button>
      </div>

      {/* Variant photos strip */}
      {variant.photos && variant.photos.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {variant.photos.map((photo, i) => (
            <img
              key={i}
              src={getImageUrl(photo)}
              alt=""
              className="h-14 w-14 rounded-xl border border-line object-cover shadow-sm"
            />
          ))}
        </div>
      )}

      {/* Linked option values table */}
      {linksLoading ? (
        <LoadingState />
      ) : linksError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : links.length === 0 ? (
        <EmptyState
          title="Нет привязанных значений опций"
          hint='Нажмите "Привязать значение", чтобы добавить опции к этому варианту'
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Опция</Table.Head>
                <Table.Head>Значение</Table.Head>
                <Table.Head>Цвет</Table.Head>
                <Table.Head className="text-right">{t("common.actions")}</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {links.map((link) => {
                const rv = valueMap.get(link.optionValueId);
                return (
                  <Table.Row key={link.optionValueId}>
                    <Table.Cell className="text-muted text-sm">
                      {optionNameOf(rv, lang as string)}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-2">
                        {rv?.hex ? (
                          <span
                            className="h-5 w-5 shrink-0 rounded-full border border-line shadow-sm"
                            style={{ backgroundColor: rv.hex }}
                          />
                        ) : (
                          <span className="h-5 w-5 shrink-0 rounded-full border border-dashed border-line bg-canvas" />
                        )}
                        <span className="font-semibold text-ink">
                          {nameOf(rv, lang as string)}
                        </span>
                        {!rv && (
                          <span className="font-mono text-xs text-faint">
                            {link.optionValueId}
                          </span>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      {rv?.hex ? (
                        <span className="font-mono text-xs text-muted">{rv.hex}</span>
                      ) : (
                        <span className="text-faint text-xs">—</span>
                      )}
                    </Table.Cell>
                    <Table.Cell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openReplace(link)}
                          title="Заменить значение"
                        >
                          <Edit2 className="h-4 w-4 text-muted" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDetaching(link)}
                          title="Отвязать"
                        >
                          <Link2Off className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </Card>
      )}

      {/* ── Replace dialog ──────────────────────────────────────────────── */}
      <Dialog.Root
        open={!!replacing}
        onOpenChange={(open) => {
          if (!open) {
            setReplacing(null);
            setReplaceNewId("");
          }
        }}
      >
        <Dialog.Content className="max-w-md">
          <Dialog.Title>Заменить значение опции</Dialog.Title>
          <Dialog.Description>
            Текущее значение:{" "}
            <strong>
              {replacing
                ? nameOf(valueMap.get(replacing.optionValueId), lang as string)
                : ""}
            </strong>
            . Выберите новое значение для замены.
          </Dialog.Description>

          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-ink/70">Новое значение</label>
              <select
                value={replaceNewId}
                onChange={(e) => setReplaceNewId(e.target.value)}
                className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              >
                <option value="">— выберите новое значение —</option>
                {grouped.map((group) => (
                  <optgroup key={group.optionName} label={group.optionName}>
                    {group.values.map((v) => {
                      const label =
                        lang === "ru" ? v.valueTk || v.valueRu : v.valueRu || v.valueTk;
                      const alreadyLinked =
                        linkedIds.has(v.id) && v.id !== replacing?.optionValueId;
                      return (
                        <option key={v.id} value={v.id} disabled={alreadyLinked}>
                          {label}
                          {v.hex ? ` (${v.hex})` : ""}
                          {alreadyLinked ? " ✓" : ""}
                        </option>
                      );
                    })}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setReplacing(null);
                  setReplaceNewId("");
                }}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="button"
                disabled={!replaceNewId || replaceMutation.isPending}
                onClick={handleReplace}
              >
                {replaceMutation.isPending ? t("common.saving") : "Заменить"}
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Root>

      {/* ── Attach dialog ───────────────────────────────────────────────── */}
      <Dialog.Root open={attachOpen} onOpenChange={setAttachOpen}>
        <Dialog.Content className="max-w-md">
          <Dialog.Title>Привязать значение опции</Dialog.Title>
          <Dialog.Description>
            Выберите значение опции для прикрепления к этому варианту товара.
          </Dialog.Description>

          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-ink/70">Значение опции</label>
              {grouped.length === 0 ? (
                <p className="rounded-xl border border-dashed border-line px-3 py-4 text-center text-sm text-muted">
                  Нет доступных значений. Сначала создайте опции и их значения.
                </p>
              ) : (
                <select
                  value={selectedValueId}
                  onChange={(e) => setSelectedValueId(e.target.value)}
                  className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                >
                  <option value="">— выберите значение —</option>
                  {grouped.map((group) => (
                    <optgroup key={group.optionName} label={group.optionName}>
                      {group.values.map((v) => {
                        const label =
                          lang === "ru" ? v.valueTk || v.valueRu : v.valueRu || v.valueTk;
                        const alreadyLinked = linkedIds.has(v.id);
                        return (
                          <option key={v.id} value={v.id} disabled={alreadyLinked}>
                            {label}
                            {v.hex ? ` (${v.hex})` : ""}
                            {alreadyLinked ? " ✓" : ""}
                          </option>
                        );
                      })}
                    </optgroup>
                  ))}
                </select>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAttachOpen(false);
                  setSelectedValueId("");
                }}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="button"
                disabled={!selectedValueId || attachMutation.isPending}
                onClick={handleAttach}
              >
                {attachMutation.isPending ? t("common.saving") : "Привязать"}
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Root>

      {/* ── Detach confirm ──────────────────────────────────────────────── */}
      <ConfirmDialog
        open={!!detaching}
        onOpenChange={(open) => !open && setDetaching(null)}
        title="Отвязать значение опции?"
        description={
          detaching
            ? `Удалить привязку значения опции "${nameOf(valueMap.get(detaching.optionValueId), lang as string)}" от этого варианта?`
            : undefined
        }
        confirmLabel="Отвязать"
        cancelLabel={t("common.cancel")}
        onConfirm={confirmDetach}
        pending={detachMutation.isPending}
        danger
      />
    </div>
  );
}
