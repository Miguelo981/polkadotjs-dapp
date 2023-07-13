import { ApiPromise, WsProvider } from '@polkadot/api';
import { POLKADOT_TESTNET_WS_PROVIDER, POLKADOT_TRANSFERABLE } from '@/constants';
import { isAddress } from '@polkadot/util-crypto';

import type { TransactionProps } from '@/models/polkadot';
import { isValidAmount, parseAmount } from '@/utils/web3';
import { web3Accounts, web3FromAddress } from '@polkadot/extension-dapp';
import type { Signer, SubmittableExtrinsic, ISubmittableResult } from '@polkadot/api/types';
import { balance, symbol } from '@/stores/accounts';
import type { TokenBalanceResponse, TransactionPreview } from '@/models/token';
import { BN, isHex } from '@polkadot/util';

export class PolkadotService {
  private static instance: PolkadotService;
  api: ApiPromise;

  private constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    const provider = new WsProvider(POLKADOT_TESTNET_WS_PROVIDER);

    this.api = await ApiPromise.create({
      provider,
    });

    const [chain, nodeName, nodeVersion] = await Promise.all([
      this.api.rpc.system.chain(),
      this.api.rpc.system.name(),
      this.api.rpc.system.version(),
    ]);

    console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);

    const [account] = await web3Accounts();

    const res = await this.getBalance(account.address);

    if (!res) return;

    this.setBalance(res);
  }

  private setBalance(tokenBalance: TokenBalanceResponse): void {
    balance.set(tokenBalance.balance);
    symbol.set(tokenBalance.symbol);
  }

  public static getInstance(): PolkadotService {
    if (!PolkadotService.instance) {
      PolkadotService.instance = new PolkadotService();
    }
    return PolkadotService.instance;
  }

  public async getBalance(address: string): Promise<TokenBalanceResponse> {
    if (!this.api || !isAddress(address)) return;

    const { data } = await this.api.query.system.account(address);

    const formattedBalance = this.api.createType('Balance', data.free).toHuman();
    const [tokenBalance, symbol] = formattedBalance.toString().split(' ');

    return {
      balance: Number(tokenBalance),
      reserved: data.reserved.toNumber(),
      symbol,
    };
  }

  public async getChainDecimals(): Promise<number> {
    const chainDecimals = this.api.registry.chainDecimals[0];

    return chainDecimals;
  }

  public async getChainSymbol(): Promise<string> {
    if (!this.api) return;

    const chain = await this.api.rpc.system.chain();

    return chain.toString();
  }

  public async calcFee(
    from: string,
    tx: SubmittableExtrinsic<'promise', ISubmittableResult>
  ): Promise<BN> {
    if (!this.api) return;

    const { partialFee } = await tx.paymentInfo(from);

    return new BN(partialFee);
  }

  public async previewTransfer({
    from,
    to,
    amount,
  }: TransactionProps): Promise<TransactionPreview> {
    if (!this.api) return;

    if (!isAddress(from) || !isAddress(to) || !isValidAmount(amount)) return;

    const parsedAmount = parseAmount(amount);

    const tx = await this.api.tx.balances.transfer(to, parsedAmount);

    const fee = await this.calcFee(from, tx);

    return {
      fee: Number(fee) / POLKADOT_TRANSFERABLE,
      total: Number(parsedAmount) + Number(fee) / POLKADOT_TRANSFERABLE,
    };
  }

  public async transfer({ from, to, amount }: TransactionProps): Promise<any> {
    if (!this.api) return;

    if (!isAddress(from) || !isAddress(to) || !isValidAmount(amount)) return;

    const parsedAmount = parseAmount(amount);
    const signer: Signer = (await web3FromAddress(from)).signer;

    const tx = await this.api.tx.balances.transfer(to, parsedAmount);

    try {
      const hash = await tx.signAndSend(from, { signer });

      console.log('Transfer sent with hash', hash.toHex(), hash);
      return hash;
    } catch (error) {
      console.log(error);
    }
  }

  public async previewStoreData(from: string, data: any): Promise<TransactionPreview> {
    if (!this.api || !isAddress(from)) return;

    const parsedData = JSON.stringify(data);

    const tx = this.api.tx.system.remark(parsedData);
    const fee = await this.calcFee(from, tx);

    return {
      fee: Number(fee) / POLKADOT_TRANSFERABLE,
      total: Number(fee) / POLKADOT_TRANSFERABLE,
    };
  }

  public async storeData(from: string, data: any): Promise<any> {
    if (!this.api) return;

    const signer: Signer = (await web3FromAddress(from)).signer;

    //const parsedData = JSON.stringify(data);

    const tx = this.api.tx.system.remark(data);

    try {
      const txHash = await tx.signAndSend(from, { signer });

      console.log('Transaction sent. Hash:', txHash.toHex());

      return txHash;
    } catch (error) {
      console.log(error);
    }
  }

  public async getBlockDataByHash<T>(blockHash: string): Promise<T> {
    if (!this.api || !isHex(blockHash)) return;

    const block = await this.api.rpc.chain.getBlock(blockHash);
    const mablock = block.block.extrinsics[2];

    const content = mablock.method.toHuman().args?.remark;

    return typeof content === 'string' ? JSON.parse(content) : content;
  }
}
