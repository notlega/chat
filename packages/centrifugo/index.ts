export class CentrifugoError<ContextType = void> extends Error {
  /**
   * Name of error
   */
  public override readonly name: string = "CentrifugoError";

  /**
   * Error message
   */
  public override readonly message: string;

  /**
   * HTTP status code
   */
  public readonly statusCode: number = 500;

  /**
   * Error context
   */
  public readonly context?: ContextType;

  /**
   * @param message Error message
   * @param context Error context
   */
  constructor(message: string, context?: ContextType) {
    super(message);

    this.message = message;
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

export class Centrifugo {
  private url: URL;
  private apiKey: string;

  constructor(url: string, apiKey: string) {
    this.url = new URL(url);
    this.apiKey = apiKey;
  }

  async publish<T>(channel: string, data: T): Promise<void> {
    const response = await fetch(new URL("/api/publish", this.url), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `apikey ${this.apiKey}`,
      },
      body: JSON.stringify({ channel, data }),
    });

    const body = (await response.json()) as { error?: { message?: string } };

    if (!response.ok || body.error) {
      throw new CentrifugoError(
        body.error?.message ||
          "Unknown error, unable to publish message to channel",
      );
    }
  }
}
