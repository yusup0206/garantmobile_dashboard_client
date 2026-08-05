import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import type {
  PaymentType,
  PaymentTypeInput,
  GetPaymentTypesParams,
  GetPaymentTypesResponse,
  DeletePaymentTypeResponse,
} from "./payments.types";

let store: PaymentType[] = [
  {
    id: "clg1x0z5e0000v6l3f4b7j2k1",
    titleTk: "Nagt töleg",
    descriptionTk: "Haryty alanyňyzda nagt töleg geçirmek",
    titleRu: "Наличный расчет",
    descriptionRu: "Оплата наличными при получении товара",
    icon: "",
    isActive: true,
    paymentProcent: 0,
    paymentBonus: 0,
    isOverpayment: false,
    sortOrder: 1,
  },
  {
    id: "clg1x0z5e0000v6l3f4b7j2k2",
    titleTk: "Bank kartasy арkaly",
    descriptionTk: "Alnanda bank kartasy arkaly töleg",
    titleRu: "Банковской картой",
    descriptionRu: "Оплата банковской картой через терминал курьера",
    icon: "",
    isActive: true,
    paymentProcent: 0,
    paymentBonus: 5,
    isOverpayment: false,
    sortOrder: 2,
  },
  {
    id: "clg1x0z5e0000v6l3f4b7j2k3",
    titleTk: "Onlaýn töleg",
    descriptionTk: "Programma arkaly göni onlaýn töleg",
    titleRu: "Онлайн оплата",
    descriptionRu: "Оплата онлайн банковской картой в приложении",
    icon: "",
    isActive: true,
    paymentProcent: 1.5,
    paymentBonus: 10,
    isOverpayment: true,
    sortOrder: 3,
  },
];

function formatPayload(input: PaymentTypeInput) {
  return {
    ...input,
    paymentProcent: Number(input.paymentProcent ?? 0),
    paymentBonus: Number(input.paymentBonus ?? 0),
    sortOrder: Number(input.sortOrder ?? 0),
    isOverpayment: Boolean(input.isOverpayment),
    isActive: Boolean(input.isActive),
  };
}

export async function getPaymentTypes(
  params?: GetPaymentTypesParams,
): Promise<GetPaymentTypesResponse> {
  if (isApiEnabled()) {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.set("page", String(params.page));
    if (params?.pageSize !== undefined) query.set("pageSize", String(params.pageSize));
    if (params?.search) query.set("search", params.search);
    if (params?.isActive !== undefined && params.isActive !== "") {
      query.set("isActive", String(params.isActive));
    }
    if (params?.isOverpayment !== undefined && params.isOverpayment !== "") {
      query.set("isOverpayment", String(params.isOverpayment));
    }

    const queryString = query.toString();
    const endpoint = `/payment/all${queryString ? `?${queryString}` : ""}`;

    return apiClient<unknown>(endpoint, {
      token: authToken(),
      headers: {
        "Accept-Language": params?.lang || "tk",
      },
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      const dataObj = r?.data as Record<string, unknown>;
      if (dataObj?.paymentTypes && Array.isArray(dataObj.paymentTypes)) {
        return {
          count:
            (dataObj.count as number) ?? (dataObj.paymentTypes as PaymentType[]).length,
          paymentTypes: dataObj.paymentTypes as PaymentType[],
        };
      }
      if (r?.paymentTypes && Array.isArray(r.paymentTypes)) {
        return {
          count: (r.count as number) ?? (r.paymentTypes as PaymentType[]).length,
          paymentTypes: r.paymentTypes as PaymentType[],
        };
      }
      if (Array.isArray(res)) {
        return { count: res.length, paymentTypes: res as PaymentType[] };
      }
      return { count: 0, paymentTypes: [] };
    });
  }

  let filtered = [...store];
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.titleRu.toLowerCase().includes(q) ||
        item.titleTk.toLowerCase().includes(q) ||
        item.descriptionRu.toLowerCase().includes(q) ||
        item.descriptionTk.toLowerCase().includes(q),
    );
  }
  if (params?.isActive !== undefined && params.isActive !== "") {
    const activeBool = String(params.isActive) === "true";
    filtered = filtered.filter((item) => Boolean(item.isActive) === activeBool);
  }
  if (params?.isOverpayment !== undefined && params.isOverpayment !== "") {
    const overpaymentBool = String(params.isOverpayment) === "true";
    filtered = filtered.filter((item) => Boolean(item.isOverpayment) === overpaymentBool);
  }

  return mockDelay({
    count: filtered.length,
    paymentTypes: filtered,
  });
}

export async function getPaymentTypeDetails(
  id: string,
  lang = "tk",
): Promise<PaymentType> {
  if (isApiEnabled()) {
    return apiClient<unknown>(`/payment/details/${id}`, {
      token: authToken(),
      headers: {
        "Accept-Language": lang,
      },
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      const item = (r?.data ?? r) as PaymentType;
      return item;
    });
  }

  const found = store.find((item) => item.id === id);
  if (!found) throw new Error("Payment type not found");
  return mockDelay(found);
}

export async function createPaymentType(
  input: PaymentTypeInput,
  lang = "tk",
): Promise<PaymentType> {
  const payload = formatPayload(input);
  if (isApiEnabled()) {
    return apiClient<unknown>("/payment/create", {
      method: "POST",
      body: JSON.stringify(payload),
      token: authToken(),
      headers: {
        "Accept-Language": lang,
      },
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      const item = (r?.data ?? r) as PaymentType;
      return item;
    });
  }

  const newObj: PaymentType = {
    id: "clg1x0z5e" + Math.random().toString(36).substring(2, 9),
    ...payload,
  };
  store.unshift(newObj);
  return mockDelay(newObj);
}

export async function updatePaymentType(
  id: string,
  input: PaymentTypeInput,
  lang = "tk",
): Promise<PaymentType> {
  const payload = formatPayload(input);
  if (isApiEnabled()) {
    return apiClient<unknown>(`/payment/edit/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
      token: authToken(),
      headers: {
        "Accept-Language": lang,
      },
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      const item = (r?.data ?? r) as PaymentType;
      return item;
    });
  }

  const idx = store.findIndex((item) => item.id === id);
  if (idx !== -1) {
    store[idx] = { ...store[idx], ...payload };
    return mockDelay(store[idx]);
  }
  throw new Error("Payment type not found");
}

export async function deletePaymentType(
  id: string,
  lang = "tk",
): Promise<DeletePaymentTypeResponse> {
  if (isApiEnabled()) {
    return apiClient<DeletePaymentTypeResponse>(`/payment/delete/${id}`, {
      method: "DELETE",
      token: authToken(),
      headers: {
        "Accept-Language": lang,
      },
    });
  }

  store = store.filter((item) => item.id !== id);
  return mockDelay({ deleted: true });
}

/** Backward compatibility helper */
export const getPayments = getPaymentTypes;
