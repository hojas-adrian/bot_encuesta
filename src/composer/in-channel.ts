import { Composer } from "../../deps.ts";
import onChannelHandler from "../handlers/on-channel-handler.ts";
import { CHANNEL_ID } from "../helpers/constants.ts";

const composer = new Composer();

const inChannel = composer.filter((ctx) => ctx.chat?.id === +CHANNEL_ID);

inChannel.on(["message", "poll"], async (ctx) => {
  const fwd = await ctx.forwardMessage(GROUP_ID);

  await ctx.api.pinChatMessage(GROUP_ID, fwd.message_id);
});

export default composer;
