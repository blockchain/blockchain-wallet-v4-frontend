import { FC } from 'react'

export type AppleAndGooglePayBannerViewProps = {
  onClick?: () => void
  onClickClose?: () => void
}

export type AppleAndGooglePayBannerViewComponent = FC<AppleAndGooglePayBannerViewProps>
