import { BaseError } from "./BaseError";

/**
 * 404 Not Found
 */
export class NotFoundError<ContextType> extends BaseError<ContextType> {
  /**
   * Name of error
   */
  public override readonly name: string = "NotFoundError";

  /**
   * @param message Error message
   * @param context Error context
   */
  constructor(requestedField: string = "", context?: ContextType) {
    const message = `Not Found. The requested field: ${requestedField} can't be found at the moment.`;
    super(404, message, context);
  }
}
