import { Context } from "../../deps.ts";
import { adminActionKeyboard } from "../helpers/keyboards.ts";
import { getReplyMessageId, getUserData, reply } from "../helpers/utils.ts";

export default async (ctx: Context) => {
  if (ctx.message?.poll === undefined || ctx.from === undefined) {
    return;
  }

  const user = getUserData(ctx);

  await reply(
    ctx,
    `Solicitud de reenvio de ${
      user.userName ? "@" + user.userName : user.name
    }\n\n${ctx.message?.poll.question}\n\n#pendiente
`,
    getReplyMessageId(ctx),
    adminActionKeyboard,
  );
};
