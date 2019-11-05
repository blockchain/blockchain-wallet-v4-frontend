import createRng, { _overrides, getServerEntropy, mixEntropy, xor } from './rng'

describe('rng', () => {
  let api = {
    getRandomBytes: () => new Promise()
  }

  let serverBuffer = Buffer.from(
    '0000000000000000000000000000000000000000000000000000000000000010',
    'hex'
  )

  let longServerBuffer = Buffer.from(
    '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010',
    'hex'
  )

  let zerosServerBuffer = Buffer.from(
    '0000000000000000000000000000000000000000000000000000000000000000',
    'hex'
  )

  let shortServerBuffer = Buffer.from(
    '0000000000000000000000000000000001',
    'hex'
  )

  let xorBuffer = Buffer.from(
    '0000000000000000000000000000000000000000000000000000000000000011',
    'hex'
  )

  let xorFailingServerBuffer = Buffer.from(
    '0000000000000000000000000000000000000000000000000000000000000001',
    'hex'
  )

  let oneBrowserBuffer = Buffer.from(
    '0000000000000000000000000000000000000000000000000000000000000001',
    'hex'
  )

  let zerosBrowserBuffer = Buffer.from(
    '0000000000000000000000000000000000000000000000000000000000000001',
    'hex'
  )

  describe('xor', () => {
    it('should be an xor operation', () => {
      let A = Buffer.from('a123456c', 'hex')
      let B = Buffer.from('ff0123cd', 'hex')
      let R = '5e2266a1'
      expect(xor(A, B).toString('hex')).toEqual(R)
    })

    it('should return the shortest common length', () => {
      let A = Buffer.from('a123', 'hex')
      let B = Buffer.from('ff0123cd', 'hex')
      let R = '5e22'
      expect(xor(A, B).toString('hex')).toEqual(R)
    })
  })

  describe('getServerEntropy', () => {
    beforeEach(() => {
      jest
        .spyOn(api, 'getRandomBytes')
        .mockImplementation(bytes =>
          Promise.resolve(serverBuffer.toString('hex'))
        )
    })

    it('returns a buffer if successful', async () => {
      let res = await getServerEntropy(32, api)
      expect(Buffer.isBuffer(res.value)).toBeTruthy()
    })

    it('returns a 32 bytes buffer if nBytes not indicated and if is successful', async () => {
      let res = await getServerEntropy(void 0, api)
      expect(Buffer.isBuffer(res.value)).toBeTruthy()
      expect(res.value.length).toEqual(32)
    })

    it('should fail if passed a bad argument', async () => {
      let res = await getServerEntropy(-1, api)
      expect(res.isLeft).toEqual(true)
      expect(res.value.message).toEqual(
        'Must provide a positive integer to getServerEntropy'
      )
    })

    it('should fail if result is not hex', async () => {
      jest
        .spyOn(api, 'getRandomBytes')
        .mockImplementation(bytes => Promise.resolve('This page was not found'))
      let res = await getServerEntropy(32, api)
      expect(res.isLeft).toEqual(true)
      expect(res.value.message).toEqual('Non-hex server entropy answer.')
    })

    it('should fail if result is the wrong length', async () => {
      jest
        .spyOn(api, 'getRandomBytes')
        .mockImplementation(bytes => Promise.resolve('000001'))
      let res1 = await getServerEntropy(3, api)
      expect(res1.isRight).toEqual(true)
      let res2 = await getServerEntropy(32, api)
      expect(res2.isRight).toEqual(false)
      expect(res2.value.message).toEqual('Different entropy length requested.')
    })
  })

  describe('mixEntropy', () => {
    it('should fail if local entropy is empty', async () => {
      let localH = Buffer.from('', 'hex')
      let serverH = serverBuffer
      expect(mixEntropy(localH, serverH, 32).isLeft).toEqual(true)
    })

    it('should fail if server entropy is empty', async () => {
      let localH = serverBuffer
      let serverH = Buffer.from('', 'hex')
      expect(mixEntropy(localH, serverH, 32).isLeft).toEqual(true)
    })

    it('should fail if local entropy is made of repeated bytes', async () => {
      let localH = Buffer.from('00'.repeat(32), 'hex')
      let serverH = serverBuffer
      expect(mixEntropy(localH, serverH, 32).isLeft).toEqual(true)
    })

    it('should fail if server entropy is made of repeated bytes', async () => {
      let localH = serverBuffer
      let serverH = Buffer.from('00'.repeat(32), 'hex')
      expect(mixEntropy(localH, serverH, 32).isLeft).toEqual(true)
    })

    it('should fail if the entropy buffers are of differing lengths', async () => {
      let localH = Buffer.from('00'.repeat(30), 'hex')
      let serverH = Buffer.from('00'.repeat(34), 'hex')
      expect(mixEntropy(localH, serverH, 32).isLeft).toEqual(true)
    })

    it('should fail if the xor buffer is the same byte repeating', async () => {
      let localH = Buffer.from('01'.repeat(32), 'hex')
      let serverH = Buffer.from('10'.repeat(32), 'hex')
      expect(mixEntropy(localH, serverH, 32).isLeft).toEqual(true)
    })

    it('should fail if the result does not meet the length requirement', async () => {
      let localH = Buffer.from('ab'.repeat(32), 'hex')
      let serverH = Buffer.from('cd'.repeat(32), 'hex')
      expect(mixEntropy(localH, serverH, 64).isLeft).toEqual(true)
    })
  })

  describe('createRng', () => {
    it('should ask for 32 bytes from the server', async () => {
      jest.spyOn(api, 'getRandomBytes').mockImplementation(bytes => {
        expect(bytes).toEqual(32)
        return Promise.resolve(serverBuffer.toString('hex'))
      })
      let rng = await createRng(void 0, api)
      rng()
    })

    it('should ask an arbitrary amount of bytes from the server', async () => {
      jest.spyOn(api, 'getRandomBytes').mockImplementation(bytes => {
        expect(bytes).toEqual(64)
        return Promise.resolve(longServerBuffer.toString('hex'))
      })
      let rng = await createRng(64, api)
      rng()
    })

    it('returns the mixed entropy', async () => {
      jest
        .spyOn(api, 'getRandomBytes')
        .mockImplementation(bytes =>
          Promise.resolve(serverBuffer.toString('hex'))
        )
      jest
        .spyOn(_overrides, 'randomBytes')
        .mockImplementation(bytes => oneBrowserBuffer)
      let rng = await createRng(void 0, api)
      expect(rng().toString('hex')).toEqual(xorBuffer.toString('hex'))
    })

    it('fails if server data is all zeros', async () => {
      jest
        .spyOn(api, 'getRandomBytes')
        .mockImplementation(bytes =>
          Promise.resolve(zerosServerBuffer.toString('hex'))
        )
      let rng = await createRng(void 0, api)
      expect(rng).toThrow()
    })

    it('fails if browser data is all zeros', async () => {
      jest
        .spyOn(api, 'getRandomBytes')
        .mockImplementation(bytes =>
          Promise.resolve(zerosServerBuffer.toString('hex'))
        )
      jest
        .spyOn(_overrides, 'randomBytes')
        .mockImplementation(bytes => zerosBrowserBuffer)
      let rng = await createRng(void 0, api)
      expect(rng).toThrow()
    })

    it('fails if server data has the wrong length', async () => {
      jest
        .spyOn(api, 'getRandomBytes')
        .mockImplementation(bytes =>
          Promise.resolve(shortServerBuffer.toString('hex'))
        )
      let rng = await createRng(void 0, api)
      expect(rng).toThrow()
    })

    it('fails if combined entropy is all zeros', async () => {
      jest
        .spyOn(api, 'getRandomBytes')
        .mockImplementation(bytes =>
          Promise.resolve(xorFailingServerBuffer.toString('hex'))
        )
      let rng = await createRng(void 0, api)
      expect(rng).toThrow()
    })

    it('should fail after server entropy runs out', async () => {
      jest
        .spyOn(api, 'getRandomBytes')
        .mockImplementation(bytes =>
          Promise.resolve(serverBuffer.toString('hex'))
        )
      let rng = await createRng(void 0, api)
      expect(rng(16).toString('hex')).toEqual('00'.repeat(16))
      expect(() => rng(17)).toThrow()
    })
  })
})
