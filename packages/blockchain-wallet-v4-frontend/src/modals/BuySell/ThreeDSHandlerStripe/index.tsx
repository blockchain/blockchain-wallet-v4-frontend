import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import styled from 'styled-components'

import { WalletOptionsType } from '@core/types'
import { FlyoutWrapper } from 'components/Flyout'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

const CustomFlyoutWrapper = styled(FlyoutWrapper)`
  height: 100%;
`
const Iframe = styled.iframe`
  border: 0;
  width: 100%;
  height: 100%;
  margin-top: 16px;
`

const clientSecret = 'pi_3K06AsHxBe1tOCzx19pxrIdA_secret_YZdITtWnwL8rRktF7dn2Ye3gm'

const publishableKey =
  'pk_test_51JhAakHxBe1tOCzxhX2cvybhcCPMMXfQQghkI7X9VEUFMTyLvcyLVFXSkM9bjsynKmRRwLwkalcPrWJeGaNriU6S00x8XQ9VLX'

const ThreeDSHandlerStripe = ({ domains, order }: Props) => {
  return (
    <CustomFlyoutWrapper>
      <Iframe
        // src={`${domains.walletHelper}/wallet-helper/stripe/#/paymentLink/${order?.attributes?.cardProvider?.publishableKey}/${order?.attributes?.cardProvider?.clientSecret}}`}
        src={`${domains.walletHelper}/wallet-helper/stripe/#/paymentLink/${publishableKey}/${clientSecret}`}
      />
    </CustomFlyoutWrapper>
  )
}

const mapStateToProps = (state: RootState) => ({
  domains: selectors.core.walletOptions.getDomains(state).getOrElse({
    walletHelper: 'https://wallet-helper.blockchain.com'
  } as WalletOptionsType['domains']),
  order: selectors.components.buySell.getBSOrder(state)
})

const connector = connect(mapStateToProps)

type OwnProps = {
  handleClose: () => void
}

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(ThreeDSHandlerStripe)
