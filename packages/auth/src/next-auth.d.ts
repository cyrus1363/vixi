import { DefaultSession } from "next-auth";
import { AdapterUser as DefaultAdapterUser } from "@auth/core/adapters";

declare module "next-auth" {
  interface User {
    role?: string;
  }

  interface Session {
    user: {
      id?: string;
      role?: string;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser extends DefaultAdapterUser {
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}
