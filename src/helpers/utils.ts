import { Context, InlineKeyboard } from "../../deps.ts";
import { CHANNEL_ID } from "./constants.ts";

export const isChannelAdmin = async (
  ctx: Context,
  userId = ctx.from?.id
): Promise<boolean> => {
  const admins = await ctx.api.getChatAdministrators(CHANNEL_ID);

  return admins.some((admin) => {
    admin.user.id === userId;
  });
};

export const isPollOwner = (ctx: Context, userId = ctx.from?.id) => {
  return ctx.callbackQuery?.message?.reply_to_message?.from?.id === userId;
};

export const getUserData = ({ from }: Context) => ({
  name: `${from?.first_name} ${from?.last_name || ""}`,
  userName: from?.username,
  userId: from?.id,
});

export const getReplyMessageId = (ctx: Context, reply = false) => {
  return reply && ctx.message?.reply_to_message
    ? ctx.message.reply_to_message.message_id
    : ctx.message?.message_id;
};

export const sayName = (ctx: Context) => {
  return ctx.from?.username ? `@${ctx.from?.username}` : ctx.from?.first_name;
};

export const reply = async (
  ctx: Context,
  message: string,
  replyMessageId?: number,
  keyboard?: InlineKeyboard
) =>
  await ctx.reply(message, {
    parse_mode: "HTML",
    reply_markup: keyboard,
    reply_parameters: {
      message_id: replyMessageId || 0,
    },
  });

export const sendMessage = async (
  ctx: Context,
  toChatId: string,
  message: string,
  replyMessageId?: number
) =>
  await ctx.api.sendMessage(toChatId, message, {
    parse_mode: "HTML",
    reply_parameters: {
      message_id: replyMessageId || 0,
    },
  });
