import { Composer } from "../../deps.ts";
import { GROUP_ID } from "../helpers/constants.ts";
import pollRequestHandler from "../handlers/on-poll-request-handler.ts";

const composer = new Composer();

const inGroup = composer.filter((ctx) => ctx.chat?.id === +GROUP_ID);

inGroup.on(":poll", pollRequestHandler);

export default composer;
