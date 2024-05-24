import { Context } from "../../deps.ts";
import { isPollOwner, isChannelAdmin } from "../helpers/utils.ts";

export default async (ctx: Context) => {
  if (!((await isChannelAdmin(ctx)) || isPollOwner(ctx))) {
    await ctx.answerCallbackQuery({
      text: "no tienes permiso para esta verga",
    });
  }

  await ctx.deleteMessage();
};
