import { Drash } from "https://deno.land/x/drash@v1.2.3/mod.ts";
import { Edt } from "./edt.ts";

// Intanciation
const server = new Drash.Http.Server({
  response_output: "application/json",
  resources: [Edt],
  logger: new Drash.CoreLoggers.ConsoleLogger({
    enabled: true,
    level: "all",
    tag_string: "{datetime} | {level} |",
    tag_string_fns: {
      datetime() {
        return new Date().toISOString().replace("T", " ");
      },
    },
  }),
});

// Run
server.run({
  hostname: "localhost",
  port: 1447,
});

console.log("Server listening: http://localhost:1447");
