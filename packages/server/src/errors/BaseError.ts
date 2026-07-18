/**
 * Base error for all custom errors
 *
 * @extends Error
 */
export class BaseError<ContextType = void> extends Error {
  /**
   * Name of error
   */
  public override readonly name: string = "BaseError";

  /**
   * Error message
   */
  public override readonly message: string;

  /**
   * HTTP status code
   */
  public readonly statusCode: number;

  /**
   * Error context
   */
  public readonly context?: ContextType;

  /**
   * @param statusCode HTTP status code
   * @param message Error message
   * @param context Error context
   */
  constructor(statusCode: number, message: string, context?: ContextType) {
    super(message);

    this.message = message;
    this.statusCode = statusCode;
    this.context = context;
  }

  /**
   * Converts fields to a JSON object
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.statusCode,
      context: this.context,
    };
  }
}
