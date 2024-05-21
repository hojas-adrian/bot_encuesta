import { Bot, limit } from "../deps.ts";
import { BOT_TOKEN } from "./helpers/constants.ts";
import inChannel from "./composer/in-channel.ts";
import inGroup from "./composer/in-group.ts";
import callback from "./composer/callback.ts";

export const bot = new Bot(BOT_TOKEN);

bot.use(limit());

bot.use(callback);
bot.use(inChannel);
bot.use(inGroup);


