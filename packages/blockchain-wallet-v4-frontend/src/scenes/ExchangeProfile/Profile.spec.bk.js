// import React from 'react'
// import { TestBed, getDispatchSpyReducer, createTestStore } from 'utils/testbed'
// import { mount } from 'enzyme'
// import { head, init, last, path } from 'ramda'
// import { combineReducers } from 'redux'

// import { actions, actionTypes } from 'data'
// import { KYC_STATES, INITIAL_TIERS } from 'data/modules/profile/model'
// import { coreReducers, paths } from 'blockchain-wallet-v4/src'
// import {
//   KYC_MODAL,
//   USER_EXISTS_MODAL
// } from 'data/components/identityVerification/model'
// import modalsReducer from 'data/modals/reducers'
// import profileReducer from 'data/modules/profile/reducers'
// import identityVerificationReducer from 'data/components/identityVerification/reducers'
// import { eeaCountryCodes } from 'services/IdentityVerificationService'
// import {
//   getInvitations,
//   getCountryCode,
//   getEmailVerified,
//   getSmsVerified
// } from 'blockchain-wallet-v4/src/redux/settings/selectors'
// import identityVerificationSaga from 'data/components/identityVerification/sagaRegister'
// import { getUserId } from 'blockchain-wallet-v4/src/redux/kvStore/userCredentials/selectors'
// import { Remote } from 'blockchain-wallet-v4'
// import TierCard from 'components/IdentityVerification/TierCard'

// import ProfileContainer, { Profile } from './index'
// import IdentityVerification from './IdentityVerification'
// import { Route, Switch } from 'react-router-dom'

// const { dispatchSpy, spyReducer } = getDispatchSpyReducer()

// jest.mock('blockchain-wallet-v4/src/redux/settings/selectors')
// jest.mock('blockchain-wallet-v4/src/redux/wallet/selectors')
// jest.mock('blockchain-wallet-v4/src/redux/kvStore/userCredentials/selectors')
// getInvitations.mockImplementation(() => Remote.of({ kyc: true }))
// getCountryCode.mockImplementation(() => Remote.of(head(eeaCountryCodes)))
// getEmailVerified.mockImplementation(() => Remote.of(0))
// getSmsVerified.mockImplementation(() => Remote.of(0))
// getUserId.mockReturnValue(Remote.of(''))

// const BuySellStub = () => <div />
// const ExchangeStub = () => <div />
// const coreSagas = {}
// const api = {
//   generateRetailToken: jest.fn(() => ({})),
//   checkUserExistence: jest.fn()
// }

// describe('Profile Settings', () => {
//   beforeEach(() => {
//     dispatchSpy.mockClear()
//   })
//   const reducers = {
//     spy: spyReducer,
//     modals: modalsReducer,
//     profile: profileReducer,
//     [paths.settingsPath]: coreReducers.settings,
//     components: combineReducers({
//       identityVerification: identityVerificationReducer
//     })
//   }
//   const sagas = [identityVerificationSaga({ api, coreSagas })]
//   let store
//   let wrapper
//   beforeEach(() => {
//     store = createTestStore(reducers, sagas)
//     store.dispatch(
//       actions.modules.profile.fetchUserDataSuccess({
//         kycState: KYC_STATES.NONE
//       })
//     )
//     store.dispatch(actions.core.settings.setMobileVerified())
//     wrapper = mount(
//       <TestBed withRouter={true} store={store}>
//         <Switch>
//           <Route exact path='/' component={ProfileContainer} />
//           <Route path='/buy-sell' component={BuySellStub} />
//           <Route path='/exchange' component={ExchangeStub} />
//         </Switch>
//       </TestBed>
//     )
//   })

//   describe('default state', () => {
//     it('should have KYC_STATE: NONE by default', () => {
//       expect(wrapper.find(Profile).prop('data')).toEqual(
//         Remote.of({
//           userData: {
//             kycState: KYC_STATES.NONE
//           },
//           userTiers: INITIAL_TIERS
//         })
//       )
//     })
//   })

//   describe('page', () => {
//     it('should render Tier Cards', () => {
//       expect(wrapper.find(TierCard)).toHaveLength(2)
//     })
//   })

//   describe('Identity Verification setting', () => {
//     describe('KYC_STATE: NONE', () => {
//       it('should trigger log kyc event on button click', () => {
//         wrapper
//           .find(IdentityVerification)
//           .at(0)
//           .find('button')
//           .at(0)
//           .simulate('click')
//         const lastAction = last(dispatchSpy.mock.calls)[0]
//         expect(path(['type'], lastAction)).toBe(
//           actionTypes.analytics.LOG_KYC_EVENT
//         )
//       })

//         it('should trigger verifyIdentity action on button click', () => {
//           wrapper
//             .find(IdentityVerification)
//             .at(0)
//             .find('button')
//             .at(0)
//             .simulate('click')
//           const lastAction = last(init(init(dispatchSpy.mock.calls)))[0]
//           expect(path(['type'], lastAction)).toBe(
//             actionTypes.components.identityVerification.VERIFY_IDENTITY
//           )
//         })

//         it('should show KYC modal on button click when user is already created', () => {
//           getUserId.mockReturnValue(Remote.of('userId'))
//           wrapper
//             .find(IdentityVerification)
//             .at(0)
//             .find('button')
//             .at(0)
//             .simulate('click')

//           const lastAction = last(dispatchSpy.mock.calls)[0]
//           expect(path(['type'], lastAction)).toBe('SHOW_MODAL')
//           expect(path(['payload', 'type'], lastAction)).toBe(KYC_MODAL)
//         })

//         it('should show KYC modal on button click when checkUser returns error', async () => {
//           getUserId.mockReturnValue(Remote.of(''))
//           api.checkUserExistence.mockRejectedValue({})
//           await wrapper
//             .find(IdentityVerification)
//             .at(0)
//             .find('button')
//             .at(0)
//             .simulate('click')

//           const lastAction = last(dispatchSpy.mock.calls)[0]
//           expect(path(['type'], lastAction)).toBe('SHOW_MODAL')
//           expect(path(['payload', 'type'], lastAction)).toBe(KYC_MODAL)
//         })

//         it('should show USER_EXISTS modal on button click when checkUser returns success', async () => {
//           getUserId.mockReturnValue(Remote.of(''))
//           api.checkUserExistence.mockResolvedValue('')
//           await wrapper
//             .find(IdentityVerification)
//             .at(0)
//             .find('button')
//             .at(0)
//             .simulate('click')

//           const lastAction = last(init(dispatchSpy.mock.calls))[0]
//           expect(path(['type'], lastAction)).toBe('SHOW_MODAL')
//           expect(path(['payload', 'type'], lastAction)).toBe(USER_EXISTS_MODAL)
//         })
//       })

//       describe('KYC_STATE: VERIFIED', () => {
//         beforeEach(() => {
//           store.dispatch(
//             actions.modules.profile.fetchUserDataSuccess({
//               kycState: KYC_STATES.VERIFIED
//             })
//           )
//           wrapper.update()
//         })
//     })
//   })
// })
