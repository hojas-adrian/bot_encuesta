import { InlineKeyboard } from "../../deps.ts";

export const voteKey = (voteCount: number) => {
  return new InlineKeyboard()
    .text("❌ descartar", "discard")
    .text(`✅ publicar (${voteCount}/10)`, "publish");
};
