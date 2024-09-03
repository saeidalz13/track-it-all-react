type Credentials = "omit" | "include" | "same-origin";

enum HttpMethods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
  OPTIONS = "OPTIONS",
  HEAD = "HEAD",
}

export class DataFetcher {
  public static postData<T>(
    url: string,
    data: T,
    credentials: Credentials = "include",
    timeout: number = 5000
  ): Promise<Response> {
    return fetch(url, {
      method: HttpMethods.POST,
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(timeout),
      credentials: credentials,
    });
  }

  public static getData(
    url: string,
    credentials: Credentials = "include",
    timeout: number = 5000,
    contentType: string = "application/json"
  ) {
    return fetch(url, {
      method: HttpMethods.GET,
      headers: { "Content-Type": contentType },
      credentials: credentials,
      signal: AbortSignal.timeout(timeout),
    });
  }
}
