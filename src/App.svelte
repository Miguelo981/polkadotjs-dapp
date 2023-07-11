<script lang="ts">
  import AccountList from "./lib/AccountsList.svelte";
  import Balance from "./lib/Balance.svelte";
  import ConnectionModal from "./lib/ConnectionModal.svelte";
  import TransferForm from "./lib/TransferForm.svelte";
</script>

<main>
  <ConnectionModal />
  <section class="grid justify-items-center items-center h-screen w-screen">
    <div class="flex flex-col items-center space-y-12">
      <Balance />
      <!-- <AccountList /> -->
      <TransferForm />
    </div>
  </section>
</main>
