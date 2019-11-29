import BIP39 from 'bip39'
import Bitcoin from 'bitcoinjs-lib'
import * as ed25519 from 'ed25519-hd-key'
import EthHd from 'ethereumjs-wallet/hdkey'
import * as StellarSdk from 'stellar-sdk'

import Core from './core'
import * as crypto from '../walletCrypto'
import { taskToPromise } from '../utils/functional'

const core = Core({ BIP39, Bitcoin, crypto, ed25519, EthHd, taskToPromise })

it(`generates entropy from the user's credentials`, () => {
  expect(
    core
      .generateCredentialsEntropy({
        guid: `50dae286-e42e-4d67-8419-d5dcc563746c`,
        password: `password`,
        sharedKey: `b91c904b-53ab-44b1-bf79-5b60c018da15`
      })
      .toString(`base64`)
  ).toEqual(`jqdTiIA0jYETn9EjAGljE5697lc8kSkxod79srxfLug=`)
})

it(`entropyToSeed`, () => {
  expect(
    core.entropyToSeed(`713a3ae074e60e56c6bd0557c4984af1`).toString(`base64`)
  ).toEqual(
    `5KWmMucJQ65/B2Wd8TMhYJN/rYJYchakxkMVoPs5SX7koB923atMumgUeXfzoUe2rVhMQYCOgjigf2zEtYLxhg==`
  )
})

it(`derives a BIP32 key from seedHex`, async () => {
  expect(
    await core.deriveBIP32KeyFromSeedHex(
      {
        network: Bitcoin.networks.bitcoin,
        entropy: `713a3ae074e60e56c6bd0557c4984af1`
      },
      `m/0`
    )
  ).toEqual(
    `xprv9vJpjafE9tbBCPBrcv5hBq1tUP4s4d3kZRHewAkGwzjvPZ3Jm8nt9eYwoLUcjnBKdB46WZmzuoEqWLJNB2GwyfShQ1y3Pn7AoVsGYXgzabG`
  )
})

// Derivation error using seedHex directly instead of seed derived from
// mnemonic derived from seedHex
it(`derives a legacy Ethereum key from seedHex`, () => {
  expect(
    core
      .deriveLegacyEthereumKey({
        entropy: `e39c77ed95097f9006c34e1a843aa151`
      })
      .toString(`hex`)
  ).toEqual(`bb9c3e500b9c41ce9836619fb840436c2d98695d6dc43fb73e6e02df7ee7fc5c`)
})

describe(`derives a SLIP-10 ed25519 key from the seed`, () => {
  const testVectors = [
    {
      seedHex: '713a3ae074e60e56c6bd0557c4984af1',
      publicKey: 'GDRXE2BQUC3AZNPVFSCEZ76NJ3WWL25FYFK6RGZGIEKWE4SOOHSUJUJ6',
      secret: 'SBGWSG6BTNCKCOB3DIFBGCVMUPQFYPA2G4O34RMTB343OYPXU5DJDVMN'
    },
    {
      seedHex: 'b781c27351c7024355cf7f0b0efdc7f85e046cf9',
      publicKey: 'GAVXVW5MCK7Q66RIBWZZKZEDQTRXWCZUP4DIIFXCCENGW2P6W4OA34RH',
      secret: 'SAKS7I2PNDBE5SJSUSU2XLJ7K5XJ3V3K4UDFAHMSBQYPOKE247VHAGDB'
    },
    {
      seedHex:
        '150df9e3ab10f3f8f1428d723a6539662e181ec8781355396cec5fc2ce08d760',
      publicKey: 'GC3MMSXBWHL6CPOAVERSJITX7BH76YU252WGLUOM5CJX3E7UCYZBTPJQ',
      secret: 'SAEWIVK3VLNEJ3WEJRZXQGDAS5NVG2BYSYDFRSH4GKVTS5RXNVED5AX7'
    },
    {
      seedHex: '00000000000000000000000000000000',
      publicKey: 'GB3JDWCQJCWMJ3IILWIGDTQJJC5567PGVEVXSCVPEQOTDN64VJBDQBYX',
      secret: 'SBUV3MRWKNS6AYKZ6E6MOUVF2OYMON3MIUASWL3JLY5E3ISDJFELYBRZ'
    }
  ]

  testVectors.forEach(({ publicKey, secret, seedHex }, index) => {
    it(`test vector ${index}`, async () => {
      const { key } = await core.deriveSLIP10ed25519Key(
        { entropy: Buffer.from(seedHex, `hex`) },
        `m/44'/148'/0'`
      )

      const keypair = StellarSdk.Keypair.fromRawEd25519Seed(key)
      expect(keypair.publicKey()).toEqual(publicKey)
      expect(keypair.secret()).toEqual(secret)
    })
  })
})

it('generates a Matomo user ID from seedHex', () => {
  expect(
    core.generateMatomoUserId({
      seedHex: `713a3ae074e60e56c6bd0557c4984af1`
    })
  ).toEqual(`1D3FfVe6pxyvUVQCfhXuXmSR8Fwe2r2vj5`)
})
