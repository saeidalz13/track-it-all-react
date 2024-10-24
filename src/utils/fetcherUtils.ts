import { StatusCodes } from "http-status-codes";

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
    timeout: number = 5000,
    contentType: string = "application/json"
  ): Promise<Response> {
    return fetch(url, {
      method: HttpMethods.POST,
      body: JSON.stringify(data),
      headers: { "Content-Type": contentType },
      signal: AbortSignal.timeout(timeout),
      credentials: credentials,
    });
  }

  public static patchData<T>(
    url: string,
    data: T,
    credentials: Credentials = "include",
    timeout: number = 5000
  ): Promise<Response> {
    return fetch(url, {
      method: HttpMethods.PATCH,
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
  ): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = fetch(url, {
        method: "GET",
        headers: { "Content-Type": contentType },
        credentials: credentials,
        signal: controller.signal,
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }

  public static deleteData(
    url: string,
    credentials: Credentials = "include",
    timeout: number = 5000,
    contentType: string = "application/json"
  ) {
    return fetch(url, {
      method: HttpMethods.DELETE,
      headers: { "Content-Type": contentType },
      credentials: credentials,
      signal: AbortSignal.timeout(timeout),
    });
  }
}

export interface FetchErrorModalContent {
  title: string;
  body: string;
}

export class FetchError extends Error {
  private statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }

  fetchModalContent(): FetchErrorModalContent {
    switch (this.statusCode) {
      case StatusCodes.INTERNAL_SERVER_ERROR:
        return { title: "Server Error", body: this.message };

      case StatusCodes.BAD_REQUEST:
        return { title: "Bad Request", body: "This was an invalid request" };

      case StatusCodes.REQUEST_TOO_LONG:
        return {
          title: "Too Large Content",
          body: "The volume of the file or resource is too large",
        };

      case StatusCodes.NOT_FOUND:
        return { title: "Not Found", body: "This resource was not found" };

      default:
        return { title: "Unexpected Error", body: "Please try again later" };
    }
  }

  public static fetchModalContentUnknownError(): FetchErrorModalContent {
    return {
      title: "Network issue",
      body: "Could not connect to the server. Please try again later",
    };
  }
}
