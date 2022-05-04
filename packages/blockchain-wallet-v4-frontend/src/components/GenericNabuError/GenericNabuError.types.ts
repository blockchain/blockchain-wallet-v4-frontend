import { FC } from 'react'

import { NabuError } from 'services/errors'

type GenericNabuErrorProps = {
  error: NabuError
}

type GenericNabuErrorComponent = FC<GenericNabuErrorProps>

export type { GenericNabuErrorComponent, GenericNabuErrorProps }
