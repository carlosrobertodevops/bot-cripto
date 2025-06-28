const axios = require("axios");

const SYMBOL = "BTCUSDT";
const BUY_PRICE = 108000.00;
const SELL_PRICE = 108500.00;

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
  const sma13 = calcSMA(data.slice(8));
  console.log('SMA (13): ', sma13);
  console.log('SMA (21): ', sma21);

  console.log('Is Opened? ', isOpened);

  if (sma13 > sma21 && !isOpened) {
    console.log('Comprar');
    isOpened = true;
  }
  else if (sma13 < sma21 && isOpened) {
    console.log('Vender');
    isOpened = false;
  }
  else
    console.log('Esperar');
}

setInterval(start, 3000);

start();
