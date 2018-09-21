import { expectSaga } from 'redux-saga-test-plan'
import { call, fork } from 'redux-saga-test-plan/matchers'
import { select } from 'redux-saga/effects'

import { selectors } from 'data'
import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'
import sagas from './sagas'
import { USER_ACTIVATION_STATES, KYC_STATES } from './model'
import { coreSagasFactory, Remote } from 'blockchain-wallet-v4/src'

jest.useFakeTimers()
jest.mock('blockchain-wallet-v4/src/redux/sagas')
const coreSagas = coreSagasFactory()

const api = {
  generateRetailToken: jest.fn(),
  createUser: jest.fn(),
  generateUserId: jest.fn(),
  generateLifetimeToken: jest.fn(),
  generateSession: jest.fn(),
  getUser: jest.fn(),
  updateUser: jest.fn(),
  updateUserAddress: jest.fn(),
  syncUserWithWallet: jest.fn()
}

const {
  signIn,
  fetchUser,
  updateUser,
  updateUserAddress,
  createUser,
  renewUser,
  generateRetailToken,
  generateAuthCredentials,
  syncUserWithWallet,
  startSession
} = sagas({
  api,
  coreSagas
})

const stubGuid = 'fa0c3130-0b7d-46cf-9d76-4b8208e298e5'
const stubEmail = 'user@mail.com'
const stubSharedKey = 'de6263f9-5029-412c-9fd5-8dc139cb9547'
const stubUserId = '3d448ad7-0e2c-4b65-91b0-c149892e243c'
const stubLifetimeToken = 'de6263f9-5029-412c-9fd5-8dc139cb9549'
const stubRetailToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJyZXRhaWwtY29yZSIsImV4cCI6MTUzNDA0NTg2MywiaWF0IjoxNTM0MDAyNjYzLCJ1c2VySUQiOiIzZDQ0OGFkNy0wZTJjLTRiNjUtOTFiMC1jMTQ5ODkyZTI0M2MiLCJqdGkiOiJkMGIyMDc3My03NDg3LTRhM2EtOWE1MC0zYmEzNzBlZWU4NjkifQ.O24d8dozP4KjNFMHPYaBNMISvQZXC3gPhSCXDIP-Eox'
const stubApiToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJyZXRhaWwtY29yZSIsImV4cCI6MTUzNDA0NTg2MywiaWF0IjoxNTM0MDAyNjYzLCJ1c2VySUQiOiIzZDQ0OGFkNy0wZTJjLTRiNjUtOTFiMC1jMTQ5ODkyZTI0M2MiLCJqdGkiOiJkMGIyMDc3My03NDg3LTRhM2EtOWE1MC0zYmEzNzBlZWU4NjkifQ.O24d8dozP4KjNFMHPYaBNMISvQZXC3gPhSCXDIP-Eok'
const stubAddress = {
  city: 'London',
  line1: 'Flat 2, 42 Great Street',
  line2: '',
  country: 'United Kingdom',
  state: 'England',
  postCode: 'E145AB'
}
const stubMobile = '+447799674746'
const stubUserData = {
  firstName: 'The',
  lastName: 'User',
  dob: '1999-11-31',
  state: USER_ACTIVATION_STATES.CREATED,
  kycState: KYC_STATES.NONE,
  address: stubAddress,
  mobile: stubMobile
}
const newUserData = {
  ...stubUserData,
  firstName: 'another',
  state: USER_ACTIVATION_STATES.ACTIVE,
  kycState: KYC_STATES.VERIFIED
}
const newAddress = {
  city: 'London',
  line1: 'Flat 2, 42 Great Street',
  line2: '',
  country: 'United Kingdom',
  state: 'England',
  postCode: 'E145AX'
}

