interface Window {
  ethereum: Eip1193Provider;
}

export interface PoolData {
  volume: number;
  fee: number;
  apr?: number;
}
