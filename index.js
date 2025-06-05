
const axios = require("axios");

const SYMBOL = "BTCUSDT";
const BUY_PRICE = 101700.00;
const SELL_PRICE = 101619.05;

const API_URL = "https://testnet.binance.vision";

let isOpened = false;

async function start() {
  const { data } = await axios.get(API_URL + `/api/v3/klines?limit=21&interval=15m&symbol=${SYMBOL}`);
  const candle = data[data.length - 1];
  const price = parseFloat(candle[4]);

  console.clear();
  console.log('Price: ', price);

  if (price <= BUY_PRICE && !isOpened) {
    console.log('Comprar');
    isOpened = true;
  }
  else if (price >= SELL_PRICE && isOpened) {
    console.log('Vender');
    isOpened = false;
  }
  else
    console.log('Esperar');

}

setInterval(start, 3000);

start();
