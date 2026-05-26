import Parse from "parse";

let initialized = false;

export function initParse() {
  if (initialized) return;
  Parse.initialize(
    process.env.NEXT_PUBLIC_PARSE_APP_ID!,
    process.env.NEXT_PUBLIC_PARSE_JS_KEY!,
  );
  Parse.serverURL = process.env.NEXT_PUBLIC_PARSE_SERVER_URL!;
  initialized = true;
}

export default Parse;
