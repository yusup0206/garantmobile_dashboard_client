# i18n — словарь и ключи

Весь UI-текст живёт в одном файле — [`dict.ts`](./dict.ts). Одна константа
`I18N` с блоком на язык; `useT()` ([`useT.ts`](./useT.ts)) резолвит ключ для
активного языка с фолбэком на базовый (`ru`), затем на сам ключ.

```ts
const t = useT();
t("nav.dashboard");            // → "Дашборд" / "Dashboard"
t("customers.unread", { n }); // интерполяция {n}
```

## Правила

1. **Новый текст в UI = новый точечный ключ** в `dict.ts` (в блоке `ru` и во
   всех остальных языках). Русский литерал в `t()` **запрещён** — это ловит
   ESLint (`no-restricted-syntax`) и упадёт `npm run lint`.
2. Ключи типизированы: `t()` принимает `TKey = keyof I18N.ru`. Несуществующий
   ключ — **ошибка компиляции**.
3. Набор ключей во всех языках одинаковый — это проверяет `dict.test.ts`.
4. Данные не хранят человекочитаемый текст: статусы/типы/роли ходят **кодом**
   (`st`, `kind`, …), а подпись берётся из словаря по ключу (`status.<code>`).

## Namespace-схема

| Namespace | Назначение | Примеры |
|---|---|---|
| `app.name` | название приложения | `app.name` |
| `nav.group.<key>` | группы меню | `nav.group.overview`, `nav.group.sales`, `nav.group.catalog`, `nav.group.customers`, `nav.group.marketing`, `nav.group.service`, `nav.group.system` |
| `nav.<key>` | пункты меню | `nav.dashboard`, `nav.orders`, `nav.products` |
| `common.<key>` | общие состояния/действия | `common.loading`, `common.empty`, `common.error`, `common.retry`, `common.save`, `common.cancel`, `common.add`, `common.delete`, `common.edit`, `common.saving`, `common.search`, `common.actions` |
| `topbar.<key>` | верхняя панель | `topbar.notifications`, `topbar.logout`, `topbar.language`, `topbar.openMenu` |
| `login.*`, `forgot.*` | экраны входа | `login.title`, `login.submit`, `forgot.emailLabel` |
| `form.<field>` | подписи полей форм | `form.name`, `form.brand`, `form.price`, `form.email`, `form.phone`, `form.address` |
| `filter.all` | таб «Все» | `filter.all` |
| `status.<code>` | статусы сущностей | `status.proc`, `status.paid`, `status.cancelled` |
| `cat.<code>` | категории каталога | `cat.smartphones`, `cat.laptops`, `cat.tablets` |
| `role.<code>` | роли сотрудников | `role.admin`, `role.manager`, `role.support`, `role.courier` |
| `unit.type.<code>` | тип филиала | `unit.type.store`, `unit.type.warehouse`, `unit.type.service` |
| `channel.<code>` | канал кампании | `channel.promo`, `channel.banner`, `channel.push` |
| `placement.<code>` | размещение баннера | `placement.home`, `placement.category`, `placement.checkout` |
| `method.<code>` | способ оплаты | `method.card`, `method.cash`, `method.transfer` |
| `notif.type.<code>` | тип уведомления | `notif.type.order`, `notif.type.payment`, `notif.type.review`, `notif.type.system` |
| `month.<code>` | месяцы (сокр.) | `month.jan` … `month.dec` |
| `plural.<base>.<form>` | формы множественного числа | `plural.product.one`, `plural.product.few`, `plural.product.many`, `plural.product.other` |
| `<page>.title` / `.subtitle` | заголовки страниц | `page.orders.title`, `orders.subtitle` |
| `<page>.action.create` | кнопка «создать» | `products.action.create` |
| `<page>.col.<column>` | заголовки таблиц | `payments.col.payment`, `orders.col.customer` |
| `<page>.empty` | пустое состояние | `payments.empty` |
| `<page>.dialog.<title\|desc>` | диалоги | `products.dialog.title`, `products.dialog.desc` |
| `<page>.err.<field>` | сообщения Zod-валидации | `products.err.nameShort` |

## Плюрализация и форматирование

Формы множественного числа выбирает `Intl.PluralRules` (см.
`usePlural.ts`) — русские правила не хардкодятся. Числа форматируются
`fmt(n, lang)` под локаль (`ru-RU` / `en-US`). Формы хранятся ключами
`plural.<base>.<one|few|many|other>`.

## Zod-схемы

Схема живёт вне React, поэтому хук в ней недоступен. Кладём **ключ** в
сообщение, резолвим при рендере ошибки:

```ts
z.string().min(2, { message: "products.err.nameShort" });
// в форме: {errors.name && t(errors.name.message as TKey)}
```

## Добавить язык

Добавить блок с тем же набором ключей в `I18N` и подпись в `LANG_LABELS` —
`Lang` и переключатель обновятся автоматически из `Object.keys(I18N)`.

```ts
export const I18N = { ru: { … }, en: { … }, tm: { … } } as const;
export const LANG_LABELS = { ru: "Русский", en: "English", tm: "Türkmen" };
```
