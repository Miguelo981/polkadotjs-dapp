import type { InjectedAccountWithMeta } from '../models/polkadot';

export type KeypairType = 'ed25519' | 'sr25519' | 'ecdsa' | 'ethereum';

export type PolkadotAccount = {
  balance?: number;
  symbol?: string;
} & InjectedAccountWithMeta;
