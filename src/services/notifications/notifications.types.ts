export type NotificationKind = "order" | "payment" | "review" | "system";

export type AppNotification = {
  id: number;
  kind: NotificationKind;
  text: string;
  time: string;
  read: boolean;
};
