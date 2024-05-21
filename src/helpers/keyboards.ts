import { InlineKeyboard } from "../../deps.ts";

export const adminActionKeyboard = new InlineKeyboard()
  .text("❌ descartar", "discard")
  .text("✅ publicar", "publish");

export const finalActionKeyboard = new InlineKeyboard()
  .text("🔙 restaurar", "restore")
  .text("🗑️ borrar", "delete");
