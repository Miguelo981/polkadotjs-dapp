import type { KeypairType } from '../types/types';

export interface TransactionProps {
  from: string;
  to: string;
  amount: number;
}

export interface InjectedAccountWithMeta {
  address: string;
  meta: {
    genesisHash?: string | null;
    name?: string;
    source: string;
  };
  type?: KeypairType;
}
