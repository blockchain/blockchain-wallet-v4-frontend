import React from 'react'
import { Provider } from 'react-redux'
import { waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'

import { RemoteConfigKey, selectors } from 'data/remoteConfig'
import { setupStore } from 'data/remoteConfig/testUtils/setupStore'
import { RootState } from 'data/rootReducer'
import { useRemoteConfigPresenter } from 'providers/RemoteConfigProvider/hooks/useRemoteConfigPresenter'

const setup = () => {
  const { apiStub, store } = setupStore()

  apiStub.getRemoteConfig.mockResolvedValueOnce({
    [RemoteConfigKey.WebFfSuperApp]: {
      asBoolean: () => true
    }
  })

  const { result } = renderHook(useRemoteConfigPresenter, {
    wrapper: ({ children }: React.PropsWithChildren<{}>) => (
      <Provider store={store}>{children}</Provider>
    )
  })

  const getState = () => store.getState() as RootState
  const { initialize } = result.current

  return {
    apiStub,
    getState,
    initialize
  }
}

describe('useRemoteConfigPresenter', () => {
  describe('when initialize is called', () => {
    it('should attempt activating cached remote config, update state and fetch config for next session', async () => {
      const { apiStub, getState, initialize } = setup()

      expect(selectors.getConfigValue(getState(), RemoteConfigKey.WebFfSuperApp)).toBe(false)

      initialize()

      await waitFor(() => expect(apiStub.activateRemoteConfig).toHaveBeenCalled())
      await waitFor(() =>
        expect(selectors.getConfigValue(getState(), RemoteConfigKey.WebFfSuperApp)).toBe(true)
      )
      await waitFor(() => expect(apiStub.fetchAndCacheRemoteConfig).toHaveBeenCalled())
    })
  })

  it('should not wait for the next config before setting activated values', async () => {
    const { apiStub, getState, initialize } = setup()
    apiStub.fetchAndCacheRemoteConfig.mockImplementationOnce(() => new Promise(() => {}))

    initialize()

    await waitFor(() =>
      expect(selectors.getConfigValue(getState(), RemoteConfigKey.WebFfSuperApp)).toBe(true)
    )
  })
})
