import { BaseError } from "./BaseError";

/**
 * 500 Internal Server Error
 */
export class InternalServerError<ContextType> extends BaseError<ContextType> {
  /**
   * Name of error
   */
  public override readonly name: string = "InternalServerError";

  /**
   * @param message Error message
   * @param context Error context
   */
  constructor(message?: string, context?: ContextType) {
    super(
      500,
      message ??
        "An unknown internal server error occurred. Please contact the administrator.",
      context,
    );
  }
}
