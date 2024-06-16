// Import the framework and instantiate it
import Fastify from "fastify";
import { renderVideo } from "./render";
const fastify = Fastify({
  logger: true,
});

// Declare a route
fastify.get("/", async () => {
  const outputPath = await renderVideo();
  return { outputPath };
});

(async () => {
  // Run the server!
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();
