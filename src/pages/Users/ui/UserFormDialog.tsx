import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { useRoles } from "@/services/roles/useRoles";
import type {
  AdminUser,
  CreateAdminDto,
  EditAdminDto,
  AdminStatus,
} from "@/services/users/users.types";

type UserFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: AdminUser | null;
  onSubmit: (values: CreateAdminDto | EditAdminDto) => void;
  pending?: boolean;
};

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  onSubmit,
  pending,
}: UserFormDialogProps) {
  const { data: roles = [] } = useRoles();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<AdminStatus>("active");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setPassword("");
      setStatus(user.status || "active");
      setSelectedRoles(user.roles ? user.roles.map((r) => r.id) : []);
    } else {
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setStatus("active");
      setSelectedRoles([]);
    }
  }, [open, user]);

  const handleToggleRole = (roleId: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId],
    );
  };

  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (selectedRoles.length === 0) {
      setErrorMsg("Выберите хотя бы одну роль (roleIds)");
      return;
    }

    if (!user) {
      const isStrong =
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password);

      if (!isStrong) {
        setErrorMsg(
          "Пароль недостаточно надежный! Требуется минимум 8 символов: заглавная буква, строчная буква, цифра и спецсимвол (например, @!#$%)",
        );
        return;
      }
    }

    if (user) {
      const editDto: EditAdminDto = {
        name,
        email,
        phone,
        status,
        roleIds: selectedRoles,
      };
      onSubmit(editDto);
    } else {
      const createDto: CreateAdminDto = {
        name,
        email,
        phone,
        password,
        status,
        roleIds: selectedRoles,
      };
      onSubmit(createDto);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Title>
          {user ? "Редактировать сотрудника" : "Добавить сотрудника (Admin)"}
        </Dialog.Title>
        <Dialog.Description>
          Заполните персональные данные сотрудника и назначьте роли
        </Dialog.Description>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          {errorMsg ? (
            <div className="p-3 text-xs font-semibold text-red-600 bg-red-50 rounded-xl border border-red-200">
              {errorMsg}
            </div>
          ) : null}
          <div>
            <label className="text-xs font-semibold text-ink/70">ФИО / Имя</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Аман Аманов"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink/70">E-mail</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@garantmobile.tm"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink/70">Телефон</label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+99365990099"
            />
          </div>

          {!user && (
            <div>
              <label className="text-xs font-semibold text-ink/70">Пароль</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
                required
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-ink/70">Статус</label>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as AdminStatus)}
              className="h-10 text-sm"
            >
              <option value="active">Активный (active)</option>
              <option value="invited">Приглашен (invited)</option>
              <option value="blocked">Заблокирован (blocked)</option>
            </Select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-ink/70">
              Назначенные роли
            </label>
            <div className="flex flex-wrap gap-2 rounded-xl border border-line bg-canvas p-3 max-h-36 overflow-y-auto">
              {roles.length === 0 ? (
                <span className="text-xs text-muted">Роли не найдены</span>
              ) : (
                roles.map((r) => {
                  const active = selectedRoles.includes(r.id);
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleToggleRole(r.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        active
                          ? "bg-brand text-white"
                          : "bg-surface border border-line text-muted hover:text-ink"
                      }`}
                    >
                      {r.name}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Сохранение…" : user ? "Сохранить" : "Добавить"}
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
