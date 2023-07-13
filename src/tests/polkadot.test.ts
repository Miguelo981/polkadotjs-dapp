import { PolkadotService } from '@/services/polkadot';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const FROM_ADDRESS = '5Ct5vgodMUqsJ1LU5R9kxrhF8sY85AybySWBSrqXV96jjFd1';
const INVALID_FROM_ADDRESS = 'GFVDSgsdFGDSGvdfg';
const TO_ADDRESS = '5GZLvVh3T2A82p7FpFLAa493gkc4TmmsMQ2ML7dhwkmKoxEw';
const INVALID_TO_ADDRESS = 'GFVD2SgsdFGDSGv433dfg';
const VALID_BLOCK_HASH = '0xadc04bab468f327b3e40e03bf04d3d8d904e058611f2128513a1e2753c264ba3';
const INVALID_BLOCK_HASH = '1f2128513a1e2753c264ba3';
const AMOUNT = 10;
const INVALID_AMOUNT = -10;

vi.mock('@/services/polkadot', async (importOriginal) => {
  const module: any = await importOriginal();

  return {
    ...module,
    setBalance: vi.fn(),
  };
});

vi.mock('@polkadot/extension-dapp', async (importOriginal) => {
  const module: any = await importOriginal();
  const mockAccounts = [
    {
      address: '5Ct5vgodMUqsJ1LU5R9kxrhF8sY85AybySWBSrqXV96jjFd1',
      meta: {
        name: 'Alice',
        source: 'polkadot-js',
      },
    },
    {
      address: '5GZLvVh3T2A82p7FpFLAa493gkc4TmmsMQ2ML7dhwkmKoxEw',
      meta: {
        name: 'Bob',
        source: 'polkadot-js',
      },
    },
  ];

  return {
    ...module,
    web3Accounts: vi.fn().mockResolvedValue(mockAccounts),
    web3FromAddress: vi.fn().mockResolvedValue({
      sign: vi.fn().mockResolvedValue('mocked-signature'),
    }),
  };
});

vi.mock('@polkadot/api', async (importOriginal) => {
  const module: any = await importOriginal();
  const mockTx = {
    balances: {
      transfer: vi.fn().mockResolvedValue({
        signAndSend: vi.fn().mockResolvedValue({
          toHex: vi.fn().mockReturnValue('mocked-tx-hash'),
        }),
        paymentInfo: vi.fn().mockResolvedValue({
          partialFee: 0.1,
          weight: 100,
          class: 'normal',
          partialFeeAt: vi.fn().mockResolvedValue(0.1),
        }),
      }),
    },
    system: {
      remark: vi.fn(),
    },
  };

  return {
    ...module,
    ApiPromise: {
      ...module.ApiPromise,
      create: vi.fn().mockResolvedValue({
        query: {
          system: {
            account: vi.fn().mockResolvedValue({
              nonce: 0,
              data: {
                free: 1000000000000000,
                reserved: {
                  toNumber: vi.fn().mockReturnValue(100),
                },
                miscFrozen: 0,
                feeFrozen: 0,
              },
            }),
          },
        },
        createType: vi.fn().mockReturnValue({
          toHuman: vi.fn().mockReturnValue('100 DOT'),
        }),
        rpc: {
          system: {
            name: vi.fn().mockResolvedValue('mocked-chain'),
            chain: vi.fn().mockResolvedValue('mocked-chain'),
            version: vi.fn().mockResolvedValue('mocked-version'),
          },
          chain: {
            getBlock: vi.fn().mockResolvedValue({
              block: {
                extrinsics: [
                  {},
                  {},
                  {
                    method: {
                      toHuman: vi.fn().mockReturnValue({
                        args: {
                          remark: {
                            name: 'data',
                            type: 'Bytes',
                            value: {
                              username: 'Alice',
                              message: 'Hello World',
                            },
                          },
                        },
                      }),
                    },
                  },
                ],
              },
            }),
          },
        },
        tx: mockTx,
      }),
    },
  };
});

describe('PolkadotService', () => {
  let polkadotService: PolkadotService;

  beforeEach(() => {
    //vi.resetAllMocks();
    polkadotService = PolkadotService.getInstance();
  });

  it('getBalance should return balance with correct address', async () => {
    const data = await polkadotService.getBalance(FROM_ADDRESS);

    expect(data).toBeDefined();
  });

  it('getBalance should return undefined with invalid address', async () => {
    const data = await polkadotService.getBalance(INVALID_FROM_ADDRESS);

    expect(data).toBeUndefined();
  });

  it('previewTransfer should return fees & total with correct body', async () => {
    const data = await polkadotService.previewTransfer({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      amount: AMOUNT,
    });

    expect(data).toBeDefined();
  });

  it('previewTransfer should return fees & total with incorrect address', async () => {
    const data = await polkadotService.previewTransfer({
      from: INVALID_FROM_ADDRESS,
      to: INVALID_TO_ADDRESS,
      amount: AMOUNT,
    });

    expect(data).toBeUndefined();
  });

  it('previewTransfer should return fees & total with incorrect amount', async () => {
    const data = await polkadotService.previewTransfer({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      amount: INVALID_AMOUNT,
    });

    expect(data).toBeUndefined();
  });

  it('transfer should return fees & total with correct body', async () => {
    const data = await polkadotService.transfer({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      amount: AMOUNT,
    });

    expect(data).toBeDefined();
  });

  it('transfer should return fees & total with incorrect address', async () => {
    const data = await polkadotService.transfer({
      from: INVALID_FROM_ADDRESS,
      to: INVALID_TO_ADDRESS,
      amount: AMOUNT,
    });

    expect(data).toBeUndefined();
  });

  it('transfer should return fees & total with incorrect amount', async () => {
    const data = await polkadotService.transfer({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      amount: INVALID_AMOUNT,
    });

    expect(data).toBeUndefined();
  });

  it('getBlockDataByHash should return signed object with correct block hash', async () => {
    const data = await polkadotService.getBlockDataByHash(VALID_BLOCK_HASH);

    expect(data).toBeDefined();
  });

  it('getBlockDataByHash should return undefined with incorrect block hash', async () => {
    const data = await polkadotService.getBlockDataByHash(INVALID_BLOCK_HASH);

    expect(data).toBeUndefined();
  });

  //TODO storing tests
});
