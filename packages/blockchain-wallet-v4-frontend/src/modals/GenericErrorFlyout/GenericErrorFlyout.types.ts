import { FC, ReactNode } from 'react'

import { ModalNameType } from 'data/types'

export type GenericErrorFlyoutProps = {
  actions?: ReactNode
  close?: (name: ModalNameType) => null
  userClickedOutside?: boolean
}

export type GenericErrorFlyoutComponent = FC<GenericErrorFlyoutProps>
