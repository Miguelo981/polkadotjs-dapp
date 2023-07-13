<script lang="ts">
  import AccountList from './lib/AccountsList.svelte';
  import AccountInfo from './lib/AccountInfo.svelte';
  import ConnectionModal from './lib/ConnectionModal.svelte';
  import TransferForm from './lib/TransferForm.svelte';
  import { accounts, balance, dAppAccepted } from './stores/accounts';
  import { PolkadotService } from './services/polkadot';
  import StoreDataForm from './lib/StoreDataForm.svelte';
  import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
  import { APP_NAME, TABS } from './constants';

  const polkadotService = PolkadotService.getInstance();

  let balanceAmount: number = 0.0;
  let chainSymbol: string = 'DOT';
  let address: string = '';
  let tabIndex: number = 0;

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
  <section class="grid justify-items-center pt-16 h-screen w-screen">
    <div class="flex flex-col items-center space-y-12">
      <AccountInfo {address} {balanceAmount} {chainSymbol} />
      <section class="w-full md:w-[500px]">
        <nav>
          <ul class="flex gap-4 pb-2 px-3 mb-5 border-b border-gray-600">
            {#each TABS as tab, index}
              <li class="">
                <a
                  on:click={() => (tabIndex = index)}
                  class={'border-b-2 pb-2 ' +
                    (tabIndex === index ? 'border-indigo-500' : 'border-transparent')}
                  role="button"
                  tabindex={1}
                >
                  <span
                    class={'hover:text-indigo-500 duration-100 transition ease-in-out ' +
                      (tabIndex === index ? 'text-indigo-500' : 'text-indigo-500/50')}
                    >{tab.name}</span
                  >
                </a>
              </li>
            {/each}
          </ul>
        </nav>
        <div class="flex justify-center">
          {#if tabIndex === 0}
            <TransferForm fromAddress={address} />
          {:else if tabIndex === 1}
            <StoreDataForm fromAddress={address} />
          {/if}
        </div>
      </section>
      <AccountList />
    </div>
  </section>
</main>
