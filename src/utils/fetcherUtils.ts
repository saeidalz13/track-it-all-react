export class DataFetcher {
  public static withMethodPost<T>(url: string, data: T): Promise<Response> {
    return fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(5000),
    });
  }
}
