<script lang="ts">
  import { symbol } from '../stores/accounts';

  export let fee: number;

  let chainSymbol: string = 'DOT';

  symbol.subscribe((value) => {
    chainSymbol = value;
  });
</script>

<div class="flex justify-between">
  <span>Network fees</span>
  <span>{fee} {chainSymbol}</span>
</div>
