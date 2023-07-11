<script lang="ts">
    import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
    import { accounts, dAppAccepted } from "../stores/accounts";
    import { APP_NAME, POLKADOT_DECIMALS } from "../constants";
    import { PolkadotService } from "../services/polkadot";
    import TxPreview from "./TxPreview.svelte";
  import { isValidAmount, parseAmount } from "../utils/web3";

    const polkadotService = PolkadotService.getInstance();

    let fee: number = 0.0, 
    fromAddres = "", 
    toAddress = "", 
    amount = null, 
    insufficientBalance = false;

    dAppAccepted.subscribe(async (accepted) => {
        if (!accepted) return

        await web3Enable(APP_NAME)

        const allAccounts = await web3Accounts();

        accounts.set(allAccounts);
    })

    accounts.subscribe(async (accounts) => {
        if (accounts.length === 0) {
            fromAddres = "";
            toAddress = "";
            return
        }

        const [account] = accounts;

        fromAddres = account.address;
    })

    const handleFromAddres = (event) => {
        // TODO check if valid address
        fromAddres = event.target.value;

        handleCaclFees();
    }

    const handleToAddress = (event) => {
        // TODO check if valid address
        toAddress = event.target.value;

        handleCaclFees();
    }

    const handleAmount = (event) => {
        const { value } = event.target;

        if ((value === '' || value.includes('.') || isValidAmount(value)) && value.length < POLKADOT_DECIMALS) {
            amount = Number(value);
        } else {
            event.target.value = amount
            //amount = null;
        }

        handleInsufficientBalance();
        handleCaclFees();
    }

    const handleInsufficientBalance = async () => {        
        if (!fromAddres || !amount) return

        const { balance } = await polkadotService.getBalance(fromAddres);

        insufficientBalance = balance < amount;
    }

    const handleCaclFees = async () => {
        if (!fromAddres || !toAddress || !amount) return

        const res = await polkadotService.previewTransfer({ from: fromAddres, to: toAddress, amount });

        fee = res.fee;
    }

    const handleSend = async () => {
        console.log(await polkadotService.getBalance(fromAddres))
        const res = await polkadotService.transfer({from: fromAddres, to: toAddress, amount});
        console.log(res)
    }
</script>

<form class="flex flex-col space-y-4 rounded-lg border border-gray-600 p-5 w-[20rem]">
    <div class="flex flex-col">
        <label class="mb-1 text-indigo-300" for="from">From address:</label>
        <input class="p-2 rounded-md focus:outline-[0.5px] focus:outline-none focus:outline-indigo-500/50" id="from" name="from" type="text" placeholder="14W4DeYus5Hz9Cw..." value={fromAddres} on:input={handleFromAddres}>
    </div>
    <div class="flex flex-col">
        <label class="mb-1 text-indigo-300" for="to">To address:</label>
        <input class="p-2 rounded-md focus:outline-[0.5px] focus:outline-none focus:outline-indigo-500/50" id="to" name="to" type="text" placeholder="1UbTddpy3RggGy3nk..." value={toAddress} on:input={handleToAddress}>
    </div>
    <div class="flex flex-col">
        <label class="mb-1 text-indigo-300" for="amount">Amount:</label>
        <input class="p-2 rounded-md focus:outline-[0.5px] focus:outline-none focus:outline-indigo-500/50" id="amount" name="amount" type="text" placeholder="0.05..." value={amount} on:input={handleAmount}>
    </div>
    <TxPreview fee={fee} />
    <button disabled={ !amount || fromAddres?.length < 1 || toAddress?.length < 1 || insufficientBalance } class="border border-transparent py-2 rounded-lg bg-gray-800 disabled:cursor-not-allowed text-white font-medium transition ease-in-out duration-300 hover:border-indigo-500" type="button" on:click={handleSend}>Send</button>
    {#if insufficientBalance}
        <p class="text-red-500 text-sm">Insufficient balance</p>
    {/if}
</form>