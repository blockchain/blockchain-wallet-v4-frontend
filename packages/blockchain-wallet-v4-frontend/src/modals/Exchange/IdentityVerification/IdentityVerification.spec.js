import { actions, model } from 'data'
import { combineReducers } from 'redux'
import { createTestStore, getDispatchSpyReducer, TestBed } from 'utils/testbed'
import { mount } from 'enzyme'
import React from 'react'

import {
  coreReducers,
  coreSagasFactory,
  paths,
  Remote
} from 'blockchain-wallet-v4/src'
import {
  getCountryCode,
  getEmail,
  getEmailVerified,
  getSmsNumber,
  getSmsVerified
} from 'blockchain-wallet-v4/src/redux/settings/selectors'
import { getGuid } from 'blockchain-wallet-v4/src/redux/wallet/selectors'
import {
  getLifetimeToken,
  getUserId
} from 'blockchain-wallet-v4/src/redux/kvStore/userCredentials/selectors'
import {
  getStates,
  getSteps,
  getSupportedCountries
} from 'data/components/identityVerification/selectors.ts'
import { ModalHeader } from 'blockchain-info-components'
import IdentityVerification from './index'
import identityVerificationReducer from 'data/components/identityVerification/reducers.ts'
import identityVerificationSaga from 'data/components/identityVerification/sagaRegister'
import modalsReducer from 'data/modals/reducers'
import profileReducer from 'data/modules/profile/reducers'
import profileSagas from 'data/modules/profile/sagaRegister'
import securityCenterSagas from 'data/modules/securityCenter/sagaRegister'
import settingsSagas from 'data/modules/settings/sagaRegister'
import Tray from 'components/Tray'

const { KYC_MODAL } = model.components.identityVerification
const { dispatchSpy, spyReducer } = getDispatchSpyReducer()

jest.useFakeTimers()

jest.mock('blockchain-wallet-v4/src/redux/sagas')
jest.mock('blockchain-wallet-v4/src/redux/settings/selectors')
jest.mock('blockchain-wallet-v4/src/redux/kvStore/userCredentials/selectors')
jest.mock('blockchain-wallet-v4/src/redux/wallet/selectors')
jest.mock('data/components/identityVerification/selectors.ts')

const POSSIBLE_ADDRESSES = [
  {
    line1: 'Square Louvois',
    line2: '',
    postCode: '75002',
    city: '',
    state: 'Île-de-France'
  },
  {
    line1: 'Rue Montmartre, 108',
    line2: '',
    postCode: '75002',
    city: '',
    state: 'Île-de-France'
  }
]
const STUB_COUNTRY_CODE = 'FR'
const SUPPORTED_COUNTRIES = [{ code: STUB_COUNTRY_CODE, name: 'France' }]

const stubMail = 'mail@mail.com'

const coreSagas = coreSagasFactory({ api: {} })
const api = {
  obtainSessionToken: jest.fn(),
  deauthorizeBrowser: jest.fn(),
  getSupportedCountries: () =>
    Remote.of([{ name: 'France', code: 'FR' }, { name: 'Spain', code: 'ES' }]),
  getStates: () => Remote.of([]),
  fetchKycAddresses: () => Remote.of(POSSIBLE_ADDRESSES)
}

getUserId.mockImplementation(() => Remote.of(123))
getLifetimeToken.mockImplementation(() => Remote.of(456))
getSmsVerified.mockImplementation(() => Remote.of(0))
getSmsNumber.mockImplementation(() => Remote.of(''))
getEmail.mockImplementation(() => Remote.of(stubMail))
getEmailVerified.mockImplementation(() => Remote.of(1))
getGuid.mockImplementation(() => Remote.of('123-abc-456-def'))
getCountryCode.mockImplementation(() => Remote.of('FR'))
getSupportedCountries.mockImplementation(() =>
  Remote.Success(SUPPORTED_COUNTRIES)
)
getStates.mockImplementation(() => Remote.Success([]))
getSteps.mockReturnValue(Remote.of(['personal', 'mobile', 'verify']))

profileSagas.createUser = jest.fn()

describe('IdentityVerification Modal', () => {
  beforeEach(() => {
    dispatchSpy.mockClear()
  })
  const reducers = {
    spy: spyReducer,
    modals: modalsReducer,
    components: combineReducers({
      identityVerification: identityVerificationReducer
    }),
    profile: profileReducer,
    [paths.settingsPath]: coreReducers.settings
  }
  const sagas = [
    identityVerificationSaga({ coreSagas, api }),
    securityCenterSagas({ coreSagas }),
    settingsSagas({ coreSagas }),
    profileSagas({ coreSagas, api })
  ]
  let store
  let wrapper
  beforeEach(() => {
    store = createTestStore(reducers, sagas)
    wrapper = mount(
      <TestBed store={store}>
        <IdentityVerification />
      </TestBed>
    )
  })

  describe('Modal behaviour', () => {
    it('should render after modal action', () => {
      expect(wrapper.find(Tray)).toHaveLength(0)

      store.dispatch(actions.modals.showModal(KYC_MODAL))
      wrapper.update()

      expect(wrapper.find(Tray)).toHaveLength(1)
    })

    it('should be hidden on close click', () => {
      store.dispatch(actions.modals.showModal(KYC_MODAL))
      wrapper.update()
      wrapper.find(ModalHeader).prop('onClose')()
      wrapper.update()
      expect(wrapper.find(Tray).prop('in')).toBe(false)
    })
  })
})
