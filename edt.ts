import { Drash } from "https://deno.land/x/drash@v1.2.3/mod.ts";

const apiVersion = "/api/v1";

// Data
let levelsDataRaw = Deno.readFileSync("./data/levels.json");
let decoder = new TextDecoder();
let levelsData = decoder.decode(levelsDataRaw);
levelsData = JSON.parse(levelsData);

// API Request -- Levels
export class Edt extends Drash.Http.Resource {
  static paths = [apiVersion + "/edt"];

  public GET() {
    this.response.body = levelsData;
    return this.response;
  }
}
