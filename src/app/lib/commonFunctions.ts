import { getUserFromSession } from "@/lib/getCurrentUser";
import { serializeDoc } from "@/utils/serialize";
import { cookies } from "next/headers";

export async function getLoggedInUser() {
  const cookieStore = cookies();
  const user = await getUserFromSession(cookieStore);
  return user ? serializeDoc(user) : null;
}

type Primitive = string | number | boolean | File | Blob;
type FormDataValue = Primitive | Primitive[] | Record<string, unknown> | null | undefined;

export function objectToFormData(data: Record<string, FormDataValue>): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        if (
          typeof item === "string" ||
          typeof item === "number" ||
          typeof item === "boolean"
        ) {
          formData.append(key, item.toString());
        } else if (item instanceof File || item instanceof Blob) {
          formData.append(key, item);
        } else {
          formData.append(key, JSON.stringify(item));
        }
      });
    } else if (typeof value === "object" && value !== null) {
      formData.append(key, JSON.stringify(value));
    } else if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  return formData;
}
