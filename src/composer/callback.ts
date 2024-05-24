import { Composer } from "../../deps.ts";
import onDiscardCallbackHandler from "../handlers/on-discard-callback-handler.ts";
import onPublishCallbackHandler from "../handlers/on-publish-callback-handler.ts";

const composer = new Composer();

composer.callbackQuery("discard", onDiscardCallbackHandler);
composer.callbackQuery("publish", onPublishCallbackHandler);

export default composer;
