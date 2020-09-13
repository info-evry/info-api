import { Drash } from "../deps.ts";

// Data
let levelsDataRaw = Deno.readFileSync("./data/levels.json");
let decoder = new TextDecoder();
let levelsData = decoder.decode(levelsDataRaw);
levelsData = JSON.parse(levelsData);

// API Request -- Levels
export default class EdtResource extends Drash.Http.Resource {
  static paths = ["/edt/"];

  public GET() {
    this.response.body = levelsData;

    return this.response;
  }
}
