import { User } from "@/types";

declare module "next-auth" {
  interface Session {
    user: User ; // Set the user type to your custom User type
  }
} 
