import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import TransferForm from '@/lib/TransferForm.svelte';
//import { PolkadotService } from '../services/polkadot';
import { PolkadotServiceMock } from './polkadotjs.mock';

vi.mock('@/services/polkadot', () => {
  return {
    PolkadotSevrice: PolkadotServiceMock,
  };
});

describe('Transaction form', () => {
  /* let polkadotServiceMockInstance: PolkadotServiceMock;

  beforeEach(() => {
    polkadotServiceMockInstance = new PolkadotServiceMock();
    jest.resetModules();
    (PolkadotService as jest.Mock).mockImplementation(() => polkadotServiceMockInstance);
  }); */
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('successful transfer of funds', () => {
    const ux = render(TransferForm);

    expect(ux).toBeDefined();
  });
});
