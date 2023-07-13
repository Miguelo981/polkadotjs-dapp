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
  class="space-y-4 max-h-[250px] overflow-auto rounded-lg border-t border-b border-gray-600 p-5 w-[105%]"
>
  {#each accountsValue as account}
    <ul class="rounded-lg border border-gray-600 p-5 h-full [&>li]:flex [&>li]:justify-between">
      <li><span class="font-bold">Address: </span>{account.address}</li>
      <li><span class="font-bold">Name: </span>{account.meta.name}</li>
      <li><span class="font-bold">Type: </span>{account.type}</li>
    </ul>
  {/each}
</section>
