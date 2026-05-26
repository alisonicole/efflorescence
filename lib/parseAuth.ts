import { initParse } from "./parse";
import Parse from "parse";

initParse();

interface GoogleCredentialPayload {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

function decodeJwt(token: string): GoogleCredentialPayload {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    throw new Error("Invalid Google credential token");
  }
}

export async function loginWithGoogle(credential: string): Promise<Parse.User> {
  const payload = decodeJwt(credential);
  const user = await Parse.User.logInWith("google", {
    authData: {
      id: payload.sub,
      id_token: credential,
    },
  });
  // Populate fields on first sign-in
  if (!user.get("name")) {
    user.set("name", payload.name);
    user.set("email", payload.email);
    if (payload.picture) user.set("avatarUrl", payload.picture);
    await user.save();
  }
  return user;
}

export async function signOut(): Promise<void> {
  await Parse.User.logOut();
}

export function getCurrentUser(): Parse.User | null {
  initParse();
  return Parse.User.current() ?? null;
}
