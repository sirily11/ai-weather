// Import the framework and instantiate it
import Fastify from "fastify";
import { renderVideo } from "./render";
import { v4 } from "uuid";
import path from "path";
import { config } from "dotenv";
import cors from "@fastify/cors";

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
  preHandler: async (request, reply) => {
    const adminKey = process.env.ADMIN_KEY;
    const apiKey = request.headers["x-api-key"];
    if (apiKey !== adminKey) {
      reply.code(401).send({ message: "Unauthorized" });
    }
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
    await fastify.register(cors, {
      origin: "*",
      allowedHeaders: "*",
      methods: "*",
    });

    await fastify.listen({ port: 3000, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();
