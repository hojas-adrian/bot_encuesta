import { Composer } from "../../deps.ts";
import onChannelHandler from "../handlers/on-channel-handler.ts";
import { CHANNEL_ID } from "../helpers/constants.ts";

const composer = new Composer();

const inChannel = composer.filter((ctx) => ctx.chat?.id === +CHANNEL_ID);

inChannel.on("message", onChannelHandler);

export default composer;
