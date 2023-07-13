import { writable } from 'svelte/store';
import type { InjectedAccountWithMeta } from '../models/polkadot';
import { DAPP_ACCEPTED_STORAGE_KEY } from '../constants';

export const accounts = writable<InjectedAccountWithMeta[]>([]);
export const balance = writable<number>(0.0);
export const symbol = writable<string>('DOT');

const storedDAppAccepted = JSON.parse(localStorage.getItem(DAPP_ACCEPTED_STORAGE_KEY) ?? 'false');

export const dAppAccepted = writable<boolean>(storedDAppAccepted);

dAppAccepted.subscribe((value) => {
  localStorage.setItem(DAPP_ACCEPTED_STORAGE_KEY, value.toString());
});
