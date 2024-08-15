import { IResponse } from "../interfaces";

export class ErrorResponse extends Error {
  public status: number;
  public data: any;
  constructor({ status, message, data }: IResponse) {
    super(message);
    this.status = status;
    this.data = data;
    Object.defineProperty(this, "message", { value: message, enumerable: true });
  }
}
