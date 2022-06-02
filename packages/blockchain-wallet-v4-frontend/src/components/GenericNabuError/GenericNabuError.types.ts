import { FC } from 'react'

import { NabuError } from 'services/errors'

type GenericNabuErrorProps = {
  error: NabuError
  onDismiss?: () => void
}

type GenericNabuErrorComponent = FC<GenericNabuErrorProps>

export type { GenericNabuErrorComponent, GenericNabuErrorProps }
