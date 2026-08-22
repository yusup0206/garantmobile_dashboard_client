import { useState, useMemo } from "react";
import { Plus, Shield, Edit2, Trash2, ChevronDown } from "lucide-react";
import { useT } from "@/i18n/useT";

import { PageHeader } from "@/components/common/PageHeader";
import { SearchInput } from "@/components/common/SearchInput";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  useRoles,
  useCreateRole,
  useEditRole,
  useDeleteRole,
} from "@/services/roles/useRoles";
import type { RoleResponse, CreateRoleDto } from "@/services/roles/roles.types";

import { RoleModal } from "./ui/RoleModal";

export default function RolesPage() {
  const t = useT();
  const [search, setSearch] = useState("");

  const { data: roles = [], isLoading, isError, refetch } = useRoles({ search });
  const createMutation = useCreateRole();
  const editMutation = useEditRole();
  const deleteMutation = useDeleteRole();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleResponse | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredRoles = useMemo(() => {
    if (!search.trim()) return roles;
    const q = search.toLowerCase();
    return roles.filter((r) => r.name.toLowerCase().includes(q));
  }, [roles, search]);

  const handleOpenCreate = () => {
    setEditingRole(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (role: RoleResponse) => {
    setEditingRole(role);
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

  const handleSubmit = async (dto: CreateRoleDto) => {
    if (editingRole) {
      await editMutation.mutateAsync({ id: editingRole.id, data: dto });
    } else {
      await createMutation.mutateAsync({ data: dto });
    }
    setModalOpen(false);
  };

  const getBadgeForAccess = (access: string) => {
    if (access === "write") {
      return (
        <Badge bg="rgba(16, 185, 129, 0.1)" fg="#10B981">
          Full Access
        </Badge>
      );
    }
    if (access === "readonly") {
      return (
        <Badge bg="rgba(59, 130, 246, 0.1)" fg="#3B82F6">
          Readonly
        </Badge>
      );
    }
    return (
      <Badge bg="rgba(156, 163, 175, 0.1)" fg="#9CA3AF">
        No Access
      </Badge>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("page.roles.title")}
        subtitle={t("page.roles.subtitle")}
        action={
          <Button size="sm" onClick={handleOpenCreate}>
            <Plus className="h-4 w-4" />
            {t("common.add")}
          </Button>
        }
      />

      {/* Unified Filter & Search Bar */}
      <Card className="p-4 flex flex-col sm:flex-row items-center justify-end gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={t("roles.search")}
        />
      </Card>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : filteredRoles.length === 0 ? (
        <EmptyState title={t("roles.empty")} />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredRoles.map((role) => {
            const isExpanded = expandedId === role.id;
            const writeCount =
              role.permissions?.filter((p) => p.access === "write").length ?? 0;
            const readonlyCount =
              role.permissions?.filter((p) => p.access === "readonly").length ?? 0;

            return (
              <Card key={role.id} className="p-5 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-ink text-base">
                        {role.name}
                      </h3>
                      <p className="text-xs text-muted">
                        {t("roles.info.created")}{" "}
                        {role.created ? new Date(role.created).toLocaleDateString() : "—"}{" "}
                        • {t("roles.info.permissions")} {writeCount} {t("roles.info.fullAccess")}, {readonlyCount} {t("roles.info.readonly")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setExpandedId(isExpanded ? null : role.id)}
                    >
                      <span>{t("roles.btn.showPermissions")} ({role.permissions?.length ?? 0})</span>
                      <ChevronDown
                        className={`ml-1 h-4 w-4 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(role)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-50"
                      onClick={() => handleDeleteClick(role.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="pt-4 border-t border-line">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {role.permissions?.map((p) => (
                        <div
                          key={p.permission}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-canvas text-xs font-semibold"
                        >
                          <span className="text-ink">{p.permission}</span>
                          {getBadgeForAccess(p.access)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <RoleModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleSubmit}
        initialData={editingRole}
        isLoading={createMutation.isPending || editMutation.isPending}
      />

      <ConfirmDialog
        open={Boolean(deletingId)}
        onOpenChange={(open) => {
          if (!open) setDeletingId(null);
        }}
        title={t("roles.confirm.title")}
        description={t("roles.confirm.desc")}
        confirmLabel={t("common.delete")}
        cancelLabel={t("common.cancel")}
        danger
        pending={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
