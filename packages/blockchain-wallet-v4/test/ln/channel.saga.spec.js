import { call, put, select } from 'redux-saga/effects'

import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import Long from 'long'
import * as sagas from '../../src/ln/channel/sagas'
import * as A from '../../src/ln/channel/actions'
import {rootOptions} from '../../src/ln/root/selectors'
import {options} from './options'
import {sendMessage} from '../../src/ln/peers/actions'
import TYPE from '../../src/ln/messages/types'
import {
  ACCEPT_CHANNEL, FUNDING_CREATED, FUNDING_LOCKED, FUNDING_SIGNED, FUNDING_TX, getState,
  getTestState, OPEN_CHANNEL
} from './fixtures'
import {phase} from '../../src/ln/channel/channel'
import lnRootReducer from './reducer'
import {onBlock} from '../../src/redux/webSocket/actions'
import {wrapHex} from '../../src/ln/helper'

const wrapAction = (action) => ({ action })

expectSaga.DEFAULT_TIMEOUT = 50
const api = {
  pushTx: () => {},
  getRawTx: () => {}
}
const wallet = {
  send: () => {}
}

const peerSagas = {
  connect: () => {}
}

let sagaUnderTest, state, channelId, channel, peer

const saga = sagas.channelSagas(api, wallet, peerSagas)

describe('Channel Saga', () => {
  beforeEach(() => {
    const testState = getTestState()
    state = testState.state
    channelId = testState.channelId
    channel = testState.channel
    peer = testState.peer.pub

    sagaUnderTest = expectSaga(saga.takeSagas)
      .withReducer(lnRootReducer, state)
      .provide([
        [ matchers.call.fn(wallet.send), FUNDING_TX ],
        [ matchers.call.fn(api.getRawTx), {block_height: 100} ],
        [ select(rootOptions), options ]
      ])
  })

  it('Should open connection and channel', () => {
    return sagaUnderTest
      .dispatch(A.open(peer, Long.fromNumber(1000000)))
      .call(peerSagas.connect, {pubKey: peer})
      .silentRun()
  })

  it('Should send OPEN_CHANNEL', () => {
    return sagaUnderTest
      .withState(state)
      .dispatch(A.open(peer, Long.fromNumber(100000)))
      .call(peerSagas.connect, {pubKey: peer})
      .put.like(wrapAction(sendMessage(peer, {type: TYPE.OPEN_CHANNEL})))
      .silentRun()
  })

  it('Should respond with FUNDING_CREATED', () => {
    channel.phase = phase.SENT_OPEN

    return sagaUnderTest
      .dispatch(A.onMessage(peer, ACCEPT_CHANNEL))
      .put(sendMessage(peer, FUNDING_CREATED))
      .put.like(wrapAction({payload: {phase: phase.SENT_FUNDING_CREATED}}))
      .silentRun()
  })

  it('Should accept FUNDING_SIGNED', () => {
    channel.phase = phase.SENT_OPEN

    return sagaUnderTest
      .dispatch(A.onMessage(peer, ACCEPT_CHANNEL))
      .dispatch(A.onMessage(peer, FUNDING_SIGNED))
      .call(api.pushTx, FUNDING_TX.toString('hex'))
      .silentRun()
  })

  it('Should accept FUNDING_LOCKED', () => {
    channel.phase = phase.SENT_OPEN

    return sagaUnderTest
      .dispatch(A.onMessage(peer, ACCEPT_CHANNEL))
      .dispatch(A.onMessage(peer, FUNDING_SIGNED))
      .dispatch(A.onMessage(peer, FUNDING_LOCKED))
      .put.like(wrapAction({payload: {fundingLockedReceived: true}}))
      .silentRun()
  })

  it('Should not send FUNDING_LOCKED', () => {
    channel.phase = phase.SENT_OPEN

    return sagaUnderTest
      .dispatch(A.onMessage(peer, ACCEPT_CHANNEL))
      .dispatch(A.onMessage(peer, FUNDING_SIGNED))
      .dispatch(A.onMessage(peer, FUNDING_LOCKED))
      .dispatch(onBlock({height: 100}))
      .not.put.like(wrapAction(sendMessage(peer, {type: TYPE.FUNDING_LOCKED})))
      .silentRun()
  })

  it('Should send FUNDING_LOCKED', () => {
    channel.phase = phase.SENT_OPEN

    return sagaUnderTest
      .dispatch(A.onMessage(peer, ACCEPT_CHANNEL))
      .dispatch(A.onMessage(peer, FUNDING_SIGNED))
      .dispatch(A.onMessage(peer, FUNDING_LOCKED))
      .dispatch(onBlock({height: 150}))
      .put.like(wrapAction(sendMessage(peer, {type: TYPE.FUNDING_LOCKED})))
      .silentRun()
  })

  it('Should set Channel to OPEN', () => {
    channel.phase = phase.SENT_OPEN

    return sagaUnderTest
      .dispatch(A.onMessage(peer, ACCEPT_CHANNEL))
      .dispatch(A.onMessage(peer, FUNDING_SIGNED))
      .dispatch(A.onMessage(peer, FUNDING_LOCKED))
      .dispatch(onBlock({height: 150}))
      .put.like(wrapAction({payload: {phase: phase.OPEN}}))
      .put(A.opened(wrapHex('eb40f508654f7bb7c7c1a39fc1cea6d324dd7e2f7d34c95b7d26b4e8069bb49e')))
      .silentRun()
  })
  it('Should not set Channel to OPEN 1', () => {
    channel.phase = phase.SENT_OPEN

    return sagaUnderTest
      .dispatch(A.onMessage(peer, ACCEPT_CHANNEL))
      .dispatch(A.onMessage(peer, FUNDING_SIGNED))
      .dispatch(A.onMessage(peer, FUNDING_LOCKED))
      .not.put.like(wrapAction({payload: {phase: phase.OPEN}}))
      .not.put.like(wrapAction(A.opened()))
      .silentRun()
  })
  it('Should not set Channel to OPEN 2', () => {
    channel.phase = phase.SENT_OPEN

    return sagaUnderTest
      .dispatch(A.onMessage(peer, ACCEPT_CHANNEL))
      .dispatch(A.onMessage(peer, FUNDING_SIGNED))
      .dispatch(onBlock({height: 150}))
      .not.put.like(wrapAction({payload: {phase: phase.OPEN}}))
      .not.put.like(wrapAction(A.opened()))
      .silentRun()
  })
})
