require('dotenv').config();

const crypto = require("crypto");
const axios = require("axios");

const SYMBOL = "BTCUSDT";
const BUY_PRICE = 108000.00;
const SELL_PRICE = 108500.00;
const QUANTITY = 0.0001;
const API_KEY = process.env.API_KEY;
const SECRET_KEY = process.env.SECRET_KEY;


const API_URL = "https://testnet.binance.vision";

let isOpened = false;

// Calculo de SMA (Simple Moving Average)
function calcSMA(data) {
  const closes = data.map(candle => parseFloat(candle[4]));
  const sum = closes.reduce((a, b) => a + b);
  return sum / data.length;
}

async function start() {
  // Obtener los últimos 21 datos de 15 minutos
  const { data } = await axios.get(API_URL + `/api/v3/klines?limit=21&interval=15m&symbol=${SYMBOL}`);
  const candle = data[data.length - 1];
  const price = parseFloat(candle[4]);

  console.clear();
  console.log('Price: ', price);

  const sma21 = calcSMA(data);
  console.log('SMA (21): ', sma21);

  console.log('Is Opened? ', isOpened);

  // Preco 10% mais barato
  // if (price <= (sma21 * 0.9) && !isOpened) {
  if (price <= 115000 && !isOpened) {
    // console.log('Comprar');
    isOpened = true;
    newOrder(SYMBOL, QUANTITY, 'buy');
  }
  // Vender com preço 10% mais caro
  else if (price >= (sma21 * 1.1) && isOpened) {
    // console.log('Vender');
    isOpened = false;
    newOrder(SYMBOL, QUANTITY, 'sell')
  }
  else
    console.log('aguardar');
}

async function newOrder(symbol, quantity, side) {
  const order = { symbol, quantity, side };
  order.type = "MARKET";
  order.timestamp = Date.now();

  const signature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(new URLSearchParams(order).toString())
    .digest("hex");

  order.signature = signature;

  try {
    const { data } = await axios.post(
      API_URL + "/api/v3/order",
      new URLSearchParams(order).toString(),
      { headers: { "X-MBX-APIKEY": API_KEY } }
    )
    console.log(data);
  }
  catch (err) {
    console.error(err.response.data);
  }
}

setInterval(start, 3000);

start();
