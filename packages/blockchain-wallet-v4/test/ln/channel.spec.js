import chai from 'chai'
import * as Channel from '../../src/ln/channel/channel'
import * as State from '../../src/ln/channel/state'
import {fromJS} from 'immutable'
const { expect } = chai

const Long = require('long')

let checkPaymentMessage = (payment, msg) => {
  expect(msg.amountMsat).to.deep.equal(payment.amount)
  expect(msg.paymentHash).to.deep.equal(payment.paymentHash)
  expect(msg.cltvTimeout).to.deep.equal(payment.cltvTimeout)
  expect(msg.onionRoutingPackage).to.deep.equal(payment.onionRoutingPackage)
}

let createChannel = () => {
  let channel = State.Channel()
  channel.phase = Channel.phase.OPEN
  channel.stateLocal.amountMsatLocal = new Long(10000000)
  channel.stateLocal.amountMsatRemote = new Long(10000000)
  channel.stateRemote.amountMsatLocal = new Long(10000000)
  channel.stateRemote.amountMsatRemote = new Long(10000000)
  channel.channelId = Buffer.alloc(32)

  return channel
}

describe('Channel State Machine', () => {
  let channelId = Buffer.alloc(32)
  let channel1, channel2, payment

  let getMsg = (state, index) => state.getIn(['channels', channelId, 'messageOut', index])

  beforeEach(() => {
    channel1 = createChannel()
    channel2 = createChannel()
    payment = State.Payment(new Long('100000'), Buffer.alloc(20), Buffer.alloc(1360), 100)
  })

  describe('Update ADD', () => {
    it('Send', () => {
      let {channel, msg} = Channel.createUpdateAddHtlc(channel1, payment)

      expect(channel.stateRemote.unack[0].msg).to.deep.equal(msg)

      checkPaymentMessage(payment, msg)
      expect(msg.id).to.deep.equal(1)
    })

    it('Receive', () => {
      let response1 = Channel.createUpdateAddHtlc(channel1, payment)

      channel2 = Channel.readUpdateAddHtlc(channel2, response1.msg)

      // The ADD update should be in local unack
      expect(channel2.stateLocal.unack[0].msg).to.deep.equal(response1.msg)

      checkPaymentMessage(payment, response1.msg)
      expect(response1.msg.id).to.deep.equal(1)
    })
  })

  describe('Commit', () => {
    it('Send', () => {
      let response1 = Channel.createUpdateAddHtlc(channel1, payment)
      let response2 = Channel.createCommitmentSigned(response1.channel)

      expect(response2.channel.stateRemote.unack[0].msg).to.deep.equal(response1.msg)
      // TODO check validity of signatures
    })

    it('Receive', () => {
      let response1 = Channel.createUpdateAddHtlc(channel1, payment)
      let response2 = Channel.createCommitmentSigned(response1.channel)

      expect(response2.channel.stateRemote.unack[0].msg).to.deep.equal(response1.msg)
      // TODO check validity of signatures

      channel2 = Channel.readUpdateAddHtlc(channel2, response1.msg)
      channel2 = Channel.readCommitmentSigned(channel2, response2.msg)
      expect(channel2.stateLocal.unack[0].msg).to.deep.equal(response1.msg)
    })
  })

  describe('RevokeAck', () => {
    it('Send', () => {
      let response1 = Channel.createUpdateAddHtlc(channel1, payment)
      let response2 = Channel.createCommitmentSigned(response1.channel)

      expect(response2.channel.stateRemote.unack[0].msg).to.deep.equal(response1.msg)

      channel2 = Channel.readUpdateAddHtlc(channel2, response1.msg)
      channel2 = Channel.readCommitmentSigned(channel2, response2.msg)
      let response3 = Channel.createRevokeAck(channel2)
      // TODO actually test something here
    })

    it('Receive', () => {
      let response1 = Channel.createUpdateAddHtlc(channel1, payment)
      let response2 = Channel.createCommitmentSigned(response1.channel)

      expect(response2.channel.stateRemote.unack[0].msg).to.deep.equal(response1.msg)

      channel2 = Channel.readUpdateAddHtlc(channel2, response1.msg)
      channel2 = Channel.readCommitmentSigned(channel2, response2.msg)
      let response3 = Channel.createRevokeAck(channel2)

      channel1 = Channel.readRevokeAck(channel1, response3.msg)
      // TODO actually test something here
    })
  })
})
