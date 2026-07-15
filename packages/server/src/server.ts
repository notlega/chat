import "dotenv/config";

import { buildApp } from "./app";

(async () => {
  const app = buildApp();
  const host = process.env.ADDRESS;
  const port = parseInt(process.env.PORT, 10);

  app.listen(
    {
      host,
      port,
    },
    (error) => {
      if (error) {
        app.log.error(error);
        process.exit(1);
      }
    },
  );
})();
