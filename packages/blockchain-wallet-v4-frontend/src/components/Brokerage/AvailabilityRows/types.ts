import { FC } from 'react'

import { DepositTerms } from 'data/types'

type AvailabilityRowsProps = {
  depositTerms?: DepositTerms
}

export type AvailabilityRowsComponent = FC<AvailabilityRowsProps>
