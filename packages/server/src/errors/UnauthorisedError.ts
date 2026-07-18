import { BaseError } from "./BaseError";

/**
 * 401 Unauthorised Error
 */
export class UnauthorisedError<ContextType> extends BaseError<ContextType> {
  /**
   * Name of error
   */
  public override readonly name: string = "UnauthorisedError";

  /**
   * @param message Error message
   * @param context Error context
   */
  constructor(context?: ContextType) {
    super(401, "Unauthorised. Please log in to continue.", context);
  }
}
