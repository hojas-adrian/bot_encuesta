import { Composer } from "../../deps.ts";
import { CHANNEL_ID, GROUP_ID } from "../helpers/constants.ts";
import { delKv, getKv, setKv } from "../helpers/denoKv.ts";
import { voteKey } from "../helpers/keyboards.ts";
import { isPollOwner, isChannelAdmin, sayName } from "../helpers/utils.ts";

const composer = new Composer();

composer.callbackQuery("discard", async (ctx) => {
  if (!((await isChannelAdmin(ctx)) || isPollOwner(ctx))) {
    await ctx.answerCallbackQuery({
      text: "no tienes permiso para esta verga",
    });
  }

  await ctx.deleteMessage();
});

composer.callbackQuery("publish", async (ctx) => {
  if (!ctx.callbackQuery.message) {
    return;
  }

  if (!ctx.callbackQuery.message?.reply_to_message) {
    await ctx.answerCallbackQuery({
      text: "borraron tu puto mensaje",
    });

    return await delKv({
      field: "pollMessageId",
      id: ctx.callbackQuery.message.message_id,
    });
  }

  const dataPoll = await getKv({
    field: "pollMessageId",
    id: ctx.callbackQuery.message.message_id,
  });

  if (dataPoll.value && dataPoll.value.count >= 9) {
    await ctx.api.forwardMessage(
      CHANNEL_ID,
      GROUP_ID,
      ctx.callbackQuery.message?.reply_to_message?.message_id || 0
    );

    const msj = await ctx.api.forwardMessage(
      GROUP_ID,
      GROUP_ID,
      ctx.callbackQuery.message?.reply_to_message?.message_id || 0
    );

    await ctx.api.pinChatMessage(GROUP_ID, msj.message_id);

    await ctx.api.deleteMessage(
      GROUP_ID,
      ctx.callbackQuery.message?.reply_to_message?.message_id || 0
    );
  }

  if (dataPoll.value) {
    setKv({
      field: "pollMessageId",
      id: ctx.callbackQuery.message.message_id,
      value: {
        count: ++dataPoll.value.count,
        votes: [...dataPoll.value.votes, ctx.callbackQuery.from.id],
      },
    });

    ctx.editMessageText(
      ` +1 ${ctx.callbackQuery.message.text}\n${sayName(ctx)}`,
      {
        reply_markup: voteKey,
      }
    );
  }

  await ctx.answerCallbackQuery({
    text: "You were curious, indeed!",
  });
});

export default composer;
