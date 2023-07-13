<script lang="ts">
  import Snackbar, { Label as LabelSnackbar } from '@smui/snackbar';
  import { JSONEditor } from 'svelte-jsoneditor';
  import { PolkadotService } from '../services/polkadot';
  import TxPreview from './TxPreview.svelte';

  export let fromAddress: string = '';

  const polkadotService = PolkadotService.getInstance();

  let snackbarSuccess: Snackbar,
    fee: number = 0.0,
    insufficientBalance = false,
    content = {
      text: undefined,
      json: {
        array: [1, 2, 3],
        boolean: true,
        color: '#82b92c',
        null: null,
        number: 123,
        object: { a: 'b', c: 'd' },
        string: 'Hello World',
      },
    };

  const handleInsufficientBalance = async () => {
    if (!fromAddress) return;

    const { balance } = await polkadotService.getBalance(fromAddress);

    insufficientBalance = balance < fee;
  };

  const handleCaclFees = async () => {
    if (!fromAddress) return;

    const res = await polkadotService.previewStoreData(fromAddress, content.text ?? content.json);

    fee = res.fee;
  };

  const handleSend = async () => {
    const res = await polkadotService.storeData(fromAddress, content.text ?? content.json);

    if (!res) {
      return;
    }

    snackbarSuccess.open();
  };
</script>

<form class="flex flex-col space-y-4 rounded-lg border border-gray-600 p-5 w-full">
  <div class="md:w-[500px] jse-theme-dark">
    <JSONEditor
      bind:content
      mode="text"
      navigationBar={false}
      mainMenuBar={false}
      statusBar={false}
      onChange={() => {
        handleCaclFees();
        handleInsufficientBalance();
      }}
    />
  </div>
  <TxPreview {fee} />
  <button
    disabled={fromAddress?.length < 1 || insufficientBalance}
    class="w-full border border-transparent py-2 rounded-lg bg-gray-800 disabled:cursor-not-allowed text-white font-medium transition ease-in-out duration-300 hover:border-indigo-500"
    type="button"
    on:click={handleSend}>Send</button
  >
  {#if insufficientBalance}
    <p class="text-red-500 text-sm">Insufficient balance</p>
  {/if}
  <Snackbar bind:this={snackbarSuccess} class="snackbar-success" timeoutMs={4000}>
    <LabelSnackbar>That thing you tried to do actually worked, if you can believe it!</LabelSnackbar
    >
  </Snackbar>
</form>

<style global>
  @import 'svelte-jsoneditor/themes/jse-theme-dark.css';

  :global(.jse-text-mode, .jse-contents) {
    border: 0.5px solid rgb(75 85 99);
    border-radius: 0.5rem;
  }
</style>
