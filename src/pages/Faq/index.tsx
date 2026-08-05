import { useState, useMemo } from "react";
import { Plus, Filter } from "lucide-react";
import { useT } from "@/i18n/useT";

import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import {
  useFaq,
  useCreateFaq,
  useEditFaq,
  useDeleteFaq,
} from "@/services/faq/useFaq";
import type { FaqEntry, CreateFaqDto, GetFaqParams } from "@/services/faq/faq.types";

import { FaqItem } from "./ui/FaqItem";
import { FaqModal } from "./ui/FaqModal";
import { groupByCategory } from "./lib/faq.helpers";

export default function FaqPage() {
  const t = useT();

  const [publishedFilter, setPublishedFilter] = useState<string>("all");
  const [chatVisibleFilter, setChatVisibleFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const params = useMemo<GetFaqParams>(() => {
    const queryParams: GetFaqParams = {};

    if (publishedFilter === "true") queryParams.isPublished = true;
    if (publishedFilter === "false") queryParams.isPublished = false;

    if (chatVisibleFilter === "true") queryParams.chatVisible = true;
    if (chatVisibleFilter === "false") queryParams.chatVisible = false;

    if (search.trim()) queryParams.search = search.trim();

    return queryParams;
  }, [publishedFilter, chatVisibleFilter, search]);

  const { data, isLoading, isError, refetch } = useFaq(params);
  const createMutation = useCreateFaq();
  const editMutation = useEditFaq();
  const deleteMutation = useDeleteFaq();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FaqEntry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const groups = useMemo(() => groupByCategory(data ?? []), [data]);

  const handleOpenCreate = () => {
    setEditingEntry(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (entry: FaqEntry) => {
    setEditingEntry(entry);
    setModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    await deleteMutation.mutateAsync({ id: deletingId });
    setDeletingId(null);
  };

  const handleSubmit = async (dto: CreateFaqDto) => {
    if (editingEntry) {
      await editMutation.mutateAsync({ id: editingEntry.id, data: dto });
    } else {
      await createMutation.mutateAsync({ data: dto });
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("page.faq.title")}
        subtitle={t("page.faq.subtitle")}
        action={
          <Button onClick={handleOpenCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Täze FAQ goş
          </Button>
        }
      />

      {/* Filter controls bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2 text-muted font-medium text-sm shrink-0">
            <Filter className="h-4 w-4" />
            <span>Filterler:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            <div>
              <Input
                placeholder="Gözleg (sorag, jogap)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 text-sm"
              />
            </div>

            <div>
              <Select
                value={publishedFilter}
                onChange={(e) => setPublishedFilter(e.target.value)}
                className="h-10 text-sm"
              >
                <option value="all">Ýaýlyma çykarylan (Ähli)</option>
                <option value="true">Diňe ýaýlymdakylar (Published)</option>
                <option value="false">Diňe garaşylýanlar (Draft)</option>
              </Select>
            </div>

            <div>
              <Select
                value={chatVisibleFilter}
                onChange={(e) => setChatVisibleFilter(e.target.value)}
                className="h-10 text-sm"
              >
                <option value="all">Çat görünjiligi (Ähli)</option>
                <option value="true">Çatda görünýänler (Chat Visible)</option>
                <option value="false">Çatda görünmeýänler (Hidden)</option>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : groups.length === 0 ? (
        <EmptyState title={t("faq.empty")} />
      ) : (
        <div className="space-y-8">
          {groups.map((group) => (
            <section key={group.category}>
              <h2 className="mb-2 px-1 font-display text-xs font-bold uppercase tracking-wider text-muted">
                {group.category}
              </h2>
              <Card className="py-0">
                <div className="divide-y divide-line">
                  {Array.isArray(group.items)
                    ? group.items.map((entry) => (
                        <FaqItem
                          key={entry.id}
                          entry={entry}
                          onEdit={handleOpenEdit}
                          onDelete={handleDeleteClick}
                        />
                      ))
                    : null}
                </div>
              </Card>
            </section>
          ))}
        </div>
      )}

      <FaqModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleSubmit}
        initialData={editingEntry}
        isLoading={createMutation.isPending || editMutation.isPending}
      />

      <ConfirmDialog
        open={Boolean(deletingId)}
        onOpenChange={(open) => {
          if (!open) setDeletingId(null);
        }}
        title="FAQ-y pozmak"
        description="Bu FAQ-y pozmak islegiňizi tassyklaýarsyňyzmy? Bu hareketi yza kaytaryp bolmaz."
        confirmLabel="Poz"
        cancelLabel="Ýap"
        danger
        pending={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
