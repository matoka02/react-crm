// eslint-disable-next-line no-shadow
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export interface ApiAction {
  endpoint: string;
  method: HttpMethod;
  data?: any;
  filters?: any;
}
