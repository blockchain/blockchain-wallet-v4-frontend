import { expect } from 'chai'
import * as RemoteData from '../../src/redux/remoteData'

describe('remoteData', () => {
  describe.only('concat', () => {
    it('should return NotAsked if data1 = NotAsked and data2 = NotAsked', () => {
      const remoteData1 = { status: 'NotAsked' }
      const remoteData2 = { status: 'NotAsked' }
      const result = RemoteData.concat(remoteData1, remoteData2)
      console.log(result)
      expect(result).deep.equal({ status: 'NotAsked' })
    })
    it('should return NotAsked if data1 = NotAsked and data2 = Loading', () => {
      const remoteData1 = { status: 'NotAsked' }
      const remoteData2 = { status: 'Loading' }
      const result = RemoteData.concat(remoteData1, remoteData2)
      console.log(result)
      expect(result).deep.equal({ status: 'NotAsked' })
    })
    it('should return NotAsked if data1 = NotAsked and data2 = Failed', () => {
      const remoteData1 = { status: 'NotAsked' }
      const remoteData2 = { status: 'Failed' }
      const result = RemoteData.concat(remoteData1, remoteData2)
      console.log(result)
      expect(result).deep.equal({ status: 'NotAsked' })
    })
    it('should return NotAsked if data1 = NotAsked and data2 = Success', () => {
      const remoteData1 = { status: 'NotAsked' }
      const remoteData2 = { status: 'Success' }
      const result = RemoteData.concat(remoteData1, remoteData2)
      console.log(result)
      expect(result).deep.equal({ status: 'NotAsked' })
    })
    it('should return NotAsked if data1 = Loading and data2 = NotAsked', () => {
      const remoteData1 = { status: 'Loading' }
      const remoteData2 = { status: 'NotAsked' }
      const result = RemoteData.concat(remoteData1, remoteData2)
      console.log(result)
      expect(result).deep.equal({ status: 'NotAsked' })
    })
    it('should return Loading if data1 = Loading and data2 = Loading', () => {
      const remoteData1 = { status: 'Loading' }
      const remoteData2 = { status: 'Loading' }
      const result = RemoteData.concat(remoteData1, remoteData2)
      console.log(result)
      expect(result).deep.equal({ status: 'Loading' })
    })
    it('should return Failed if data1 = Loading and data2 = Failed', () => {
      const remoteData1 = { status: 'Loading' }
      const remoteData2 = { status: 'Failed', value: 'error 2' }
      const result = RemoteData.concat(remoteData1, remoteData2)
      console.log(result)
      expect(result).deep.equal({ status: 'Failed', value: ['error 2'] })
    })
    it('should return Loading if data1 = NotAsked and data2 = Success', () => {
      const remoteData1 = { status: 'Loading' }
      const remoteData2 = { status: 'Success', value: { data: 2 } }
      const result = RemoteData.concat(remoteData1, remoteData2)
      console.log(result)
      expect(result).deep.equal({ status: 'Loading' })
    })
    it('should return NotAsked if data1 = Failed and data2 = NotAsked', () => {
      const remoteData1 = { status: 'Failed', value: 'error 1' }
      const remoteData2 = { status: 'NotAsked' }
      const result = RemoteData.concat(remoteData1, remoteData2)
      console.log(result)
      expect(result).deep.equal({ status: 'NotAsked' })
    })
    it('should return Failed if data1 = Failed and data2 = Loading', () => {
      const remoteData1 = { status: 'Failed', value: 'error 1' }
      const remoteData2 = { status: 'Loading' }
      const result = RemoteData.concat(remoteData1, remoteData2)
      console.log(result)
      expect(result).deep.equal({ status: 'Failed', value: ['error 1'] })
    })
    it('should return Failed if data1 = Failed and data2 = Failed', () => {
      const remoteData1 = { status: 'Failed', value: 'error 1' }
      const remoteData2 = { status: 'Failed', value: 'error 2' }
      const result = RemoteData.concat(remoteData1, remoteData2)
      console.log(result)
      expect(result).deep.equal({ status: 'Failed', value: ['error 1', 'error 2'] })
    })
    it('should return Failed if data1 = Failed and data2 = Success', () => {
      const remoteData1 = { status: 'Failed', value: 'error 1' }
      const remoteData2 = { status: 'Success', value: { data: 2 } }
      const result = RemoteData.concat(remoteData1, remoteData2)
      console.log(result)
      expect(result).deep.equal({ status: 'Failed', value: ['error 1'] })
    })
    it('should return NotAsked if data1 = Success and data2 = NotAsked', () => {
      const remoteData1 = { status: 'Success', value: { data: 1 } }
      const remoteData2 = { status: 'NotAsked' }
      const result = RemoteData.concat(remoteData1, remoteData2)
      console.log(result)
      expect(result).deep.equal({ status: 'NotAsked' })
    })
    it('should return Loading if data1 = Success and data2 = Loading', () => {
      const remoteData1 = { status: 'Success', value: { data: 1 } }
      const remoteData2 = { status: 'Loading' }
      const result = RemoteData.concat(remoteData1, remoteData2)
      console.log(result)
      expect(result).deep.equal({ status: 'Loading' })
    })
    it('should return Failed if data1 = Success and data2 = Failed', () => {
      const remoteData1 = { status: 'Success', value: { data: 1 } }
      const remoteData2 = { status: 'Failed', value: 'error 2' }
      const result = RemoteData.concat(remoteData1, remoteData2)
      console.log(result)
      expect(result).deep.equal({ status: 'Failed', value: ['error 2'] })
    })
    it('should return Success if data1 = Success and data2 = Success', () => {
      const remoteData1 = { status: 'Success', value: { data: 1 } }
      const remoteData2 = { status: 'Success', value: { data: 2 } }
      const result = RemoteData.concat(remoteData1, remoteData2)
      console.log(result)
      expect(result).deep.equal({ status: 'Success', value: [{ data: 1 }, { data: 2 }] })
    })
  })
})
