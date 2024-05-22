import { Context } from "../../deps.ts";
import { setKv } from "../helpers/denoKv.ts";
import { voteKey } from "../helpers/keyboards.ts";
import { sayName, getReplyMessageId, reply } from "../helpers/utils.ts";

export default async (ctx: Context) => {
  if (ctx.message?.poll === undefined || ctx.from === undefined) {
    return;
  }

  const msj = await reply(
    ctx,
    `Solicitud de reenvio de ${sayName(ctx)}\n\n${
      ctx.message?.poll.question
    }\n\n#pendiente
    `,
    getReplyMessageId(ctx),
    voteKey
  );

  await setKv({
    field: "pollMessageId",
    id: msj.message_id,
    value: { count: 0, votes: [] },
  });
};
