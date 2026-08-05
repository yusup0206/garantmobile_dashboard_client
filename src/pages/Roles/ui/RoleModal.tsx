import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  ALL_PERMISSIONS,
  ACCESS_LEVELS,
  type RoleResponse,
  type CreateRoleDto,
  type PermissionName,
  type AccessLevel,
  type RolePermissionDto,
} from "@/services/roles/roles.types";

interface RoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateRoleDto) => Promise<void> | void;
  initialData?: RoleResponse | null;
  isLoading?: boolean;
}

const PERMISSION_LABELS: Record<PermissionName, string> = {
  orders: "Заказы (orders)",
  clients: "Клиенты (clients)",
  products: "Товары (products)",
  warehouses: "Склады (warehouses)",
  preOrders: "Предзаказы (preOrders)",
  guarantees: "Гарантии (guarantees)",
  tradeIn: "Trade-In (tradeIn)",
  promoCodes: "Промокоды (promoCodes)",
  blog: "Блог (blog)",
  analytics: "Аналитика (analytics)",
  marketing: "Маркетинг (marketing)",
  users: "Пользователи (users)",
};

const ACCESS_LABELS: Record<AccessLevel, string> = {
  noAccess: "Доступ запрещен (noAccess)",
  readonly: "Только чтение (readonly)",
  write: "Полный доступ (write)",
};

export function RoleModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading,
}: RoleModalProps) {
  const [name, setName] = useState("");
  const [permissionsState, setPermissionsState] = useState<
    Record<PermissionName, AccessLevel>
  >(() => {
    const initialMap: Record<string, AccessLevel> = {};
    ALL_PERMISSIONS.forEach((p) => {
      initialMap[p] = "noAccess";
    });
    return initialMap as Record<PermissionName, AccessLevel>;
  });

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      const map: Record<string, AccessLevel> = {};
      ALL_PERMISSIONS.forEach((p) => {
        const found = initialData.permissions?.find((item) => item.permission === p);
        map[p] = found ? found.access : "noAccess";
      });
      setPermissionsState(map as Record<PermissionName, AccessLevel>);
    } else {
      setName("");
      const initialMap: Record<string, AccessLevel> = {};
      ALL_PERMISSIONS.forEach((p) => {
        initialMap[p] = "noAccess";
      });
      setPermissionsState(initialMap as Record<PermissionName, AccessLevel>);
    }
  }, [initialData, open]);

  const handleAccessChange = (perm: PermissionName, access: AccessLevel) => {
    setPermissionsState((prev) => ({
      ...prev,
      [perm]: access,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const permissions: RolePermissionDto[] = ALL_PERMISSIONS.map((perm) => ({
      permission: perm,
      access: permissionsState[perm],
    }));

    onSubmit({
      name,
      permissions,
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-2xl">
        <Dialog.Title>
          {initialData ? "Редактировать роль" : "Создать новую роль"}
        </Dialog.Title>
        <Dialog.Description>
          Укажите название роли и настройте права доступа по разделам
        </Dialog.Description>

        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted uppercase">
              Название роли
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Менеджер продаж, Админ"
              required
            />
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-ink uppercase tracking-wider">
              Права доступа (Permissions)
            </h4>
            <div className="divide-y divide-line rounded-xl border border-line bg-canvas/50">
              {ALL_PERMISSIONS.map((perm) => (
                <div
                  key={perm}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-2"
                >
                  <span className="text-sm font-semibold text-ink">
                    {PERMISSION_LABELS[perm]}
                  </span>
                  <div className="w-full sm:w-60">
                    <Select
                      value={permissionsState[perm]}
                      onChange={(e) =>
                        handleAccessChange(perm, e.target.value as AccessLevel)
                      }
                      className="h-9 text-xs"
                    >
                      {ACCESS_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {ACCESS_LABELS[lvl]}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Сохранение…" : initialData ? "Сохранить" : "Создать"}
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
