import Parse from "parse";

let initialized = false;

export function initParse() {
  if (initialized) return;
  const appId = process.env.NEXT_PUBLIC_PARSE_APP_ID;
  const jsKey = process.env.NEXT_PUBLIC_PARSE_JS_KEY;
  const serverURL = process.env.NEXT_PUBLIC_PARSE_SERVER_URL;
  if (!appId || !serverURL) return;
  Parse.initialize(appId, jsKey ?? "");
  Parse.serverURL = serverURL;
  initialized = true;
}

export default Parse;
