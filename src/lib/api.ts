type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

async function request<T = unknown>(
  path: string,
  method: Method = "GET",
  body?: unknown
): Promise<T> {
  const headers: HeadersInit = {};
  let bodyPayload: string | undefined;

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    bodyPayload = JSON.stringify(body);
  }

  const res = await fetch(path, { method, headers, body: bodyPayload });
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || `Request failed with status ${res.status}`);
  }

  return json as T;
}

export const api = {
  get: <T = unknown>(path: string) => request<T>(path, "GET"),
  post: <T = unknown>(path: string, body: unknown) =>
    request<T>(path, "POST", body),
  put: <T = unknown>(path: string, body: unknown) =>
    request<T>(path, "PUT", body),
  del: <T = unknown>(path: string, body?: unknown) =>
    request<T>(path, "DELETE", body),
  patch: <T = unknown>(path: string, body: unknown) =>
    request<T>(path, "PATCH", body),
};

export async function uploadFile(
  path: string,
  file: File,
  fieldName = "file"
): Promise<{ url: string; publicId: string }> {
  const fd = new FormData();
  fd.append(fieldName, file);

  const res = await fetch(path, { method: "POST", body: fd });
  const json = await res.json();

  if (!res.ok) throw new Error(json.error || "Upload failed");
  return json;
}
