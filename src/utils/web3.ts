import { BN, isBn } from '@polkadot/util';
import { POLKADOT_DECIMALS } from '../constants';

export function isValidAmount(amount: string | number): boolean {
  const parsedAmount = parseFloat(amount.toString());

  if (isNaN(parsedAmount)) return false;
  if (parsedAmount <= 0) return false;

  try {
    new BN(amount);

    return true;
  } catch (e) {
    return false;
  }
}

export function parseAmount(amount: string | number, decimals: number = POLKADOT_DECIMALS): BN {
  const parsedValue = fromUnit(amount, decimals);

  console.log(parsedValue);

  if (!isBn(parsedValue)) return;

  return parsedValue;
}

export function fromUnit(inputValue: string | number, decimals: number = POLKADOT_DECIMALS): BN {
  const base = new BN(10).pow(new BN(decimals));
  const [integerPart, decimalPart = ''] = inputValue.toString().split('.');

  const integer = new BN(integerPart);
  const decimal = new BN(decimalPart.padEnd(decimals, '0').slice(0, decimals));

  return integer.mul(base).add(decimal);
}

export function toUnit(inputValue: string | number, decimals: number = POLKADOT_DECIMALS): BN {
  const base = new BN(10).pow(new BN(decimals));
  const dm = new BN(inputValue).divmod(base);

  const result = `${dm.div.toString()}.${dm.mod.toString().padStart(base.toString().length, '0')}`;

  return new BN(result, base.toNumber());
}

/* function toUnit(inputValue: string | number | BN, decimals: number = POLKADOT_DECIMALS): number {
  
  const base = new BN(10).pow(new BN(decimals));
  const dm = new BN(inputValue).divmod(base);

  console.log(dm, dm.div.toString(), dm.mod.toString())

  return parseFloat(dm.div.toString() + "." + dm.mod.toString())
} */
