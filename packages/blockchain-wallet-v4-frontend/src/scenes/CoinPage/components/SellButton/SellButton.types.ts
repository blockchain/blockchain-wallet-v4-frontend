import { FC } from 'react'

export type SellButtonProps = { disabled?: boolean; onClick?: () => void }

export type SellButtonComponent = FC<SellButtonProps>
