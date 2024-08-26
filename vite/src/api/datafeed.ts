// src/datafeed.ts

export class Datafeed {
  private onRealtimeCallback: Function | null = null;
  private resolution: string;
  private symbol: string;
  constructor() {
    this.onRealtimeCallback = null;
    this.resolution = "1D";
    this.symbol = "BTC";
  }

  onReady(callback: (data: any) => void) {
    setTimeout(() => {
      callback({
        exchanges: ["BTC1123"], // 거래소 목록
        symbols_types: [], // 심볼 타입
        supported_resolutions: ["1", "5", "15", "30", "60", "D", "W"], // 지원하는 간격
      });
    }, 0);
  }

  resolveSymbol(
    _: string,
    onSymbolResolvedCallback: (data: any) => void,
    __: (error: any) => void
  ) {
    // 심볼 정보를 반환합니다.
    const symbolInfo = {
      ticker: "BTC",
      name: "BTC",
      description: "Virtual BTC",
      type: "crypto",
      session: "24x7",
      timezone: "Asia/Seoul",
      has_intraday: true,
      has_no_volume: false,
      supported_resolutions: ["1", "5", "15", "30", "60", "D", "W"],
      data_status: "streaming",
    };

    setTimeout(() => {
      onSymbolResolvedCallback(symbolInfo);
    }, 0);
  }

  getBars(
    symbolInfo: any,
    resolution: any,
    periodParams: any,
    onHistoryCallback: any,
    onErrorCallback: any
  ) {
    // API를 호출하여 데이터를 가져옵니다.
    const url = `https://141.164.38.253:8090/api/history?symbol=${symbolInfo.name}&resolution=${resolution}&from=${periodParams.from}&to=${periodParams.to}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        onHistoryCallback(data, { noData: data.length === 0 });
      })
      .catch((error) => {
        onErrorCallback(error.toString());
      });
  }

  subscribeBars(
    symbolInfo: any,
    resolution: string,
    onRealtimeCallback: (bar: any) => void,
  ) {
    // 실시간 데이터 업데이트를 처리합니다. WebSocket을 연결하는 경우에 사용됩니다.
    this.onRealtimeCallback = onRealtimeCallback;
    this.resolution = resolution;
    this.symbol = symbolInfo.name;

    // const interval = setInterval(() => {
    //   // 예: 서버에 HTTP 요청을 보내서 최신 데이터를 가져옴
    //   const url = `https://141.164.38.253:8090/api/latest?symbol=${symbolInfo.name}&resolution=${resolution}`;
    //   fetch(url)
    //     .then((response) => response.json())
    //     .then((data) => {
    //       // 새로운 데이터를 차트에 업데이트
    //       console.log("realtime: ", data);
    //       onRealtimeCallback(data);
    //     })
    //     .catch((error) => {
    //       console.error("Error fetching data:", error);
    //     });
    // }, 10000); // 10초마다 요청

    // // 구독 해제 시 인터벌을 정리하기 위한 참조를 저장
    // console.log("subscribe", interval);
    // this._intervals[subscriberUID] = interval;
  }

  unsubscribeBars() {
    // 실시간 데이터 구독을 해제합니다.
    // console.log("unsubscribe");
    // clearInterval(this._intervals[subscriberUID]);
    // delete this._intervals[subscriberUID];
  }

  updateData() {
    // 서버로부터 새 데이터를 요청
    const url = `https://141.164.38.253:8090/api/latest?symbol=${this.symbol}&resolution=${this.resolution}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // 새로운 데이터를 차트에 반영
        if (this.onRealtimeCallback !== null) {
          this.onRealtimeCallback(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
}
