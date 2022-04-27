import { FC, ReactNode } from 'react'

export type ShowWalletModalViewProps = {
  actions?: ReactNode
  body: ReactNode
  header: ReactNode
}

export type ShowWalletModalViewComponent = FC<ShowWalletModalViewProps>
