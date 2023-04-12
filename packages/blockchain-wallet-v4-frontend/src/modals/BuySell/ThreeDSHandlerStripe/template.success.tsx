import React from 'react'
import styled from 'styled-components'

import { FlyoutWrapper } from 'components/Flyout'

import { SuccessStateType } from '.'

const CustomFlyoutWrapper = styled(FlyoutWrapper)`
  height: 100%;
`
const Iframe = styled.iframe`
  border: 0;
  width: 100%;
  height: 100%;
  margin-top: 16px;
`

const Success = ({ clientSecret, domains, publishableApiKey }: Props) => (
  <CustomFlyoutWrapper>
    <Iframe
      allow='payment *; publickey-credentials-get *'
      sandbox='allow-forms allow-scripts allow-same-origin'
      src={`${domains.walletHelper}/wallet-helper/stripe/#/paymentLink/${publishableApiKey}/${clientSecret}`}
    />
  </CustomFlyoutWrapper>
)

export type Props = SuccessStateType & {
  clientSecret: string
  handleBack: () => void
  publishableApiKey: string
}

export default Success
