import { apiThrottler, Bot } from "../deps.ts";
import { BOT_TOKEN } from "./helpers/constants.ts";
import inChannel from "./composer/in-channel.ts";
import inGroup from "./composer/in-group.ts";
import callback from "./composer/callback.ts";

export const bot = new Bot(BOT_TOKEN);

const throttler = apiThrottler();
bot.api.config.use(throttler);

bot.use(callback);
bot.use(inChannel);
bot.use(inGroup);

bot.start();
