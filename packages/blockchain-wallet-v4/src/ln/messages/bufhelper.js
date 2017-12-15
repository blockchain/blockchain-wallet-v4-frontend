import {assertBuffer, assertLong, assertNumber} from '../helper'

const Long = require('long')
const assert = require('assert')

export function BufHelper (buffer) {
  this.buffer = buffer
  this.offset = 0

  this.read = (len) => {
    let v = this.buffer.slice(this.offset, this.offset + len)
    this.offset += len
    return v
  }

  this.readWithLen = () => {
    let len = this.read16()
    let v = this.buffer.slice(this.offset, this.offset + len)
    this.offset += len
    return v
  }

  this.optionalReadWithLen = () => {
    if (this.buffer.length === this.offset) {
      return Buffer.alloc(0)
    } else {
      return this.readWithLen()
    }
  }

  this.read8 = () => {
    let v = this.buffer.readInt8(this.offset)
    this.offset += 1
    return v
  }

  this.read16 = () => {
    let v = this.buffer.readUInt16BE(this.offset)
    this.offset += 2
    return v
  }

  this.read32 = () => {
    let v = this.buffer.readUInt32BE(this.offset)
    this.offset += 4
    return v
  }

  this.read64 = () => {
    let hi = this.read32()
    let lo = this.read32()
    return Long.fromBits(lo, hi, true)
  }

  this.write = (data) => {
    assertBuffer(data)
    data.copy(this.buffer, this.offset)
    this.offset += data.length
    return this
  }

  this.writeWithLen = (data) => {
    assertBuffer(data)
    this.write16(data.length)
    data.copy(this.buffer, this.offset)
    this.offset += data.length
    return this
  }

  this.write8 = (num) => {
    assertNumber(num)
    assert(num <= 255)
    this.buffer.writeInt8(num, this.offset)
    this.offset += 1
    return this
  }

  this.write16 = (num) => {
    assertNumber(num)
    this.buffer.writeUInt16BE(num, this.offset)
    this.offset += 2
    return this
  }

  this.write32 = (num) => {
    assertNumber(num)
    this.buffer.writeUInt32BE(num, this.offset)
    this.offset += 4
    return this
  }

  this.write64 = (num) => {
    assertLong(num)
    return this.write32(num.high).write32(num.low)
  }
}
