import { useMemo, useState } from "react";
import { useT } from "@/i18n/useT";
import { useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { FilterTabs } from "@/components/common/FilterTabs";
import { SearchInput } from "@/components/common/SearchInput";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  useAdmins,
  useCreateAdmin,
  useEditAdmin,
  useDeleteAdmin,
} from "@/services/users/useUsers";
import type { AdminUser, CreateAdminDto, EditAdminDto, AdminStatus } from "@/services/users/users.types";

import { AdminsTable } from "./ui/AdminsTable";
import { AdminFormDialog } from "./ui/AdminFormDialog";
import { toAdminRow, FILTER_TABS } from "./lib/admins.helpers";

export default function AdminsPage() {
  const t = useT();

  const [params, setParams] = useSearchParams();
  const filter = (params.get("status") as AdminStatus | "all") ?? "all";
  const [search, setSearch] = useState("");

  const queryParams = useMemo(() => {
    const p: { status?: AdminStatus; search?: string } = {};
    if (filter !== "all") p.status = filter;
    if (search.trim()) p.search = search.trim();
    return p;
  }, [filter, search]);

  const { data, isLoading, isError, refetch } = useAdmins(queryParams);
  const createAdminMutation = useCreateAdmin();
  const editAdminMutation = useEditAdmin();
  const deleteAdminMutation = useDeleteAdmin();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState<AdminUser | null>(null);

  const admins = useMemo(() => data?.admins ?? [], [data?.admins]);

  const rows = useMemo(() => {
    return admins.map(toAdminRow);
  }, [admins]);

  function setFilter(key: string) {
    setParams(key === "all" ? {} : { status: key }, { replace: true });
  }

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(user: AdminUser) {
    setEditing(user);
    setFormOpen(true);
  }

  function submitForm(values: CreateAdminDto | EditAdminDto) {
    if (editing) {
      editAdminMutation.mutate(
        { id: editing.id, data: values as EditAdminDto },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createAdminMutation.mutate(
        { data: values as CreateAdminDto },
        { onSuccess: () => setFormOpen(false) },
      );
    }
  }

  function confirmDelete() {
    if (!deleting) return;
    deleteAdminMutation.mutate(
      { id: deleting.id },
      { onSuccess: () => setDeleting(null) },
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("page.users.title")}
        subtitle={t("page.users.subtitle")}
        action={
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" />
            {t("common.add")}
          </Button>
        }
      />

      {/* Unified Filter & Search Bar */}
      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <FilterTabs tabs={FILTER_TABS} value={filter} onChange={setFilter} />
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={t("common.search")}
        />
      </Card>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : rows.length === 0 ? (
        <EmptyState title={t("users.empty")} />
      ) : (
        <AdminsTable
          rows={rows}
          onEdit={openEdit}
          onDelete={setDeleting}
        />
      )}

      <AdminFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        user={editing}
        onSubmit={submitForm}
        pending={createAdminMutation.isPending || editAdminMutation.isPending}
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={t("admins.confirm.title")}
        description={
          deleting
            ? `${t("admins.confirm.desc")} «${deleting.name}»?`
            : undefined
        }
        confirmLabel={t("common.delete")}
        danger
        pending={deleteAdminMutation.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
