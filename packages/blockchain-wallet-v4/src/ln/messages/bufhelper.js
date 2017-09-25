import * as Long from 'long'

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
    return new Long(this.read(4), this.read(4))
  }

  this.write = (data) => {
    data.copy(this.buffer, this.offset)
    this.offset += data.length
    return this
  }

  this.writeWithLen = (data) => {
    this.write16(data.length)
    data.copy(this.buffer, this.offset)
    this.offset += data.length
    return this
  }

  this.write8 = (num) => {
    this.buffer.writeInt8(num, this.offset)
    this.offset += 1
    return this
  }

  this.write16 = (num) => {
    this.buffer.writeUInt16BE(num, this.offset)
    this.offset += 2
    return this
  }

  this.write32 = (num) => {
    this.buffer.writeUInt32BE(num, this.offset)
    this.offset += 4
    return this
  }

  this.write64 = (num) => {
    return this.write32(num.high).write32(num.low)
  }
}
