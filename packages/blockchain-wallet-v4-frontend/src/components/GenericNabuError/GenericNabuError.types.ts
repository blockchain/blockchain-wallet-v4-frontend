import { FC } from 'react'

import { NabuError } from 'services/errors'
import { NabuErrorLaunchAction } from 'services/errors/NabuError/NabuError.types'

type GenericNabuErrorProps = {
  error: NabuError
  onClickClose?: () => void
  onClickLaunch?: (action: NabuErrorLaunchAction) => void
}

type GenericNabuErrorComponent = FC<GenericNabuErrorProps>

export type { GenericNabuErrorComponent, GenericNabuErrorProps }
