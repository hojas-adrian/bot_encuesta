import { apiThrottler, Bot } from "../deps.ts";
import { BOT_TOKEN } from "./helpers/constants.ts";
import inChannel from "./composer/in-channel.ts";

export const bot = new Bot(BOT_TOKEN);

const throttler = apiThrottler();
bot.api.config.use(throttler);

bot.use(inChannel);

bot.start();
