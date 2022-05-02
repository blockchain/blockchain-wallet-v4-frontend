import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Image, Text } from 'blockchain-info-components'
import { PlatformTypes, ProductAuthOptions } from 'data/auth/types'

const TabWrapper = styled.div`
  display: flex;
  width: 100%;
`
const ProductTab = styled.div<{
  hideWalletTab?: boolean
  isActive: boolean
  product?: ProductAuthOptions
}>`
  display: flex;
  justify-content: center;
  width: ${(props) => (props.hideWalletTab ? '100%' : '50%')};
  align-items: center;
  padding: 16px 0;
  cursor: pointer;
  border-radius: ${(props) =>
    props.hideWalletTab
      ? '8px 8px 0 0'
      : props.product === ProductAuthOptions.WALLET
      ? ' 8px 0 0 0 '
      : '0 8px 0 0'};
  background-color: ${(props) =>
    !props.isActive || props.hideWalletTab ? props.theme.grey000 : 'none'};
`
const ProductIcon = styled(Image)`
  margin-right: 12px;
`

const ProductTabMenu = ({
  active,
  onExchangeTabClick,
  onWalletTabClick,
  platform,
  product
}: {
  active: ProductAuthOptions
  onExchangeTabClick?: () => void
  onWalletTabClick?: () => void
  platform?: PlatformTypes
  product?: ProductAuthOptions
}) => {
  const isWalletActive = active === ProductAuthOptions.WALLET
  // if webview is being opened from exchange mobile app
  // want to hide the wallet tab
  const hideWalletTab =
    (platform === PlatformTypes.ANDROID || platform === PlatformTypes.IOS) &&
    product === ProductAuthOptions.EXCHANGE
  return (
    <TabWrapper>
      {!hideWalletTab && (
        <ProductTab
          product={ProductAuthOptions.WALLET}
          onClick={onWalletTabClick}
          isActive={isWalletActive}
        >
          <ProductIcon
            name={isWalletActive ? 'wallet-no-background' : 'wallet-grayscale'}
            height='28px'
          />
          <Text size='20px' weight={600} color={isWalletActive ? 'purple600' : 'grey400'}>
            <FormattedMessage id='copy.wallet' defaultMessage='Wallet' />
          </Text>
        </ProductTab>
      )}
      <ProductTab
        isActive={!isWalletActive}
        onClick={onExchangeTabClick}
        hideWalletTab={hideWalletTab}
        product={ProductAuthOptions.EXCHANGE}
      >
        <ProductIcon
          name={isWalletActive ? 'exchange-grayscale' : 'exchange-no-background'}
          height='26px'
        />
        <Text size='20px' weight={600} color={isWalletActive ? 'grey400' : 'blue600'}>
          <FormattedMessage id='copy.exchange' defaultMessage='Exchange' />
        </Text>
      </ProductTab>
    </TabWrapper>
  )
}

export default ProductTabMenu
