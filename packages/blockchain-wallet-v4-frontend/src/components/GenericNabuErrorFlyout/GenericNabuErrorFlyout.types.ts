import { FC } from 'react'

import { NabuError } from 'services/errors'

type GenericNabuErrorFlyoutProps = {
  error: NabuError
  onClickClose?: () => void
}

type GenericNabuErrorFlyoutComponent = FC<GenericNabuErrorFlyoutProps>

export type { GenericNabuErrorFlyoutComponent, GenericNabuErrorFlyoutProps }
