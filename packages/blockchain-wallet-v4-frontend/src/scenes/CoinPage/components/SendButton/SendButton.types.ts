import { FC } from 'react'

export type SendButtonProps = { disabled?: boolean; onClick?: () => void }

export type SendButtonComponent = FC<SendButtonProps>
