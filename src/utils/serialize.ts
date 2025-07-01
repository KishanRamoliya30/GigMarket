export function serializeDoc<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}