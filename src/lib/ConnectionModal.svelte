<script lang="ts">
    import { accounts, dAppAccepted } from "../stores/accounts";
    import ConnectionBtn from "./ConnectionBtn.svelte";
    import Feedback from "./Feedback.svelte";

    export let visible = false;

    accounts.subscribe((accounts) => {
        if (accounts.length > 0) {
            visible = false;
            return
        }

        visible = true;
    })

    dAppAccepted.subscribe((accepted) => {
        visible = !accepted;
    })

</script>

{#if visible}
    <div class="fixed backdrop-blur-md z-40 grid justify-items-center items-center w-full h-screen">
        <div>
            <section class="mb-4 flex flex-col mx-auto rounded-lg border border-gray-600 p-5 max-w-xs">
                <h2 class="text-center text-indigo-500 font-bold mb-5 text-4xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-700">Get started</h2>
                <p class="text-center mb-10">To start using this dApp you need to connect your Polkadot browser wallet.</p>
                <ConnectionBtn />
            </section>
            <Feedback />
        </div>
    </div>
{/if}