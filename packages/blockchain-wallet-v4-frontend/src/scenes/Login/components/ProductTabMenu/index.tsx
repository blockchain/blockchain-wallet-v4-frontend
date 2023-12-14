import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { push } from 'connected-react-router'
import styled from 'styled-components'

import { Image, Text } from 'blockchain-info-components'
import { actions } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import { getProduct } from 'data/auth/selectors'
import { LoginSteps, ProductAuthOptions } from 'data/auth/types'
import { getCache } from 'data/cache/selectors'

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
  isMobilePlatform,
  product
}: {
  isMobilePlatform?: boolean
  product?: ProductAuthOptions
}) => {
  const dispatch = useDispatch()
  const { exchangeEmail, guidStored, lastEmail, lastGuid } = useSelector(getCache)
  const activeProduct = useSelector(getProduct)

  const exchangeTabClick = () => {
    dispatch(actions.auth.setProductAuthMetadata({ product: ProductAuthOptions.EXCHANGE }))
    if (exchangeEmail) {
      actions.form.change(LOGIN_FORM, 'exchangeEmail', exchangeEmail)
      actions.form.change(LOGIN_FORM, 'step', LoginSteps.ENTER_PASSWORD_EXCHANGE)
    } else {
      actions.form.change(LOGIN_FORM, 'step', LoginSteps.ENTER_EMAIL_GUID)
    }
    dispatch(push('/login?product=exchange'))
  }

  const walletTabClick = () => {
    dispatch(actions.auth.setProductAuthMetadata({ product: ProductAuthOptions.WALLET }))
    if (guidStored || lastGuid) {
      actions.form.change(LOGIN_FORM, 'guid', lastGuid || guidStored)
      actions.form.change(LOGIN_FORM, 'email', lastEmail)
      actions.form.change(LOGIN_FORM, 'step', LoginSteps.ENTER_PASSWORD_WALLET)
    } else {
      actions.form.change(LOGIN_FORM, 'step', LoginSteps.ENTER_EMAIL_GUID)
    }
    dispatch(push('/login?product=wallet'))
  }

  const isWalletActive = activeProduct === ProductAuthOptions.WALLET
  // if webview is being opened from exchange mobile app
  // want to hide the wallet tab
  const hideWalletTab = isMobilePlatform && product === ProductAuthOptions.EXCHANGE
  return (
    <TabWrapper>
      {!hideWalletTab && (
        <ProductTab
          product={ProductAuthOptions.WALLET}
          onClick={walletTabClick}
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
        onClick={exchangeTabClick}
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
