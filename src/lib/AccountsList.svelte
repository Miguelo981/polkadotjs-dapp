<script lang="ts">
  import type { InjectedAccountWithMeta } from "../models/polkadot";
  import { accounts } from "../stores/accounts";

    let accountsValue: InjectedAccountWithMeta[] = []

    accounts.subscribe((value) => {
		  accountsValue = value;
	  });
    
</script>

{#each accountsValue as account}
    <ul>
        <li>{account.address}</li>
        <li>{account.meta.name}</li>
        <li>{account.type}</li>
    </ul>
{/each}