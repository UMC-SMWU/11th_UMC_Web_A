import { serverClient } from "../server-client";
import type { CheckAvailabilityResponse } from "./models";

function checkNickname(nickname: string) {
  return serverClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<CheckAvailabilityResponse>();
}

export { checkNickname };