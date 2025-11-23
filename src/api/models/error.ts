export class InvalidRequestParameterException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidRequestParameterException";
    Object.setPrototypeOf(this, InvalidRequestParameterException.prototype);
  }
}
