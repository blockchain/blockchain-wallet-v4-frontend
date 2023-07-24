import React, { useEffect } from 'react'

import BaseError from 'components/BuySell/Error'
import { GenericNabuErrorFlyout } from 'components/GenericNabuErrorFlyout'
import { notReachable } from 'utils/helpers'

import Loading from '../template.loading'
import {
  useConfirmingBuyOrderPresenter,
  ViewModelType
} from './hooks/useConfirmingBuyOrderPresenter'

export const ConfirmingBuyOrder = () => {
  const { onError, viewModel } = useConfirmingBuyOrderPresenter()

  useEffect(() => {
    if (viewModel.type !== ViewModelType.Loading) {
      onError(viewModel.error)
    }
  }, [viewModel, onError])

  switch (viewModel.type) {
    case ViewModelType.Loading:
      return <Loading />
    case ViewModelType.NabuError:
      return <GenericNabuErrorFlyout error={viewModel.error} onDismiss={viewModel.handleError} />
    case ViewModelType.GenericError:
      return (
        <BaseError
          code={viewModel.error}
          handleRetry={viewModel.handleError}
          handleReset={viewModel.handleError}
          handleBack={viewModel.handleError}
        />
      )
    default:
      return notReachable(viewModel)
  }
}
