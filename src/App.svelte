<script lang="ts">
  import AccountList from './lib/AccountsList.svelte';
  import AccountInfo from './lib/AccountInfo.svelte';
  import ConnectionModal from './lib/ConnectionModal.svelte';
  import TransferForm from './lib/TransferForm.svelte';
  import { accounts, balance, dAppAccepted } from './stores/accounts';
  import { PolkadotService } from './services/polkadot';
  import StoreDataForm from './lib/StoreDataForm.svelte';
  import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
  import { APP_NAME } from './constants';

  const polkadotService = PolkadotService.getInstance();

  let balanceAmount: number = 0.0;
  let chainSymbol: string = 'DOT';
  let address: string = '';

  dAppAccepted.subscribe(async (accepted) => {
    if (!accepted) return;

    await web3Enable(APP_NAME);

    const allAccounts = await web3Accounts();

    accounts.set(allAccounts);
  });

  accounts.subscribe(async (accounts) => {
    if (accounts.length === 0) return;

    const [account] = accounts;

    address = account.address;

    const res = await polkadotService.getBalance(account.address);

    if (!res) return;

    const { balance, symbol } = res;

    balanceAmount = balance;
    chainSymbol = symbol;
  });

  balance.subscribe((value) => {
    balanceAmount = value;
  });
</script>

<main>
  <ConnectionModal />
  <section class="grid justify-items-center items-center h-screen w-screen">
    <div class="flex flex-col items-center space-y-12">
      <AccountInfo {address} {balanceAmount} {chainSymbol} />
      <TransferForm />
      <StoreDataForm />
      <AccountList />
    </div>
  </section>
</main>
