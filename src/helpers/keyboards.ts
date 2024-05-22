import { InlineKeyboard } from "../../deps.ts";

export const voteKey = new InlineKeyboard()
  .text("❌ descartar", "discard")
  .text("✅ publicar (0/10)", "publish");
