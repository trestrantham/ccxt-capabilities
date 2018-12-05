const ccxt = require("ccxt");

async function capabilities() {
  const headers = [
    "exchange",
    "CORS",
    "publicAPI",
    "privateAPI",
    "cancelOrder",
    "createDepositAddress",
    "createOrder",
    "deposit",
    "fetchBalance",
    "fetchClosedOrders",
    "fetchCurrencies",
    "fetchDepositAddress",
    "fetchMarkets",
    "fetchMyTrades",
    "fetchOHLCV",
    "fetchOpenOrders",
    "fetchOrder",
    "fetchOrderBook",
    "fetchOrders",
    "fetchTicker",
    "fetchTickers",
    "fetchBidsAsks",
    "fetchTrades",
    "withdraw",
    "1m",
    "1h",
    "1d",
    "1M",
    "1y",
    "timeout",
    "rateLimit",
    "# markets",
    "markets + ticker",
    "timestamp",
    "o",
    "h",
    "l",
    "c",
    "v",
  ];

  console.log(headers.join(","));

  await ccxt.exchanges.forEach(async exc => {
    let exchange, data, notes, markets, interval;

    exchange = new ccxt[exc]();

    data = [
      exchange.name,
      exchange.has["CORS"],
      exchange.has["publicAPI"],
      exchange.has["privateAPI"],
      exchange.has["cancelOrder"],
      exchange.has["createDepositAddress"],
      exchange.has["createOrder"],
      exchange.has["deposit"],
      exchange.has["fetchBalance"],
      exchange.has["fetchClosedOrders"],
      exchange.has["fetchCurrencies"],
      exchange.has["fetchDepositAddress"],
      exchange.has["fetchMarkets"],
      exchange.has["fetchMyTrades"],
      exchange.has["fetchOHLCV"],
      exchange.has["fetchOpenOrders"],
      exchange.has["fetchOrder"],
      exchange.has["fetchOrderBook"],
      exchange.has["fetchOrders"],
      exchange.has["fetchTicker"],
      exchange.has["fetchTickers"],
      exchange.has["fetchBidsAsks"],
      exchange.has["fetchTrades"],
      exchange.has["withdraw"],
      exchange.timeframes && exchange.timeframes["1m"] ? true : false,
      exchange.timeframes && exchange.timeframes["1h"] ? true : false,
      exchange.timeframes && exchange.timeframes["1d"] ? true : false,
      exchange.timeframes && exchange.timeframes["1M"] ? true : false,
      exchange.timeframes && exchange.timeframes["1y"] ? true : false,
      exchange.timeout,
      exchange.rateLimit,
    ];

    // # markets
    if (exchange.has["fetchMarkets"]) {
      try {
        await exchange.load_markets();

        markets = exchange.markets;

        data.push(Object.keys(markets).length);
      } catch (e) {
        data.push("error");
        notes = notes + e;
      }
    } else {
      data.push(false);
    }

    // markets+ticker
    data.push(exchange.has["fetchMarkets"] && exchange.has["fetchTicker"]);

    // OHLCV
    if (
      exchange.has["fetchOHLCV"] &&
      exchange.has["fetchMarkets"] &&
      exchange.timeframes &&
      (exchange.markets && Object.keys(exchange.markets) && Object.keys(exchange.markets).length)
    ) {
      try {
        interval = Object.keys(exchange.timeframes)[0];
        ohlcv = await exchange.fetchOHLCV(Object.keys(markets)[0], interval);
        let result = [false, false, false, false, false, false];
        let working = [null, null, null, null, null, null];

        if (ohlcv.length) {
          ohlcv.forEach((x, i) => {
            [0, 1, 2, 3, 4, 5].forEach(i => {
              if (working[i] !== null && x[i] !== null && x[i] !== working[i]) {
                result[i] = true;
              }
            });

            working = x;
          });
        }

        data.push(result);
      } catch (e) {
        data.push("error", "error", "error", "error", "error", "error");
        notes = notes + e;
      }
    } else {
      data.push([false, false, false, false, false, false]);
    }

    // notes
    data.push(notes);

    console.log(data.join(","));
  });
}

return capabilities();
