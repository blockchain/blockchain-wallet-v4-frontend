import { FC } from 'react'

type WalletLayoutProps = {
  center?: boolean
  hideMenu?: boolean
  pathname: string
}

type WalletLayoutComponent = FC<WalletLayoutProps>

export type { WalletLayoutComponent, WalletLayoutProps }
