import { Bot, limit } from "../deps.ts";
import { BOT_TOKEN } from "./helpers/constants.ts";
import inChannel from "./composer/in-channel.ts";
import admin from "./composer/admin.ts";

//restart

export const bot = new Bot(BOT_TOKEN);

bot.use(limit());

bot.use(inChannel);
bot.use(admin);
