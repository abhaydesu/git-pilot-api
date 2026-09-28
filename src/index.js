// Local development entry point. Vercel uses src/server.js (no listen()).
import app from "./app.js";
import { config, assertConfig } from "./config.js";

assertConfig();
app.listen(config.port, () => {
  console.log(`git-pilot-api listening on http://localhost:${config.port}`);
});
