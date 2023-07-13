<script lang="ts">
  import Snackbar, { Label as LabelSnackbar } from '@smui/snackbar';
  import { POLKADOT_DECIMALS } from '../constants';
  import { PolkadotService } from '../services/polkadot';
  import TxPreview from './TxPreview.svelte';
  import { isValidAmount } from '../utils/web3';
  import { isAddress } from '@polkadot/util-crypto';

  export let fromAddress: string = '';

  let snackbarSuccess: Snackbar;

  const polkadotService = PolkadotService.getInstance();

  let fee: number = 0.0,
    toAddress = '',
    amount = null,
    insufficientBalance = false;

  const handleToAddress = (event) => {
    const { value } = event.target;

    if (!isAddress(value)) return;

    toAddress = value;

    handleCaclFees();
  };

  const handleAmount = (event) => {
    const { value } = event.target;

    if (
      !(value === '' || value.includes('.') || isValidAmount(value)) ||
      value.length > POLKADOT_DECIMALS
    ) {
      event.target.value = amount;
      return;
    }

    amount = Number(value);

    handleInsufficientBalance();
    handleCaclFees();
  };

  const handleInsufficientBalance = async () => {
    if (!fromAddress || !amount) return;

    const res = await polkadotService.getBalance(fromAddress);

    if (!res) {
      return;
    }

    const { balance } = res;

    insufficientBalance = balance < amount + fee;
  };

  const handleCaclFees = async () => {
    if (!fromAddress || !toAddress || !amount) return;

    const res = await polkadotService.previewTransfer({ from: fromAddress, to: toAddress, amount });

    if (!res) {
      return;
    }

    fee = res.fee;
  };

  const handleSend = async () => {
    const res = await polkadotService.transfer({ from: fromAddress, to: toAddress, amount });

    if (!res) {
      return;
    }

    snackbarSuccess.open();
  };
</script>

<form class="flex flex-col space-y-4 rounded-lg border border-gray-600 p-5 w-[20rem]">
  <div class="flex flex-col">
    <label class="mb-1 text-indigo-300" for="to">To address:</label>
    <input
      class="p-2 rounded-md focus:outline-[0.5px] focus:outline-none focus:outline-indigo-500/50"
      id="to"
      name="to"
      type="text"
      placeholder="1UbTddpy3RggGy3nk..."
      value={toAddress}
      on:input={handleToAddress}
    />
  </div>
  <div class="flex flex-col">
    <label class="mb-1 text-indigo-300" for="amount">Amount:</label>
    <input
      class="p-2 rounded-md focus:outline-[0.5px] focus:outline-none focus:outline-indigo-500/50"
      id="amount"
      name="amount"
      type="text"
      placeholder="0.05..."
      value={amount}
      on:input={handleAmount}
    />
  </div>
  <TxPreview {fee} />
  <button
    disabled={!amount ||
      fromAddress?.length < 1 ||
      toAddress?.length < 1 ||
      !isAddress(toAddress) ||
      insufficientBalance}
    class="border border-transparent py-2 rounded-lg bg-gray-800 disabled:cursor-not-allowed text-white font-medium transition ease-in-out duration-300 hover:border-indigo-500"
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
