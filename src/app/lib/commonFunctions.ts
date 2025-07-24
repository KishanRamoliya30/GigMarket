type Primitive = string | number | boolean | File | Blob;
export type FormDataValue = Primitive | Primitive[] | Record<string, unknown> | null | undefined;

export function objectToFormData(data: Record<string, FormDataValue>): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      // value.forEach((item) => {
      //   if (
      //     typeof item === "string" ||
      //     typeof item === "number" ||
      //     typeof item === "boolean"
      //   ) {
      //     formData.append(key, item.toString());
      //   } else if (item instanceof File || item instanceof Blob) {
      //     formData.append(key, item);
      //   } else {
      //     formData.append(key, JSON.stringify(item));
      //   }
      // });
      formData.append(key, JSON.stringify(value));
    } else if (typeof value === "object" && value !== null) {
      formData.append(key, JSON.stringify(value));
    } else if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  return formData;
}

export function isDiffObj<T>(original: T[] = [], diff: T[] = []): boolean {
  if (!Array.isArray(original) || !Array.isArray(diff)) return true;
  if (original.length !== diff.length) return true;
  if (original.length === 0 && diff.length === 0) return false;

  for (let i = 0; i < original.length; i++) {
    if (!diff.includes(original[i])) return true;
  }
  return false;
}

export function getDiffObj<T extends Record<string, unknown>>(
  original: T,
  diff: Partial<T>
): Partial<T> {
  const changedFields: Partial<T> = {};

  for (const key of Object.keys(diff) as (keyof T)[]) {
    const originalValue = original[key];
    const newValue = diff[key];

    if (newValue === undefined) continue;

    if (Array.isArray(newValue)) {
      if (!Array.isArray(originalValue) || isDiffObj(originalValue, newValue)) {
        changedFields[key] = newValue as T[typeof key];
      }
    } else if (
      !(key in original) ||
      String(originalValue) !== String(newValue)
    ) {
      changedFields[key] = newValue as T[typeof key];
    }
  }

  return changedFields;
}
