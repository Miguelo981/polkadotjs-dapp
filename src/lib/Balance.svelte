<script lang="ts">
    import { balance, symbol } from "../stores/accounts";

    let balanceAmount: number = 0.0;
    let chainSymbol: string = 'DOT';

    balance.subscribe((value) => {
        balanceAmount = value;
    })

    symbol.subscribe((value) => {
        chainSymbol = value;
    })
</script>

<div>
    <h2 class="text-6xl font-black">{ balanceAmount.toFixed(4) } <span class="text-5xl">{ chainSymbol }</span></h2>
</div>