import { FC } from 'react'

import { NabuError } from 'services/errors'

type GenericNabuErrorFlyoutProps = {
  error: NabuError
  onDismiss?: () => void
}

type GenericNabuErrorFlyoutComponent = FC<GenericNabuErrorFlyoutProps>

export type { GenericNabuErrorFlyoutComponent, GenericNabuErrorFlyoutProps }
