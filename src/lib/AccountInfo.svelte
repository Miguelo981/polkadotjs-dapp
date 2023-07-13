<script lang="ts">
  import Snackbar, { Label } from '@smui/snackbar';

  let snackbarSuccess: Snackbar;
  export let balanceAmount, chainSymbol, address;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);

    if (snackbarSuccess.isOpen()) return;

    snackbarSuccess.open();
  };
</script>

<div class="text-center">
  <h2 class="text-4xl md:text-6xl font-black mb-2 pb-5 border-b border-gray-600">
    {balanceAmount.toFixed(4)} <span class="text-2xl md:text-5xl">{chainSymbol}</span>
  </h2>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    on:click={handleCopyAddress}
    class="flex justify-center items-center space-x-1 cursor-pointer"
  >
    <p
      title="Click to copy the address"
      class="font-light truncate md:text-ellipsis w-[75%] md:w-full"
    >
      {address}
    </p>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-6 h-auto"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="#fff"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" />
      <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
    </svg>
  </div>
  <Snackbar bind:this={snackbarSuccess} class="snackbar-success" timeoutMs={4000}>
    <Label>Copied to clipboard</Label>
  </Snackbar>
</div>
