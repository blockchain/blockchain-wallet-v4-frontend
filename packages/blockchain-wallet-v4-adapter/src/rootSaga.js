import { all, call, fork } from 'redux-saga/effects'
import componentSaga from './components/sagas'
import dataSaga from './data/sagas'

const welcomeSaga = function * () {
  // if (console) {
  //   const version = '4.0.0.0'
  //   const style1 = 'background: #F00; color: #FFF; font-size: 24px;'
  //   const style2 = 'font-size: 18px;'
  //   console.log('=======================================================')
  //   console.log(`%c Wallet version ${version}`, style2)
  //   console.log('=======================================================')
  //   console.log('%c STOP!!', style1)
  //   console.log('%c This browser feature is intended for developers.', style2)
  //   console.log('%c If someone told you to copy-paste something here,', style2)
  //   console.log('%c it is a scam and will give them access to your money!', style2)
  // }
  console.log('ADAPTER SAGA INIT')
}

export default function * () {
  yield all([
    call(welcomeSaga),
    fork(componentSaga),
    fork(dataSaga)
  ])
}
