import { Drash } from "./deps.ts";
import EdtResource from "./resources/edt_resource.ts";

const server = new Drash.Http.Server({
  directory: Deno.realPathSync("./"),
  response_output: "application/json",
  logger: new Drash.CoreLoggers.ConsoleLogger({
    enabled: true,
    level: "debug",
  }),
  resources: [
    EdtResource,
  ],
});

await server.run({
  hostname: "localhost",
  port: 1667,
});

console.log(`Server listening: http://${server.hostname}:${server.port}`);
