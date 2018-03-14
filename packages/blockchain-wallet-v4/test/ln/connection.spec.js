import { expect } from 'chai'
import {Connection} from '../../src/ln/peers/connection'
import {TCP} from './tcp_mock'

describe('Connection Handshake', () => {
  let staticRemote = {}
  staticRemote.pub = Buffer.from('028d7500dd4c12685d1f568b4c2b5048e8534b873319f3a8daa612b469132ec7f7', 'hex')

  let staticLocal = {}
  staticLocal.priv = Buffer.from('1111111111111111111111111111111111111111111111111111111111111111', 'hex')
  staticLocal.pub = Buffer.from('034f355bdcb7cc0af728ef3cceb9615d90684bb5b2ca5f859ab0f0b704075871aa', 'hex')

  let tempLocal = {}
  tempLocal.priv = Buffer.from('1212121212121212121212121212121212121212121212121212121212121212', 'hex')
  tempLocal.pub = Buffer.from('036360e856310ce5d294e8be33fc807077dc56ac80d95d9cd4ddbd21325eff73f7', 'hex')

  let identity = (a) => a

  let handshakeCompleted = false
  let handshakeCompletedCb = () => handshakeCompleted = true

  let closed = false
  let closedCb = () => closed = true

  let messageOut = []
  let messageCb = (m) => messageOut.push(m)

  beforeEach(() => {
    handshakeCompleted = false
    closed = false
    messageOut = []
  })

  describe('Handshake Tests', () => {
    it('transport-initiator successful handshake', () => {
      let tcp = TCP()
      let conn = new Connection({staticLocal}, staticRemote)
      conn.tempLocal = tempLocal

      conn.connect(tcp, handshakeCompletedCb, closedCb)

      expect(tcp.messages[0].toString('hex'))
        .to.equal('00036360e856310ce5d294e8be33fc807077dc56ac80d95d9cd4ddbd21325eff73f70df6086551151f58b8afe6c195782c6a')

      conn.newData(Buffer.from('0002466d7fcae563e5cb09a0d1870bb580344804617879a14949cf22285f1bae3f276e2470b93aac583c9ef6eafca3f730ae', 'hex'))

      expect(tcp.messages[1].toString('hex'))
        .to.equal('00b9e3a702e93e3a9948c2ed6e5fd7590a6e1c3a0344cfc9d5b57357049aa22355361aa02e55a8fc28fef5bd6d71ad0c38228dc68b1c466263b47fdf31e560e139ba')

      expect(handshakeCompleted).to.equal(true)
      expect(closed).to.equal(false)
    })

    it('transport-initiator act2 bad version test', () => {
      let tcp = TCP()
      let conn = new Connection({staticLocal}, staticRemote)
      conn.tempLocal = tempLocal

      conn.connect(tcp, handshakeCompletedCb, closedCb)

      expect(tcp.messages[0].toString('hex'))
        .to.equal('00036360e856310ce5d294e8be33fc807077dc56ac80d95d9cd4ddbd21325eff73f70df6086551151f58b8afe6c195782c6a')

      conn.newData(Buffer.from('0102466d7fcae563e5cb09a0d1870bb580344804617879a14949cf22285f1bae3f276e2470b93aac583c9ef6eafca3f730ae', 'hex'))

      expect(handshakeCompleted).to.equal(false)
      expect(closed).to.equal(true)
    })

    it('transport-initiator act2 bad key serialization test', () => {
      let tcp = TCP()
      let conn = new Connection({staticLocal}, staticRemote)
      conn.tempLocal = tempLocal

      conn.connect(tcp, handshakeCompletedCb, closedCb)

      expect(tcp.messages[0].toString('hex'))
        .to.equal('00036360e856310ce5d294e8be33fc807077dc56ac80d95d9cd4ddbd21325eff73f70df6086551151f58b8afe6c195782c6a')

      conn.newData(Buffer.from('0004466d7fcae563e5cb09a0d1870bb580344804617879a14949cf22285f1bae3f276e2470b93aac583c9ef6eafca3f730ae', 'hex'))

      expect(handshakeCompleted).to.equal(false)
      expect(closed).to.equal(true)
    })

    it('transport-initiator act2 bad MAC test', () => {
      let tcp = TCP()
      let conn = new Connection({staticLocal}, staticRemote)
      conn.tempLocal = tempLocal

      conn.connect(tcp, handshakeCompletedCb, closedCb)

      expect(tcp.messages[0].toString('hex'))
        .to.equal('00036360e856310ce5d294e8be33fc807077dc56ac80d95d9cd4ddbd21325eff73f70df6086551151f58b8afe6c195782c6a')

      conn.newData(Buffer.from('0002466d7fcae563e5cb09a0d1870bb580344804617879a14949cf22285f1bae3f276e2470b93aac583c9ef6eafca3f730af', 'hex'))

      expect(handshakeCompleted).to.equal(false)
      expect(closed).to.equal(true)
    })
  })
  describe('Encryption Tests', () => {
    it('transport-message test', () => {
      let tcp = TCP()
      let conn = new Connection({staticLocal}, staticRemote)
      conn.tempLocal = tempLocal
      conn.tcp = tcp
      conn.ck = Buffer.from('919219dbb2920afa8db80f9a51787a840bcf111ed8d588caf9ab4be716e42b01', 'hex')
      conn.sk = Buffer.from('969ab31b4d288cedf6218839b27a3e2140827047f2c0f01bf5c04435d43511a9', 'hex')
      conn.rk = Buffer.from('bb9020b8965f4df047e07f955f3c4b88418984aadc5cdb35096b9ea8fa5c3442', 'hex')

      for (let i = 0; i < 1002; i++) {
        conn.write(Buffer.from('68656c6c6f', 'hex'))
      }

      expect(tcp.messages[0].toString('hex')).to.equal('cf2b30ddf0cf3f80e7c35a6e6730b59fe802473180f396d88a8fb0db8cbcf25d2f214cf9ea1d95')
      expect(tcp.messages[1].toString('hex')).to.equal('72887022101f0b6753e0c7de21657d35a4cb2a1f5cde2650528bbc8f837d0f0d7ad833b1a256a1')
      expect(tcp.messages[500].toString('hex')).to.equal('178cb9d7387190fa34db9c2d50027d21793c9bc2d40b1e14dcf30ebeeeb220f48364f7a4c68bf8')
      expect(tcp.messages[501].toString('hex')).to.equal('1b186c57d44eb6de4c057c49940d79bb838a145cb528d6e8fd26dbe50a60ca2c104b56b60e45bd')
      expect(tcp.messages[1000].toString('hex')).to.equal('4a2f3cc3b5e78ddb83dcb426d9863d9d9a723b0337c89dd0b005d89f8d3c05c52b76b29b740f09')
      expect(tcp.messages[1001].toString('hex')).to.equal('2ecd8c8a5629d0d02ab457a0fdd0f7b90a192cd46be5ecb6ca570bfc5e268338b1a16cf4ef2d36')
    })
  })
})
