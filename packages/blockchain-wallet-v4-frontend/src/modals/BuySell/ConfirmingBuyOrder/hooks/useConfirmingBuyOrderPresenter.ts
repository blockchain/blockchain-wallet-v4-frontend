import { useDispatch, useSelector } from 'react-redux'

import Remote from '@core/remote'
import { actions, selectors } from 'data'
import { Analytics } from 'data/analytics/types'
import { isNabuError, NabuError } from 'services/errors'

export enum ViewModelType {
  Loading,
  GenericError,
  NabuError
}

const makeErrorViewModel = (error: string | number | Error, handleError: () => void) => {
  if (isNabuError(error)) {
    return {
      error,
      handleError,
      type: ViewModelType.NabuError as const
    }
  }

  return {
    error,
    handleError,
    type: ViewModelType.GenericError as const
  }
}

const makeLoadingViewModel = () => ({
  type: ViewModelType.Loading as const
})

const useErrorHandler = () => {
  const dispatch = useDispatch()
  const cachedOrder = useSelector(selectors.components.buySell.getBSPendingOrder)

  const handleError = () => {
    if (cachedOrder) {
      dispatch(actions.components.buySell.cancelOrder(cachedOrder))
      return
    }

    dispatch(actions.components.buySell.destroyCheckout())
  }

  return { handleError }
}

const useOnError = () => {
  const dispatch = useDispatch()

  const onError = (error: string | number | Error | NabuError) => {
    const errorPayload = error instanceof Error ? error : { network_error_description: `${error}` }
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.CLIENT_ERROR,
        properties: {
          ...errorPayload,
          action: 'ConfirmingBuyOrder',
          error: 'OOPS_ERROR',
          source: 'NABU',
          title: 'Oops! Something went wrong'
        }
      })
    )
  }

  return {
    onError
  }
}

export const useConfirmingBuyOrderPresenter = () => {
  const orderR = useSelector(selectors.components.buySell.getBSOrder)
  const { onError } = useOnError()
  const { handleError } = useErrorHandler()

  const viewModel = Remote.Failure.is(orderR)
    ? makeErrorViewModel(orderR.error, handleError)
    : makeLoadingViewModel()

  return {
    onError,
    viewModel
  }
}
