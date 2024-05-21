import { Composer } from "../../deps.ts";
import { CHANNEL_ID, GROUP_ID } from "../helpers/constants.ts";
import { finalActionKeyboard } from "../helpers/keyboards.ts";
import { isPollOwner } from "../helpers/utils.ts";
import { isChannelAdmin } from "../helpers/utils.ts";
import { sayName } from "../helpers/utils.ts";

const composer = new Composer();

composer.callbackQuery("discard", async (ctx) => {
  if (!(await isChannelAdmin(ctx) || isPollOwner(ctx))) {
    await ctx.answerCallbackQuery({
      text: "no tienes permiso para esta verga",
    });
  }

  await ctx.editMessageText(
    `quieres borrar la encusta?\nencuesta descartada por ${sayName(ctx)}`,
    {
      reply_markup: finalActionKeyboard,
    },
  );
});

composer.callbackQuery("publish", async (ctx) => {
  await ctx.api.forwardMessage(
    CHANNEL_ID,
    GROUP_ID,
    ctx.callbackQuery.message?.reply_to_message?.message_id || 0,
  );

  const msj = await ctx.api.forwardMessage(
    GROUP_ID,
    GROUP_ID,
    ctx.callbackQuery.message?.reply_to_message?.message_id || 0,
  );

  await ctx.api.pinChatMessage(GROUP_ID, msj.message_id);

  await ctx.api.deleteMessage(
    GROUP_ID,
    ctx.callbackQuery.message?.reply_to_message?.message_id || 0,
  );

  await ctx.answerCallbackQuery({
    text: "You were curious, indeed!",
  });
});

export default composer;
