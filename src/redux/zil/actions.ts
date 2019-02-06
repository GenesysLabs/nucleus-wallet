export const ACCESS_WALLET = 'ACCESS_WALLET';
export const ACCESS_WALLET_SUCCEEDED = 'ACCESS_WALLET_SUCCEEDED';
export const ACCESS_WALLET_FAILED = 'ACCESS_WALLET_FAILED';

export const accessWallet = (privateKey) => ({
  type: ACCESS_WALLET,
  payload: { privateKey }
});

export const CLEAR = 'CLEAR';
export const clear = () => ({
  type: CLEAR
});

export const RUN_FAUCET = 'RUN_FAUCET';
export const RUN_FAUCET_SUCCEEDED = 'RUN_FAUCET_SUCCEEDED';
export const RUN_FAUCET_FAILED = 'RUN_FAUCET_FAILED';

export const runFaucet = (address, token) => ({
  type: RUN_FAUCET,
  payload: { address, token }
});

export const SEND_TX = 'SEND_TX';
export const SEND_TX_SUCCEEDED = 'SEND_TX_SUCCEEDED';
export const SEND_TX_FAILED = 'SEND_TX_FAILED';

export const sendTx = (toAddress, amount, gasPrice) => ({
  type: SEND_TX,
  payload: { toAddress, amount, gasPrice }
});
