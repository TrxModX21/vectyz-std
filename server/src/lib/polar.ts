import { Polar } from "@polar-sh/sdk";
import { config } from "../utils/app.config";

export const polar = new Polar({
  accessToken: config.POLAR_ACCESS_TOKEN as string,
  // We use sandbox for development. In production, you might want to switch this depending on your environment.
  server: config.NODE_ENV === "development" ? "sandbox" : "production",
});
