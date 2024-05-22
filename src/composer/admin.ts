import { Composer } from "../../deps.ts";
import { ADMIN_ID } from "../helpers/constants.ts";

const composer = new Composer();

const admin = composer.filter((ctx) => ctx.chat?.id === +ADMIN_ID);

admin.command("ping", async (ctx) => await ctx.reply("pong"));

export default composer;
//
