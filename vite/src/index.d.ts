interface Window {
  ethereum: Eip1193Provider;
}

interface Position {
  trader: string;
  baseToken: string;
  isLong: boolean;
  margin: bigint;
  openNotional: bigint;
  positionHash: string;
  positionSize: bigint;
  time: number;
}

interface Order {
  trader: string;
  baseToken: string;
  isLong: boolean;
  margin: bigint;
  openNotional: bigint;
  positionHash: string;
  positionSize: bigint;
  time: number;
}

interface History {
  type: string;
  margin: bigint;
  positionSize: bigint;
  openNotional: bigint;
  isLong: boolean;
  blockNumber: number;
  transactionHash: string;
}

interface Liquidity {
  poolName: string;
  amount: bigint;
  locked: bigint;
  earndFees: bigint;
  unClaimedFees: bigint;
}

export interface PoolData {
  volume: number;
  fee: number;
  apr?: number;
}
