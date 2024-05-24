import { Context } from "../../deps.ts";
import { CHANNEL_ID, GROUP_ID } from "../helpers/constants.ts";
import { delKv, getKv, setKv } from "../helpers/denoKv.ts";
import { voteKey } from "../helpers/keyboards.ts";
import { isChannelAdmin, sayName } from "../helpers/utils.ts";

const pollDeleted = async (ctx: Context) => {
  if (!ctx.callbackQuery || !ctx.callbackQuery.message) {
    return;
  }

  await ctx.answerCallbackQuery({
    text: "borraron tu puto mensaje",
  });

  await delKv({
    field: "pollMessageId",
    id: ctx.callbackQuery.message.message_id,
  });
};

const sendPoll = async (ctx: Context) => {
  if (!ctx.callbackQuery || !ctx.callbackQuery.message?.text) {
    return;
  }

  await ctx.answerCallbackQuery("reenviando encuesta");

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

  await ctx.editMessageText(ctx.callbackQuery.message.text);
};

const updateData = async (
  ctx: Context,
  { count, votes }: { count: number; votes: { id: number; user: string }[] }
) => {
  if (!ctx.callbackQuery || !ctx.callbackQuery.message?.text) {
    return;
  }

  setKv({
    field: "pollMessageId",
    id: ctx.callbackQuery.message.message_id,
    value: {
      count: ++count,
      votes: [...votes, { id: ctx.callbackQuery.from.id, user: sayName(ctx) }],
    },
  });

  await ctx.editMessageText(ctx.callbackQuery.message.text, {
    reply_markup: voteKey(count),
  });
};

export default async (ctx: Context) => {
  if (!ctx.callbackQuery || !ctx.callbackQuery.message) {
    return;
  }

  if (!ctx.callbackQuery.message?.reply_to_message) {
    return pollDeleted(ctx);
  }

  const dataPoll = await getKv({
    field: "pollMessageId",
    id: ctx.callbackQuery.message.message_id,
  });

  if (!dataPoll.value) {
    return ctx.answerCallbackQuery("esta encuesta no existe");
  }

  const voted = () => {
    return dataPoll.value?.votes.some((vote) => {
      return vote.id === ctx.from?.id;
    });
  };
  if (voted()) {
    return ctx.answerCallbackQuery("ya tu votaste");
  }

  if (
    (await isChannelAdmin(ctx)) ||
    (dataPoll.value && dataPoll.value.count >= 9)
  ) {
    return await sendPoll(ctx);
  }

  if (dataPoll.value) {
    return updateData(ctx, dataPoll.value);
  }
};
