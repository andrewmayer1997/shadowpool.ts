import "./observer";
import { watch } from "./observer";
import "node-telegram-bot-api";
import TelegramBot from "node-telegram-bot-api";
import fs from "fs";
import path from "path";

const token = process.env.TOKEN;

const bot = new TelegramBot(token as string, <TelegramBot.ConstructorOptions>{
  polling: false,
});

//@ts-ignore
const clients = path.join(process.env.HOME, ".shadowlogs", "bot-clients.txt");

watch.on("error", async () => {
  if (bot.isPolling()) {
    await bot.stopPolling();
  }

  fs.readFile(clients, async function (err, data) {
    let clients = data.toString().split("\n");
    if (bot.isPolling()) {
      await bot.stopPolling();
    }
    clients.forEach((chatid) => {
      bot.sendMessage(chatid, "Error occured. Shadowpool was restarted!");
    });

    //if (!bot.isPolling()) {
    //  await bot.startPolling();
    //}
  });
});

const botNewBlockNotify = async () => {
  if (bot.isPolling()) {
    await bot.stopPolling();
  }

  fs.readFile(clients, async function (err, data) {
    let clients = data.toString().split("\n");
    if (bot.isPolling()) {
      await bot.stopPolling();
    }
    clients.forEach((chatid) => {
      bot.sendMessage(chatid, "Found new block!");
    });

    //if (!bot.isPolling()) {
    //  await bot.startPolling();
   // }
  });
};

watch.on("block", async () => {
  botNewBlockNotify();
});

bot.onText(/\/start/, (msg, match) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "You have subscribed to pool notifications");
  console.log("Add new client.");
  fs.appendFileSync(clients, msg.chat.id + "\n");
});
