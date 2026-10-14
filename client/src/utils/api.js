export async function apiRequest(
  path,
  { method = "GET", token, body, signal, onUnauthorized } = {},
) {
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  let response;

  try {
    response = await fetch(`/api${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;

    throw new Error("Unable to connect to the server. Please try again.", {
      cause: error,
    });
  }

  if (response.status === 401 && token) {
    onUnauthorized?.();

    const error = new Error("Session expired. Please login again.");
    error.status = 401;
    throw error;
  }

  const text = await response.text();
  let result = null;

  if (text) {
    try {
      result = JSON.parse(text);
    } catch {
      throw new Error("Received an unexpected response from the server.");
    }
  }

  if (!response.ok) {
    const error = new Error(
      result?.message || `Request failed (${response.status})`,
    );

    error.status = response.status;
    throw error;
  }

  return result;
}
