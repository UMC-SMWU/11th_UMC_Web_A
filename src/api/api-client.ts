import ky from "ky";
import { env } from "@/config/env";

const baseUrl = env.apiBaseUrl.endsWith("/")
  ? env.apiBaseUrl
  : `${env.apiBaseUrl}/`;

export const apiClient = ky.create({ baseUrl });
