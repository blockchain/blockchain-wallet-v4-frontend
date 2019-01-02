import { actions, selectors } from 'data'

import AutoDisconnectionMiddleware, {
  BLACKLISTED_ACTION_TYPES,
  DEFAULT_LOGOUT_TIME
} from './autoDisconnection'

jest.useFakeTimers()

const store = {
  getState: jest.fn(() => {}),
  dispatch: jest.fn()
}
const next = jest.fn()
const autoDisconnectionMiddleware = AutoDisconnectionMiddleware()
const startAction = actions.auth.startLogoutTimer()
const getLogoutTime = jest.spyOn(selectors.core.wallet, 'getLogoutTime')
getLogoutTime.mockImplementation(() => null)

describe('Auto Disconnection middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  it('should propagate every action', () => {
    const stubAction = {}
    autoDisconnectionMiddleware(store)(next)(stubAction)

    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(stubAction)
  })

  it('should logout after start action was fired and logout time set in wallet options has passed', () => {
    const logoutTime = 10000
    getLogoutTime.mockImplementationOnce(() => logoutTime)
    const middleware = autoDisconnectionMiddleware(store)(next)
    middleware(startAction)

    jest.advanceTimersByTime(logoutTime)
    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(
      actions.modals.showModal('AutoDisconnection', {
        duration: logoutTime / 1000 / 60
      })
    )
  })

  it("should logout after start action was fired and default logout time has passed if there's no period set in options", () => {
    const middleware = autoDisconnectionMiddleware(store)(next)
    middleware(startAction)

    jest.advanceTimersByTime(DEFAULT_LOGOUT_TIME)
    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(
      actions.modals.showModal('AutoDisconnection', {
        duration: DEFAULT_LOGOUT_TIME / 1000 / 60
      })
    )
  })

  it('should prolong period if action is fired', () => {
    const middleware = autoDisconnectionMiddleware(store)(next)
    const actionTime = 1000
    middleware(startAction)

    jest.advanceTimersByTime(actionTime)
    middleware(
      actions.components.identityVerification.fetchSupportedCountries()
    )
    jest.advanceTimersByTime(DEFAULT_LOGOUT_TIME - actionTime)
    expect(store.dispatch).toHaveBeenCalledTimes(0)
    jest.advanceTimersByTime(actionTime)
    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(
      actions.modals.showModal('AutoDisconnection', {
        duration: DEFAULT_LOGOUT_TIME / 1000 / 60
      })
    )
  })

  it('should not prolong period if action is blacklisted', () => {
    const middleware = autoDisconnectionMiddleware(store)(next)
    const actionTime = 1000

    BLACKLISTED_ACTION_TYPES.forEach(type => {
      jest.clearAllTimers()
      jest.clearAllMocks()
      middleware(startAction)

      jest.advanceTimersByTime(actionTime)
      expect(store.dispatch).toHaveBeenCalledTimes(0)
      middleware({ type })
      jest.advanceTimersByTime(DEFAULT_LOGOUT_TIME - actionTime)
      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith(
        actions.modals.showModal('AutoDisconnection', {
          duration: DEFAULT_LOGOUT_TIME / 1000 / 60
        })
      )
    })
  })
})
