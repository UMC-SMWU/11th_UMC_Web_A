import { serverClient } from "../server-client";
import type { MemberRating } from "./models";

type GetMemberRatingsResponse = MemberRating[];

function getMemberRatings(memberId: number) {
  return serverClient
    .get(`members/${memberId}/ratings`)
    .json<GetMemberRatingsResponse>();
}

export { getMemberRatings, type GetMemberRatingsResponse };