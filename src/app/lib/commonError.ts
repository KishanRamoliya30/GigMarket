export class ApiError extends Error {
  status: number;
  allErrors?: Record<string, string[]>;

  constructor(message: string, status: number = 500, allErrors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.allErrors = allErrors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
