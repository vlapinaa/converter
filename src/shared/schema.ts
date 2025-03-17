export interface Coin {
  id: number;
  symbol: string;
  name: string;
}

export interface Conversion {
  rate: number;
  estimatedAmount: number;
}
