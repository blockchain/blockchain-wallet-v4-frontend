import { FC, MouseEventHandler } from 'react'

import { NabuError, NabuErrorAction } from 'services/errors'

export type GenericNabuErrorCardVariant = 'warning' | 'error'

export type GenericNabuErrorCardProps = {
  error: NabuError
  onActionClick?: (action: NabuErrorAction) => void
  onClickClose?: MouseEventHandler<HTMLButtonElement>
  variant?: GenericNabuErrorCardVariant
}

export type GenericNabuErrorCardComponent = FC<GenericNabuErrorCardProps>
