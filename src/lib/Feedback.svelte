<script lang="ts">
  import { isWeb3Injected, web3Enable } from '@polkadot/extension-dapp';
  import { dAppAccepted } from '../stores/accounts';
  import { APP_NAME } from '../constants';
  import { writable } from 'svelte/store';

  const errors = writable<string[]>([]);

  if (!isWeb3Injected) {
    dAppAccepted.set(false);
    errors.update((arr) => [
      ...arr,
      '⚠️ No extension installed or the user did not accept the authorization ⚠️',
    ]);
  } else {
    /* else if (!isWeb3Injected && !!window.injectedWeb3) {
        dAppAccepted.set(false);
        errors.update((arr) => [...arr, "⚠️ You have a pending authorization request ⚠️"]);
        console.log(errors)
    } */
    web3Enable(APP_NAME).then((res) => {
      if (res.length === 0) {
        dAppAccepted.set(false);
        errors.update((arr) => [
          ...arr,
          '⚠️ Website is denied or pending, you have to allow it. Then refresh the page. ⚠️',
        ]);
        console.log(errors);
      } else {
        dAppAccepted.set(true);
      }
    });
  }
</script>

{#if $errors.length > 0}
  <ul class="text-center">
    {#each $errors as error}
      <li>
        <small class="text-red-400">{error}</small>
      </li>
    {/each}
  </ul>
{/if}
