import { Context } from "../../deps.ts";
import { GROUP_ID } from "../helpers/constants.ts";

export default async (ctx: Context) => {
  const fwd = await ctx.forwardMessage(GROUP_ID);

  await ctx.api.pinChatMessage(GROUP_ID, fwd.message_id);
};
