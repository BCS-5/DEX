class CustomDatafeed {
  onReady(callback: any) {
    setTimeout(
      () =>
        callback({
          supported_resolutions: ["1", "5", "15", "30", "60", "D", "W", "M"],
        }),
      0
    );
  }

  resolveSymbol(
    symbolName: string,
    onSymbolResolvedCallback: any,
    onResolveErrorCallback: any
  ) {
    setTimeout(() => {
      // Return some simple symbol information for the TEST symbol
      if (symbolName === "TEST") {
        onSymbolResolvedCallback({
          name: "TEST",
          timezone: "America/New_York",
          minmov: 1,
          minmov2: 0,
          pointvalue: 1,
          session: "24x7",
          has_intraday: false,
          visible_plots_set: "c",
          description: "Test Symbol",
          type: "stock",
          supported_resolutions: ["1", "D", "1M"],
          pricescale: 100,
          ticker: "TEST",
          exchange: "Test Exchange",
          has_daily: true,
          format: "price",
        });
      } else {
        // Ignore all other symbols
        onResolveErrorCallback("unknown_symbol");
      }
    }, 50);
  }

  getBars(
    symbolInfo: any,
    resolution: any,
    periodParams: any,
    onHistoryCallback: any,
    onErrorCallback: any
  ) {
    setTimeout(() => {
      console.log(symbolInfo);
      console.log(resolution);
      console.log(periodParams);
      // For this piece of code only we will only return bars for the TEST symbol
      if (symbolInfo.ticker === "TEST" && resolution === "1D") {
        // We are constructing an array for `countBack` bars.
        const bars = new Array(periodParams.countBack);

        // For constructing the bars we are starting from the `to` time minus 1 day, and working backwards until we have `countBack` bars.
        let time = new Date(periodParams.to * 1000);
        time.setUTCHours(0);
        time.setUTCMinutes(0);
        time.setUTCMilliseconds(0);
        time.setUTCDate(time.getUTCDate() - 1);

        // Fake price.
        let price = 100;

        for (let i = periodParams.countBack - 1; i > -1; i--) {
          bars[i] = {
            open: price,
            high: price + 20,
            low: price - 20,
            close: price - 10,
            time: time.getTime(),
          };

          // Working out a random value for changing the fake price.
          const volatility = 0.1;
          const x = Math.random() - 0.5;
          const changePercent = 2 * volatility * x;
          const changeAmount = price * changePercent;
          price = price + changeAmount;

          // Note that this simple "-1 day" logic only works because the TEST symbol has a 24x7 session.
          // For a more complex session we would need to, for example, skip weekends.
          time.setUTCDate(time.getUTCDate() - 1);
        }

        // Once all the bars (usually countBack is around 300 bars) the array of candles is returned to the library.
        onHistoryCallback(bars);
      } else {
        // If no result, return an empty array and specify it to the library by changing the value of `noData` to true.
        onHistoryCallback([], {
          noData: true,
        });
      }
    }, 50);
  }

  subscribeBars(
    symbolInfo: any,
    resolution: any,
    onRealtimeCallback: any,
    subscriberUID: any,
    onResetCacheNeededCallback: any
  ) {
    // 실시간 데이터 구독을 위해 사용됩니다. 테스트에서는 비활성화합니다.
  }

  unsubscribeBars(subscriberUID: any) {
    // 실시간 데이터 구독 해제. 테스트에서는 비활성화합니다.
  }
}

export default CustomDatafeed;
