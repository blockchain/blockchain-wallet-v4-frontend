import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { renderHook, WrapperComponent } from '@testing-library/react-hooks'

import { useCountryList } from '.'

jest.mock('react-redux', () => {
  const originalModule = jest.requireActual('react-redux')

  return {
    ...originalModule,
    useSelector: jest.fn((selector) => selector())
  }
})

jest.mock('data', () => ({
  selectors: {
    core: {
      walletOptions: {
        getDomains: jest.fn(() => ({
          data: {
            api: 'https://api.blockchain.info'
          }
        }))
      }
    }
  }
}))

const queryClient = new QueryClient()
const wrapper: WrapperComponent<unknown> = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('useCountryList()', () => {
  const fetchSpy = jest.spyOn(global, 'fetch')

  afterAll(() => jest.resetAllMocks())

  describe('When load countries', () => {
    beforeEach(() => {
      fetchSpy.mockImplementation((() =>
        Promise.resolve({
          json: () => Promise.resolve([])
        })) as jest.Mock)
    })

    it('Should load the list of countries', async () => {
      const { result, waitFor } = renderHook(useCountryList, {
        initialProps: {
          scope: 'SIGNUP'
        },
        wrapper
      })

      await waitFor(() => result.current.isSuccess)

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.blockchain.info/nabu-gateway/countries?scope=SIGNUP'
      )
      expect(result.current.data?.countries.length).toEqual(0)
    })
  })
})
