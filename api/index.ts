// Import the framework and instantiate it
import Fastify from "fastify";
import { renderVideo } from "./render";
import { v4 } from "uuid";
import path from "path";
import { config } from "dotenv";

const file = path.join(process.cwd(), ".env");
config({
  path: file,
});

const fastify = Fastify({
  logger: true,
});

// Declare a route
// fastify.post("/", async (request) => {
//   const sessionId = v4();
//
//   const outputPath = await renderVideo(sessionId);
//   return { outputPath };
// });

fastify.route({
  method: "post",
  url: "/",
  schema: {
    body: {
      type: "object",
      required: ["city"],
      properties: {
        city: { type: "string" },
      },
    },
  },
  handler: async (request) => {
    const body = request.body as { city: string };
    const sessionId = v4();

    const url = await renderVideo({
      sessionId,
      city: body.city,
    });

    return { url };
  },
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
