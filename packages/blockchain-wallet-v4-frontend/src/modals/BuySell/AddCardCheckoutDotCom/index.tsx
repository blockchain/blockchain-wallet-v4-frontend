import React, { useEffect } from 'react'
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

const AddCardCheckoutDotCom = ({
  checkoutDotComAccountCodes = [],
  checkoutDotComApiKey,
  domains
}: Props) => {
  const handlePostMessage = async ({
    data
  }: {
    data: { provider: 'checkoutdotcom'; status: 'error' | 'success'; token?: string }
  }) => {
    if (data.provider !== 'checkoutdotcom') return

    if (data.status === 'error') {
      // eslint-disable-next-line no-console
      console.error('ERROR')
    }

    if (data.status === 'success' && data.token) {
      const paymentMethodTokens = checkoutDotComAccountCodes.reduce((prev, curr) => {
        return {
          ...prev,
          [curr]: data.token
        }
      }, {})

      // eslint-disable-next-line no-console
      console.log(paymentMethodTokens)
    }
  }

  useEffect(() => {
    window.addEventListener('message', handlePostMessage, false)

    return () => window.removeEventListener('message', handlePostMessage, false)
  })

  return (
    <CustomFlyoutWrapper>
      <Iframe
        src={`${domains.walletHelper}/wallet-helper/checkoutdotcom/#/add-card/${checkoutDotComApiKey}`}
      />
    </CustomFlyoutWrapper>
  )
}

const mapStateToProps = (state: RootState) => ({
  checkoutDotComAccountCodes: selectors.components.buySell.getCheckoutAccountCodes(state),
  checkoutDotComApiKey: selectors.components.buySell.getCheckoutApiKey(state),
  domains: selectors.core.walletOptions.getDomains(state).getOrElse({
    walletHelper: 'https://wallet-helper.blockchain.com'
  } as WalletOptionsType['domains'])
})

const connector = connect(mapStateToProps)

type OwnProps = {
  handleClose: () => void
}

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(AddCardCheckoutDotCom)
