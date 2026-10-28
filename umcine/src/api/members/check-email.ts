import { serverClient } from "../server-client";
import type { CheckAvailabilityResponse } from "./models";

function checkEmail(email: string) {
  return serverClient
    .get(`members/email/${encodeURIComponent(email)}`)
    .json<CheckAvailabilityResponse>();
}

export { checkEmail };