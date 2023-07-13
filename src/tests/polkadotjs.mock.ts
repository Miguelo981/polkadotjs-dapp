import { vi } from 'vitest';

export class PolkadotServiceMock {
  public getBalance = vi.fn().mockResolvedValue({
    balance: 100,
    reserved: 0,
    symbol: 'DOT',
  });

  public previewTransfer = vi.fn().mockResolvedValue({
    fee: 0.1,
    total: 10.1,
  });

  public transfer = vi.fn().mockResolvedValue('txHash');
}

export const polkadotServiceMockInstance = new PolkadotServiceMock();
