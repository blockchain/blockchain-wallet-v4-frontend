'use strict'

import Connection from './connection'

var Parser = require('./parser')
var Framer = require('./framer')

function Peer (options, tcp, staticRemote) {
  var self = this

  this.options = options
  this.framer = new Framer(options)
  this.parser = new Parser(options)

  this.conn = new Connection(options, staticRemote)
  this.conn.connect(
    tcp,
    () => { console.log('connected!') },
    () => {
      console.log('handshake completed!')
      this.conn.write(Buffer.from('00100000000108', 'hex')) // TODO hack to send init message
    },
    (data) => { this.parser.feed(data) },
    () => { console.log('closed!') }
  )

  this.parser.on('packet', function (msg) {
    self.emit('packet', msg)
  })
}

Peer.prototype.send = function send (msg) {
  return this.write(msg.cmd, msg.toRaw())
}

Peer.prototype.frame = function frame (cmd, payload) {
  return this.framer.packet(cmd, payload)
}

Peer.prototype.write = function write (cmd, payload) {
  return this.tcp.write(this.frame(cmd, payload))
}

export default Peer