api.getUser.mockReturnValue(newUserData)

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
const stubbedCreateUser = expectSaga(createUser).provide([
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

describe('fetch user saga', () => {
  it('should call getUser api and update user data', () =>
    expectSaga(fetchUser)
      .provide([[fork.fn(renewUser), jest.fn()]])
      .not.fork(renewUser)
      .put(A.setUserData(newUserData))
      .run()
      .then(() => {
        expect(api.getUser).toHaveBeenCalledTimes(1)
      }))
  it('should start renewTask if kycState is PENDING', () => {
    api.getUser.mockReturnValueOnce({
      ...newUserData,
      kycState: KYC_STATES.PENDING
    })
    return expectSaga(fetchUser)
      .provide([[fork.fn(renewUser), jest.fn()]])
      .fork(renewUser)
      .run()
  })
})

describe('update user saga', () => {
  beforeEach(() => {
    api.updateUser.mockClear()
  })

  it('should call updateUserApi', () => {
    const {
      kycState,
      state,
      id,
      address,
      mobile,
      mobileVerified,
      ...updateData
    } = newUserData
    return expectSaga(updateUser, {
      payload: { data: updateData }
    })
      .provide([
        [select(S.getUserData), stubUserData],
        [call.fn(fetchUser), jest.fn()]
      ])
      .call(fetchUser)
      .run()
      .then(() => {
        expect(api.updateUser).toHaveBeenCalledTimes(1)
        expect(api.updateUser).toHaveBeenCalledWith(updateData)
      })
  })

  it('should not update user if data did not change', () => {
    const {
      kycState,
      state,
      id,
      address,
      mobile,
      mobileVerified,
      ...updateData
    } = stubUserData
    return expectSaga(updateUser, {
      payload: { data: updateData }
    })
      .provide([
        [select(S.getUserData), stubUserData],
        [call.fn(fetchUser), jest.fn()]
      ])
      .not.call(fetchUser)
      .run()
      .then(() => {
        expect(api.updateUser).toHaveBeenCalledTimes(0)
      })
  })
})

describe('update user address saga', () => {
  beforeEach(() => {
    api.updateUserAddress.mockClear()
  })

  it('should call updateUserAddressApi', () => {
    const {
      id,
      address,
      mobile,
      mobileVerified,
      state,
      kycState,
      ...updateData
    } = stubUserData

    return expectSaga(updateUserAddress, {
      payload: { address: newAddress }
    })
      .provide([
        [select(S.getUserData), updateData],
        [call.fn(fetchUser), jest.fn()]
      ])
      .call(fetchUser)
      .run()
      .then(() => {
        expect(api.updateUserAddress).toHaveBeenCalledTimes(1)
        expect(api.updateUserAddress).toHaveBeenCalledWith(newAddress)
      })
  })

  it("should not update address if it didn't change", () =>
    expectSaga(updateUserAddress, {
      payload: { address: stubAddress }
    })
      .provide([
        [select(S.getUserData), stubUserData],
        [call.fn(fetchUser), jest.fn()]
      ])
      .not.call(fetchUser)
      .run()
      .then(() => {
        expect(api.updateUserAddress).toHaveBeenCalledTimes(0)
      }))
})

describe('create user credentials saga', () => {
  it('should select guid from wallet, email form settings, user id and lifetime token from kvStore and call startSession', () =>
    stubbedCreateUser
      .select(selectors.core.settings.getEmail)
      .select(selectors.core.wallet.getGuid)
      .select(selectors.core.kvStore.userCredentials.getUserId)
      .select(selectors.core.kvStore.userCredentials.getLifetimeToken)
      .call(startSession, stubUserId, stubLifetimeToken, stubEmail, stubGuid)
      .dispatch({ type: AT.SET_API_TOKEN, payload: { token: stubApiToken } })
      .run())

  it('should generate userId and lifetime token if they are not set in kvStore', () => {
    api.generateRetailToken.mockReturnValueOnce({ token: stubRetailToken })
    api.createUser.mockReturnValueOnce({
      userId: stubUserId,
      token: stubLifetimeToken
    })
    return expectSaga(createUser)
      .provide([
        [select(selectors.core.wallet.getGuid), stubGuid],
        [select(selectors.core.wallet.getSharedKey), stubSharedKey],
        [select(selectors.core.settings.getEmail), Remote.of(stubEmail)],
        [
          select(selectors.core.kvStore.userCredentials.getUserId),
          Remote.of('')
        ],
        [
          select(selectors.core.kvStore.userCredentials.getLifetimeToken),
          Remote.of('')
        ],
        [call.fn(startSession), jest.fn()]
      ])
      .call(generateAuthCredentials)
      .call(generateRetailToken)
      .select(selectors.core.wallet.getSharedKey)
      .call(startSession, stubUserId, stubLifetimeToken, stubEmail, stubGuid)
      .run()
      .then(() => {
        expect(api.generateRetailToken).toHaveBeenCalledTimes(1)
        expect(api.generateRetailToken).toHaveBeenCalledWith(
          stubGuid,
          stubSharedKey
        )
        expect(api.createUser).toHaveBeenCalledTimes(1)
        expect(api.createUser).toHaveBeenCalledWith(stubRetailToken)
      })
  })
})

describe('sync user with wallet saga', () => {
  it('should generate retail token sync user with it and update user data', () => {
    api.syncUserWithWallet.mockReturnValueOnce(stubUserData)
    expectSaga(syncUserWithWallet)
      .provide([[call.fn(generateRetailToken), stubRetailToken]])
      .call(generateRetailToken)
      .put(A.setUserData(stubUserData))
      .run()
      .then(() => {
        expect(api.syncUserWithWallet).toHaveBeenCalledTimes(1)
        expect(api.syncUserWithWallet).toHaveBeenCalledWith(stubRetailToken)
      })
  })
})
