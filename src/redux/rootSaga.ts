import { all } from 'redux-saga/effects';

import * as zilSagas from './zil/sagas';

function* rootSaga() {
  yield all([
    /* ZIL */
    zilSagas.watchAccessWalletSaga(),
    zilSagas.watchSendTxSaga(),
    zilSagas.watchRunFaucetSaga()
  ]);
}

export default rootSaga;
