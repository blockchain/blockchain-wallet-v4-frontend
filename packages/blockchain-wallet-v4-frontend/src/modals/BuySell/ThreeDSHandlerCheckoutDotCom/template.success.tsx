import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { getDomains } from '@core/redux/walletOptions/selectors'
import { Icon } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'

const CustomFlyoutWrapper = styled(FlyoutWrapper)`
  height: 100%;
`
const Iframe = styled.iframe`
  border: 0;
  width: 100%;
  height: 100%;
  margin-top: 16px;
`

const Success = ({ handleBack, paymentLink }: Props) => {
  const domains = useSelector(getDomains).getOrElse({
    walletHelper: 'https://wallet-helper.blockchain.com'
  })
  return (
    <CustomFlyoutWrapper>
      <Icon
        cursor
        name='arrow-left'
        size='20px'
        color='grey600'
        role='button'
        onClick={handleBack}
      />
      <Iframe
        sandbox='allow-forms allow-scripts allow-same-origin'
        src={`${domains.walletHelper}/wallet-helper/checkoutdotcom/#/paymentLink/${paymentLink}`}
      />
    </CustomFlyoutWrapper>
  )
}

type Props = { handleBack: () => void; paymentLink: string }

export default Success
