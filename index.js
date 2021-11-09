const { Telegraf } = require("telegraf");
//const { Composer } = require("micro-bot");

const axios = require("axios");
const token = "1355826812:AAFXvRKMvJblMm03Hc3ToITSDYNS1ANm_Ww";
const apikey =
  "eb6f4b0bd8d38654244b4e638355395f90da3983e4ccf631dbcb8c16ec9882a9";

const bot = new Telegraf(token);

//const bot = new Composer

bot.command("start", (ctx) => {
  const name = ctx.chat.username;
  const message = `
    Hey, ${name}!😁\nLet's skip the chit-chat😋\nchoose the currency you want to know its current price
    `;
  bot.telegram.sendMessage(ctx.chat.id, message, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "price", callback_data: "price" }],
        [{ text: "Coin market cap", url: "https://www.cryptocompare.com/" }],
        [{ text: "Bot info", callback_data: "info" }],
      ],
    },
  });
});

bot.action("price", (ctx) => {
  const message = "Choose the coin, you want to check its price😊";
  ctx.deleteMessage();
  bot.telegram.sendMessage(ctx.chat.id, message, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "BTC", callback_data: "price-BTC" },
          { text: "TRX", callback_data: "price-TRX" },
        ],
        [
          { text: "ETH", callback_data: "price-ETH" },
          { text: "NANO", callback_data: "price-NANO" },
        ],
        [
          { text: "BCH", callback_data: "price-BCH" },
          { text: "ADA", callback_data: "price-ADA" },
        ],
        [
          { text: "ETC", callback_data: "price-ETC" },
          { text: "XMR", callback_data: "price-XMR" },
        ],
        [{ text: "Coin market cap", url: "https://www.cryptocompare.com/" }],
      ],
    },
  });
});

const priceactionlist = [
  "price-BTC",
  "price-TRX",
  "price-ETH",
  "price-NANO",
  "price-ETC",
  "price-ADA",
  "price-XMR",
  "price-BCH",
];

bot.action(priceactionlist, async (ctx) => {
  // console.log(ctx);
  const symbol = ctx.match.split("-")[1];
  //    console.log(symbol);
  try {
    const res = await axios.get(
      `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD,NGN,EUR&api_key=${apikey}`
    );
    const NAIRA = "NGN " + res.data.NGN;
    const DOLLAR = "$ " + res.data.USD;
    const EURO = "EUR " + res.data.EUR;

    // console.log(price);
    ctx.deleteMessage();
    const message = `
    Symbol: ${symbol}
price_in_Naira: ${NAIRA}
price_in_Dollars: ${DOLLAR}
price_in_Euros: ${EURO}
    `;
    bot.telegram.sendMessage(ctx.chat.id, message, {
      reply_markup: {
        inline_keyboard: [[{ text: "price", callback_data: "price" }]],
      },
    });
  } catch (error) {
    console.log(error);
    ctx.reply("Error getting data from the api");
  }
});

bot.action("info", (ctx) => {
  ctx.answerCbQuery();
  bot.telegram.sendMessage(ctx.chat.id, "Bot Info", {
    reply_markup: {
      keyboard: [
        [{ text: "Credits" }, { text: "API" }],
        [{ text: "Remove keyboard" }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
});

bot.hears("Credits", (ctx) => {
  ctx.reply("Bot was created by @Steevgr3y");
});

bot.hears("API", (ctx) => {
  ctx.reply("Bot runs on Cryptocompare API");
});

bot.hears("Remove keyboard", (ctx) => {
  ctx.telegram.sendMessage(ctx.chat.id, "Remove keyboard", {
    reply_markup: {
      remove_keyboard: true,
    },
  });
});

bot.launch((err) => {
  if (err) console.log(`Error connecting to telegram${err}`);
  else console.log("connected to telegram");
});


