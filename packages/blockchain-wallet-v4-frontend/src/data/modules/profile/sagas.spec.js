import { expectSaga } from 'redux-saga-test-plan'
import { call } from 'redux-saga-test-plan/matchers'
import { select } from 'redux-saga/effects'

import { selectors } from 'data'
import * as AT from './actionTypes'
import * as S from './selectors'
import sagas from './sagas'
import { coreSagasFactory, Remote } from 'blockchain-wallet-v4/src'

jest.useFakeTimers()
jest.mock('blockchain-wallet-v4/src/redux/sagas')
const coreSagas = coreSagasFactory()

const api = {
  generateUserId: jest.fn(),
  generateLifetimeToken: jest.fn(),
  generateSession: jest.fn(),
  createUser: jest.fn(() => ({ id: 'id' }))
}

const {
  signIn,
  createUser,
  generateUserId,
  generateLifetimeToken,
  generateAuthCredentials,
  startSession
} = sagas({
  api,
  coreSagas
})

const stubGuid = 'fa0c3130-0b7d-46cf-9d76-4b8208e298e5'
const stubEmail = 'user@mail.com'
const stubUserId = '3d448ad7-0e2c-4b65-91b0-c149892e243c'
const stubLifetimeToken = 'de6263f9-5029-412c-9fd5-8dc139cb9549'
const stubApiToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJyZXRhaWwtY29yZSIsImV4cCI6MTUzNDA0NTg2MywiaWF0IjoxNTM0MDAyNjYzLCJ1c2VySUQiOiIzZDQ0OGFkNy0wZTJjLTRiNjUtOTFiMC1jMTQ5ODkyZTI0M2MiLCJqdGkiOiJkMGIyMDc3My03NDg3LTRhM2EtOWE1MC0zYmEzNzBlZWU4NjkifQ.O24d8dozP4KjNFMHPYaBNMISvQZXC3gPhSCXDIP-Eok'
const stubUserData = {}
const stubbedSignin = expectSaga(signIn).provide([
  [select(selectors.core.wallet.getGuid), stubGuid],
  [select(selectors.core.settings.getEmail), Remote.of(stubEmail)],
  [
    select(selectors.core.kvStore.userCredentials.getUserId),
    Remote.of(stubUserId)
  ],
  [
    select(selectors.core.kvStore.userCredentials.getLifetimeToken),
    Remote.of(stubLifetimeToken)
  ],
  [call.fn(startSession), jest.fn()]
])
const stubbedGenerateAuthCredentials = expectSaga(
  generateAuthCredentials
).provide([
  [select(selectors.core.wallet.getGuid), stubGuid],
  [select(selectors.core.settings.getEmail), Remote.of(stubEmail)],
  [
    select(selectors.core.kvStore.userCredentials.getUserId),
    Remote.of(stubUserId)
  ],
  [
    select(selectors.core.kvStore.userCredentials.getLifetimeToken),
    Remote.of(stubLifetimeToken)
  ],
  [call.fn(startSession), jest.fn()]
])

const stubbedCreateUser = expectSaga(createUser, {
  payload: { data: stubUserData }
}).provide([[select(S.getApiToken), stubApiToken]])

describe('signin saga', () => {
  beforeEach(() => {
    api.generateSession.mockClear()
  })

  it('should fetch kvStore userCredentials', () =>
    stubbedSignin
      .call(coreSagas.kvStore.userCredentials.fetchMetadataUserCredentials)
      .run())

  it('should select guid from wallet, email form settings, user id and lifetime token from kvStore', () =>
    stubbedSignin
      .select(selectors.core.settings.getEmail)
      .select(selectors.core.wallet.getGuid)
      .select(selectors.core.kvStore.userCredentials.getUserId)
      .select(selectors.core.kvStore.userCredentials.getLifetimeToken)
      .run())

  it('should not start session if they userId or lifetime token is not set', async () => {
    await expectSaga(signIn)
      .provide([
        [select(selectors.core.wallet.getGuid), stubGuid],
        [select(selectors.core.settings.getEmail), Remote.of(stubEmail)],
        [
          select(selectors.core.kvStore.userCredentials.getUserId),
          Remote.of('')
        ],
        [
          select(selectors.core.kvStore.userCredentials.getLifetimeToken),
          Remote.of(stubLifetimeToken)
        ]
      ])
      .not.call(startSession)
      .run()
    await expectSaga(signIn)
      .provide([
        [select(selectors.core.wallet.getGuid), stubGuid],
        [select(selectors.core.settings.getEmail), Remote.of(stubEmail)],
        [
          select(selectors.core.kvStore.userCredentials.getUserId),
          Remote.of(stubEmail)
        ],
        [
          select(selectors.core.kvStore.userCredentials.getLifetimeToken),
          Remote.of('')
        ]
      ])
      .not.call(startSession)
      .run()
  })
})

describe('create user saga', () => {
  beforeEach(() => {
    api.generateUserId.mockClear()
    api.generateLifetimeToken.mockClear()
    api.createUser.mockClear()
  })

  it('should select api token and call createUserApi', () =>
    stubbedCreateUser
      .select(S.getApiToken)
      .run()
      .then(() => {
        expect(api.createUser).toHaveBeenCalledTimes(1)
        expect(api.createUser).toHaveBeenCalledWith(stubUserData, stubApiToken)
      }))
})

describe('generate auth credentials saga', () => {
  it('should select guid from wallet, email form settings, user id and lifetime token from kvStore and call startSession', () =>
    stubbedGenerateAuthCredentials
      .select(selectors.core.settings.getEmail)
      .select(selectors.core.wallet.getGuid)
      .select(selectors.core.kvStore.userCredentials.getUserId)
      .select(selectors.core.kvStore.userCredentials.getLifetimeToken)
      .call(startSession, stubUserId, stubLifetimeToken, stubEmail, stubGuid)
      .dispatch({ type: AT.SET_API_TOKEN, payload: { token: stubApiToken } })
      .run())

  it('should generate userId and lifetime token if they are not set in kvStore', () => {
    api.generateUserId.mockReturnValueOnce({ userId: stubUserId })
    api.generateLifetimeToken.mockReturnValueOnce({ token: stubLifetimeToken })
    return expectSaga(generateAuthCredentials)
      .provide([
        [select(selectors.core.wallet.getGuid), stubGuid],
        [select(selectors.core.settings.getEmail), Remote.of(stubEmail)],
        [
          select(selectors.core.kvStore.userCredentials.getUserId),
          Remote.Success('')
        ],
        [
          select(selectors.core.kvStore.userCredentials.getLifetimeToken),
          Remote.Success('')
        ],
        [call.fn(startSession), jest.fn()]
      ])
      .call(generateUserId, stubEmail, stubGuid)
      .call(generateLifetimeToken, stubUserId, stubEmail, stubGuid)
      .call(startSession, stubUserId, stubLifetimeToken, stubEmail, stubGuid)
      .run()
      .then(() => {
        expect(api.generateUserId).toHaveBeenCalledTimes(1)
        expect(api.generateUserId).toHaveBeenCalledWith(stubEmail, stubGuid)
        expect(api.generateLifetimeToken).toHaveBeenCalledTimes(1)
        expect(api.generateLifetimeToken).toHaveBeenCalledWith(
          stubUserId,
          stubEmail,
          stubGuid
        )
      })
  })
})
