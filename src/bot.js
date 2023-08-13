import { Bot, session } from "grammy";
import dotenv from "dotenv";
import { Menu } from "@grammyjs/menu";
import { freeStorage } from "@grammyjs/storage-free";

dotenv.config();
const bot = new Bot(process.env.BOT_TOKEN);

await bot.api.setMyCommands([
  { command: "help", description: "Como se usa esto" },
]);

bot.use(
  session({
    initial: () => ({
      encuestas: [],
      currentIndex: null,
      admins: null,
      off: true, storage: freeStorage(process.env.BOT_TOKEN)
    }),
  })
);

bot.command("start", (ctx) => {
  switch (ctx.chat.id) {
    case -1001661296776: //chat de encuestas xxx
      ctx.reply(
        "Envia una encuesta en el siguiente formato:\n\nEl texto de la pregunta \n\n-cada opción en una nueva linea \n-que empiece por un guion o un punto\n-debe tener al menos dos opcions\n-y terminar con el hashtag \n\n#encuesta"
      );
      break;
    case -1334523130: //canal
      ctx.reply("No hago nada aqui, solo reenvio las encuestas");
      break;
    default:
      ctx.reply(`${ctx.chat.id}`);
      //ctx.reply(`Bot creado por @hojas_adrian, y no hace nada aqui`)
      break;
  }
});

bot.command("help", (ctx) =>
  ctx.reply(
    "Envia una encuesta en el siguiente formato:\n\nEl exto de la pregunta \n\n-cada opcion en una nueva linea \n-que empiece por un guion o un punto\n-debe tener al menos dos opcions\n-y terminar con el hashtag #encusta"
  )
);

bot.on(":poll", async (ctx) => {
  //if (ctx.chat.id == -1001661296776) { //chat de encuestas xxx
  //reply con boton
  //aceptar enviar cancelar enviar
  //}
  if (ctx.chat.id == -1334523130) {
    //canal de encuestas
    const forwared = await ctx.forwardMessage(-1001661296776); //grupo xxx
    ctx.pinChatMessage(forwared.message_id);
  }
});

bot.use(async (ctx, next) => {
  if (ctx.chat.id == -1001661296776) {
    //chat de encuestas xxx
    if (ctx.session.admins == null) {
      bot.api.raw
        .getChatAdministrators({
          chat_id: `-1334523130`, //canal
        })
        .then((x) => {
          ctx.session.admins = x.map((admin) => admin.user.id);
          ctx.session.off = false;
          next();
        })
        .catch(() => {
          ctx.session.off = true;
          return;
        });
    }
  }
});

bot.command("alive", (ctx) => {
  let mensaje = (ctx.session.off == true) ? "🛑 el bot está offlinee" : "✅ alive";
  ctx.reply(mensaje);
});

const inlineKeyboard = new Menu("menu")
  .text(
    {
      text: "✅ publicar",
      payload: async (ctx) => `${await ctx.session.currentIndex}`,
    },
    async (ctx) => {
      const index = ctx.match;
      const data = ctx.session.encuestas[index];
      if (!ctx.session.admins.includes(ctx.from.id)) {
        await ctx.answerCallbackQuery({
          text: "Debes ser admin del canal para poder publicar la encuesta",
        });
        return;
      }

      await ctx.menu.close({ immediate: true });
      await bot.api.raw.sendPoll({
        chat_id: `-1334523130`, //canal
        question: `Encuesta de ${data.user}:\n${data.caption}`,
        options: data.options,
        is_anonymous: false,
      });

      await ctx.editMessageText(
        `${ctx.callbackQuery.message.text.replace(
          "#pendiente",
          ""
        )} ✅ Encuesta aceptada por ${
          ctx.from.username ? "@" + ctx.from.username : ctx.from.first_name
        }`
      );
      await ctx.answerCallbackQuery({ text: "La encuesta fue publicada" });
    }
  )
  .text(
    {
      text: "❌ eliminar",
      payload: async (ctx) => `${await ctx.session.currentIndex}`,
    },
    async (ctx) => {
      const index = ctx.match;
      const data = ctx.session.encuestas[index];
      if (data.id == ctx.from.id || ctx.session.admins.includes(ctx.from.id)) {
        await ctx.menu.close({ immediate: true });
        ctx.session.encuestas[index] = null;
        await ctx.editMessageText(
          `🗑 Encuesta descartada por ${
            ctx.from.username ? "@" + ctx.from.username : ctx.from.first_name
          }`
        );
        await ctx.answerCallbackQuery({
          text: `🗑 eliminaste la encuesta`,
        });
      } else {
        await ctx.answerCallbackQuery({
          text: `Debes ser administrador o el creador de la encuesta para poder borrarla`,
        });
      }
    }
  );

bot.use(inlineKeyboard);

bot.hears(/#encuesta/, async (ctx) => {
  const request = ctx.message.text;
  const clear = request
    .split("\n")
    .map((element) => element.trim())
    .filter((element) => element !== "" && !element.startsWith("#"));

  const captionIndex = clear.findIndex(
    (element) => /^[-.•°]/.test(element) && clear.indexOf(element) > 0
  );
  const caption = clear.slice(0, captionIndex).join("\n");

  const options = clear
    .slice(captionIndex)
    .filter((element) => /^[-.•°]/.test(element))
    .map((str) => str.slice(1));
  const output = `Solicitud de encuesta de ${
    ctx.from.username ? "@" + ctx.from.username : ctx.from.first_name
  }:\n\n${caption}\n\n${options
    .slice(0, 10)
    .map((item) => "🔘" + item)
    .join("\n")}\n\n#pendiente
  `;

  if (options.length < 2) {
    ctx.reply(
      `⚠️ Las encustas deben tener un formato correcto\n\nConsulte /help`,
      {
        reply_to_message_id: ctx.message.message_id,
      }
    );
    return;
  }

  const encuesta = {
    id: ctx.from.id,
    user: ctx.from.first_name,
    caption: caption,
    options: options,
  };

  for (let i = 0; i < ctx.session.encuestas.length + 1; i++) {
    if (ctx.session.encuestas[i] == null) {
      ctx.session.encuestas[i] = encuesta;
      ctx.session.currentIndex = i;
      break;
    }
  }

  await ctx.reply(output, {
    reply_to_message_id: ctx.message.message_id,
    reply_markup: inlineKeyboard,
  });
});

bot.start();
