import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import TransferForm from '@/lib/TransferForm.svelte';
import { AMOUNT, FROM_ADDRESS, INVALID_TO_ADDRESS, TO_ADDRESS } from './consts';

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
          partialFee: {
            toNumber: vi.fn().mockReturnValue(100000000000),
          },
          weight: 100,
          class: 'normal',
          partialFeeAt: vi.fn().mockResolvedValue(100000000000),
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

describe('TransactionForm', () => {
  beforeEach(() => {
    //vi.resetAllMocks();
  });

  it('enables send button', async () => {
    const ux = render(TransferForm, { props: { fromAddress: FROM_ADDRESS } });

    const sendButton = ux.getByText('Send');

    expect(sendButton).toBeDisabled();

    const toInput = ux.getByPlaceholderText('1UbTddpy3RggGy3nk...');

    expect(toInput.value).equal('');

    const amountInput = ux.getByPlaceholderText('0.05...');

    expect(amountInput.value).equal('');

    await fireEvent.input(toInput, { target: { value: TO_ADDRESS } });

    expect(sendButton).toBeDisabled();

    await fireEvent.input(amountInput, { target: { value: AMOUNT } });

    const feedback = ux.queryByText('Insufficient balance');

    expect(feedback).toBeNull();

    expect(sendButton).toBeEnabled();
  });

  it('disabled send button with incorrect to address', async () => {
    const ux = render(TransferForm, { props: { fromAddress: FROM_ADDRESS } });

    const sendButton = ux.getByText('Send');

    expect(sendButton).toBeDisabled();

    const toInput = ux.getByPlaceholderText('1UbTddpy3RggGy3nk...');

    expect(toInput.value).equal('');

    const amountInput = ux.getByPlaceholderText('0.05...');

    expect(amountInput.value).equal('');

    await fireEvent.input(amountInput, { target: { value: AMOUNT } });
    await fireEvent.input(toInput, { target: { value: INVALID_TO_ADDRESS } });

    expect(sendButton).toBeDisabled();
  });

  it('disabled send transaction with insufficent balance', async () => {
    const ux = render(TransferForm, { props: { fromAddress: FROM_ADDRESS } });

    const toInput = ux.getByPlaceholderText('1UbTddpy3RggGy3nk...');
    const amountInput = ux.getByPlaceholderText('0.05...');

    await fireEvent.input(toInput, { target: { value: TO_ADDRESS } });
    await fireEvent.input(amountInput, { target: { value: AMOUNT * 1000 } });

    await waitFor(() => {
      const insufficientBalance = ux.getByText('Insufficient balance');

      expect(insufficientBalance).toBeDefined();
    });
  });

  it('preview transaction fees', async () => {
    const ux = render(TransferForm, { props: { fromAddress: FROM_ADDRESS } });

    const toInput = ux.getByPlaceholderText('1UbTddpy3RggGy3nk...');
    const amountInput = ux.getByPlaceholderText('0.05...');

    await fireEvent.input(toInput, { target: { value: TO_ADDRESS } });
    await fireEvent.input(amountInput, { target: { value: AMOUNT } });

    await waitFor(() => {
      const fee = ux.getByText('0.1 DOT');

      expect(fee).not.toBeNull();
    });
  });

  it('successful transfer of funds', async () => {
    const ux = render(TransferForm, { props: { fromAddress: FROM_ADDRESS } });

    const toInput = ux.getByPlaceholderText('1UbTddpy3RggGy3nk...');
    const amountInput = ux.getByPlaceholderText('0.05...');

    await fireEvent.input(toInput, { target: { value: TO_ADDRESS } });
    await fireEvent.input(amountInput, { target: { value: AMOUNT } });
    //await fireEvent.click(sendButton);

    //TODO mock extension popup / response
  });
});
