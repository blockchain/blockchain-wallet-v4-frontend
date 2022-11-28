import { FC } from 'react'

export type UpdateSecurityCodeProps = {
  backToEnterAmount: () => void
  handleClose: () => void
}

export type UpdateSecurityCodeComponent = FC<UpdateSecurityCodeProps>
