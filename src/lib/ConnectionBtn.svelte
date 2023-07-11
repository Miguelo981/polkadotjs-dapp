<script lang="ts">
    import { APP_NAME } from "../constants";
    import { accounts, dAppAccepted } from "../stores/accounts";
    import { web3Enable, web3Accounts, isWeb3Injected } from "@polkadot/extension-dapp";

    //const isWalletEnabled = window.injectedWeb3['polkadot-js']

    const connect = async () => {
        const res = await web3Enable(APP_NAME);

        if (res.length === 0) {
            dAppAccepted.set(false);
            alert("You have to allow the website. Then refresh the page.");
            return;
        }

        dAppAccepted.set(true);

        const allAccounts = await web3Accounts();

        accounts.set(allAccounts);
    }

</script>


<button disabled={!isWeb3Injected} class="mt-auto border border-transparent py-2 rounded-lg bg-gray-800 disabled:cursor-not-allowed text-white font-medium transition ease-in-out duration-300 hover:border-indigo-500" on:click={connect}>Connect wallet</button>
