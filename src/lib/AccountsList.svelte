<script lang="ts">
  import { PolkadotService } from '../services/polkadot';
  import { accounts } from '../stores/accounts';
  import type { PolkadotAccount } from '../types/types';
  import { delay } from '../utils/time';

  let polkadotService: PolkadotService;

  (async () => {
    polkadotService = await PolkadotService.getInstance();
  })();

  let accountsValue: PolkadotAccount[] = [];

  accounts.subscribe(async (value) => {
    await delay(500);
    const accs: PolkadotAccount[] = [];

    for (const acc of value) {
      const dotAcc: PolkadotAccount = { ...acc };

      const res = await polkadotService.getBalance(dotAcc.address);

      console.log(res);

      if (!res) continue;

      dotAcc.balance = res.balance;
      dotAcc.symbol = res.symbol;
      accs.push(dotAcc);
    }

    console.log(accs);

    accountsValue = accs;
  });
</script>

<section
  class="space-y-4 max-h-[250px] overflow-auto rounded-lg border-t border-b border-gray-600 p-2 md:p-5 w-full md:w-[105%]"
>
  {#each accountsValue as account}
    <ul
      class="rounded-lg border border-gray-600 p-2 md:p-5 h-full [&>li]:flex [&>li]:justify-between [&>li>span]:font-bold [&>li>span]:md:text-base [&>li>span]:text-xs [&>li>p]:md:text-base [&>li>p]:text-xs w-full"
    >
      <li>
        <span>Address: </span>
        <p class="truncate md:text-ellipsis w-[75%] md:w-full">
          {account.address}
        </p>
      </li>
      <li>
        <span>Name: </span>
        <p>{account.meta.name}</p>
      </li>
      <li>
        <span>Type: </span>
        <p>{account.type}</p>
      </li>
    </ul>
  {/each}
</section>
