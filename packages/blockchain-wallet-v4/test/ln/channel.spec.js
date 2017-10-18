import chai from 'chai'
import * as Channel from '../../src/ln/channel'
import * as State from './../../src/ln/state'
import {fromJS} from 'immutable'
const { expect } = chai

const Long = require('long')

let checkPaymentMessage = (payment, msg) => {
  expect(msg.amountMsat).to.deep.equal(payment.amount)
  expect(msg.paymentHash).to.deep.equal(payment.paymentHash)
  expect(msg.cltvTimeout).to.deep.equal(payment.cltvTimeout)
  expect(msg.onionRoutingPackage).to.deep.equal(payment.onionRoutingPackage)
}

let createState = () => {
  let state = State.State()
  let channel = State.Channel()
    .set('phase', Channel.phase.OPEN)
    .setIn(['local', 'amountMsatLocal'], new Long(10000000))
    .setIn(['local', 'amountMsatRemote'], new Long(10000000))
    .setIn(['remote', 'amountMsatLocal'], new Long(10000000))
    .setIn(['remote', 'amountMsatRemote'], new Long(10000000))

  let channelId = Buffer.alloc(32)

  state = state.setIn(['channels', channelId], channel)
  return state
}

describe('Channel State Machine', () => {
  let channelId = Buffer.alloc(32)
  let state1, state2, payment

  let getMsg = (state, index) => state.getIn(['channels', channelId, 'messageOut', index])

  beforeEach(() => {
    state1 = createState()
    state2 = createState()
    payment = State.Payment(new Long('100000'), Buffer.alloc(20), Buffer.alloc(1360), 100)
  })

  describe('Update ADD', () => {
    it('Send', () => {
      state1 = Channel.createUpdateAddHtlc(channelId, state1, payment)

      // The ADD update should be in remote unack
      let msgAdd = getMsg(state1, 0)
      expect(state1.getIn(['channels', channelId, 'remote', 'unack', 0, 'msg'])).to.deep.equal(fromJS(msgAdd))

      checkPaymentMessage(payment.toJS(), msgAdd)
      expect(msgAdd.id).to.deep.equal(new Long('1'))
    })

    it('Receive', () => {
      state1 = Channel.createUpdateAddHtlc(channelId, state1, payment)

      let msgAdd = getMsg(state1, 0)
      state2 = Channel.onUpdateAddHtlc(state2, msgAdd)

      // The ADD update should be in local unack
      expect(state2.getIn(['channels', channelId, 'local', 'unack', 0, 'msg'])).to.deep.equal(fromJS(msgAdd))

      checkPaymentMessage(payment.toJS(), msgAdd)
      expect(msgAdd.id).to.deep.equal(new Long('1'))
    })
  })

  describe('Commit', () => {
    it('Send', () => {
      state1 = Channel.createUpdateAddHtlc(channelId, state1, payment)
      state1 = Channel.createCommitmentSigned(channelId, state1, payment)

      let msgAdd = getMsg(state1, 0)
      expect(state1.getIn(['channels', channelId, 'remote', 'staged', 0, 'msg'])).to.deep.equal(fromJS(msgAdd))
      // TODO check validity of signatures
    })

    it('Receive', () => {
      state1 = Channel.createUpdateAddHtlc(channelId, state1, payment)
      state1 = Channel.createCommitmentSigned(channelId, state1, payment)

      let msgAdd = getMsg(state1, 0)
      let msgCommit = getMsg(state1, 1)
      // TODO check validity of signatures

      state2 = Channel.onUpdateAddHtlc(state2, msgAdd)
      state2 = Channel.onCommitmentSigned(state2, msgCommit)
      expect(state2.getIn(['channels', channelId, 'local', 'staged', 0, 'msg'])).to.deep.equal(fromJS(msgAdd))
    })
  })
})
