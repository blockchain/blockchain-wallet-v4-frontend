import createRng, { _overrides, getServerEntropy, mixEntropy, xor } from './rng'

describe('rng', () => {
  const api = {
    getRandomBytes: () => new Promise()
  }

  const serverBuffer = Buffer.from(
    '0000000000000000000000000000000000000000000000000000000000000010',
    'hex'
  )

  const longServerBuffer = Buffer.from(
    '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010',
    'hex'
  )

  const zerosServerBuffer = Buffer.from(
    '0000000000000000000000000000000000000000000000000000000000000000',
    'hex'
  )

  const shortServerBuffer = Buffer.from('0000000000000000000000000000000001', 'hex')

  const xorBuffer = Buffer.from(
    '0000000000000000000000000000000000000000000000000000000000000011',
    'hex'
  )

  const xorFailingServerBuffer = Buffer.from(
    '0000000000000000000000000000000000000000000000000000000000000001',
    'hex'
  )

  const oneBrowserBuffer = Buffer.from(
    '0000000000000000000000000000000000000000000000000000000000000001',
    'hex'
  )

  const zerosBrowserBuffer = Buffer.from(
    '0000000000000000000000000000000000000000000000000000000000000001',
    'hex'
  )

  describe('xor', () => {
    it('should be an xor operation', () => {
      const A = Buffer.from('a123456c', 'hex')
      const B = Buffer.from('ff0123cd', 'hex')
      const R = '5e2266a1'
      expect(xor(A, B).toString('hex')).toEqual(R)
    })

    it('should return the shortest common length', () => {
      const A = Buffer.from('a123', 'hex')
      const B = Buffer.from('ff0123cd', 'hex')
      const R = '5e22'
      expect(xor(A, B).toString('hex')).toEqual(R)
    })
  })

  describe('getServerEntropy', () => {
    beforeEach(() => {
      jest
        .spyOn(api, 'getRandomBytes')
        .mockImplementation((bytes) => Promise.resolve(serverBuffer.toString('hex')))
    })

    it('returns a buffer if successful', async () => {
      const res = await getServerEntropy(32, api)
      expect(Buffer.isBuffer(res.value)).toBeTruthy()
    })

    it('returns a 32 bytes buffer if nBytes not indicated and if is successful', async () => {
      const res = await getServerEntropy(void 0, api)
      expect(Buffer.isBuffer(res.value)).toBeTruthy()
      expect(res.value).toHaveLength(32)
    })

    it('should fail if passed a bad argument', async () => {
      const res = await getServerEntropy(-1, api)
      expect(res.isLeft).toEqual(true)
      expect(res.value.message).toEqual('Must provide a positive integer to getServerEntropy')
    })

    it('should fail if result is not hex', async () => {
      jest
        .spyOn(api, 'getRandomBytes')
        .mockImplementation((bytes) => Promise.resolve('This page was not found'))
      const res = await getServerEntropy(32, api)
      expect(res.isLeft).toEqual(true)
      expect(res.value.message).toEqual('Non-hex server entropy answer.')
    })

    it('should fail if result is the wrong length', async () => {
      jest.spyOn(api, 'getRandomBytes').mockImplementation((bytes) => Promise.resolve('000001'))
      const res1 = await getServerEntropy(3, api)
      expect(res1.isRight).toEqual(true)
      const res2 = await getServerEntropy(32, api)
      expect(res2.isRight).toEqual(false)
      expect(res2.value.message).toEqual('Different entropy length requested.')
    })
  })

  describe('mixEntropy', () => {
    it('should fail if local entropy is empty', async () => {
      const localH = Buffer.from('', 'hex')
      const serverH = serverBuffer
      expect(mixEntropy(localH, serverH, 32).isLeft).toEqual(true)
    })

    it('should fail if server entropy is empty', async () => {
      const localH = serverBuffer
      const serverH = Buffer.from('', 'hex')
      expect(mixEntropy(localH, serverH, 32).isLeft).toEqual(true)
    })

    it('should fail if local entropy is made of repeated bytes', async () => {
      const localH = Buffer.from('00'.repeat(32), 'hex')
      const serverH = serverBuffer
      expect(mixEntropy(localH, serverH, 32).isLeft).toEqual(true)
    })

    it('should fail if server entropy is made of repeated bytes', async () => {
      const localH = serverBuffer
      const serverH = Buffer.from('00'.repeat(32), 'hex')
      expect(mixEntropy(localH, serverH, 32).isLeft).toEqual(true)
    })

    it('should fail if the entropy buffers are of differing lengths', async () => {
      const localH = Buffer.from('00'.repeat(30), 'hex')
      const serverH = Buffer.from('00'.repeat(34), 'hex')
      expect(mixEntropy(localH, serverH, 32).isLeft).toEqual(true)
    })

    it('should fail if the xor buffer is the same byte repeating', async () => {
      const localH = Buffer.from('01'.repeat(32), 'hex')
      const serverH = Buffer.from('10'.repeat(32), 'hex')
      expect(mixEntropy(localH, serverH, 32).isLeft).toEqual(true)
    })

    it('should fail if the result does not meet the length requirement', async () => {
      const localH = Buffer.from('ab'.repeat(32), 'hex')
      const serverH = Buffer.from('cd'.repeat(32), 'hex')
      expect(mixEntropy(localH, serverH, 64).isLeft).toEqual(true)
    })
  })

  describe('createRng', () => {
    it('should ask for 32 bytes from the server', async () => {
      jest.spyOn(api, 'getRandomBytes').mockImplementation((bytes) => {
        expect(bytes).toEqual(32)
        return Promise.resolve(serverBuffer.toString('hex'))
      })
      const rng = await createRng(void 0, api)
      rng()
    })

    it('should ask an arbitrary amount of bytes from the server', async () => {
      jest.spyOn(api, 'getRandomBytes').mockImplementation((bytes) => {
        expect(bytes).toEqual(64)
        return Promise.resolve(longServerBuffer.toString('hex'))
      })
      const rng = await createRng(64, api)
      rng()
    })

    it('returns the mixed entropy', async () => {
      jest
        .spyOn(api, 'getRandomBytes')
        .mockImplementation((bytes) => Promise.resolve(serverBuffer.toString('hex')))
      jest.spyOn(_overrides, 'randomBytes').mockImplementation((bytes) => oneBrowserBuffer)
      const rng = await createRng(void 0, api)
      expect(rng().toString('hex')).toEqual(xorBuffer.toString('hex'))
    })

    it('fails if server data is all zeros', async () => {
      jest
        .spyOn(api, 'getRandomBytes')
        .mockImplementation((bytes) => Promise.resolve(zerosServerBuffer.toString('hex')))
      const rng = await createRng(void 0, api)
      expect(rng).toThrow()
    })

    it('fails if browser data is all zeros', async () => {
      jest
        .spyOn(api, 'getRandomBytes')
        .mockImplementation((bytes) => Promise.resolve(zerosServerBuffer.toString('hex')))
      jest.spyOn(_overrides, 'randomBytes').mockImplementation((bytes) => zerosBrowserBuffer)
      const rng = await createRng(void 0, api)
      expect(rng).toThrow()
    })

    it('fails if server data has the wrong length', async () => {
      jest
        .spyOn(api, 'getRandomBytes')
        .mockImplementation((bytes) => Promise.resolve(shortServerBuffer.toString('hex')))
      const rng = await createRng(void 0, api)
      expect(rng).toThrow()
    })

    it('fails if combined entropy is all zeros', async () => {
      jest
        .spyOn(api, 'getRandomBytes')
        .mockImplementation((bytes) => Promise.resolve(xorFailingServerBuffer.toString('hex')))
      const rng = await createRng(void 0, api)
      expect(rng).toThrow()
    })

    it('should fail after server entropy runs out', async () => {
      jest
        .spyOn(api, 'getRandomBytes')
        .mockImplementation((bytes) => Promise.resolve(serverBuffer.toString('hex')))
      const rng = await createRng(void 0, api)
      expect(rng(16).toString('hex')).toEqual('00'.repeat(16))
      expect(() => rng(17)).toThrow()
    })
  })
})
