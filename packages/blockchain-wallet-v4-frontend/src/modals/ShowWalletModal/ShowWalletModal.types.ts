import { FC } from 'react'

import { CoinType } from '@core/types'
import { ModalNameType } from 'data/types'

export type ShowWalletModalProps = {
  address: string
  close?: (name: ModalNameType) => void
  coin: CoinType
  userClickedOutside?: boolean
}

export type ShowWalletModalComponent = FC<ShowWalletModalProps>
