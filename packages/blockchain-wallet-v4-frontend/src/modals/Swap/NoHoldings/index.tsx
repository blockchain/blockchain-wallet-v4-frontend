import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import styled, { css } from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { SuccessCartridge } from 'components/Cartridge'
import { FlyoutWrapper } from 'components/Flyout'
import { actions } from 'data'

import { Border, IconBackground, TopText } from '../components'
import { Props as BaseProps } from '../index'

const FlexTopRow = styled.div`
  display: flex;
  justify-content: flex-start;
`

const CartridgeContainer = styled.div`
  display: flex;
  margin-top: 8px;
  align-items: center;
`

const DisplayContainer = styled(FlyoutWrapper)`
  display: flex;
  width: 100%;
  align-items: center;
  box-sizing: border-box;
  padding: 16px 40px;
  flex-direction: row;
  border-bottom: 1px solid ${props => props.theme.grey000};
  transition: background-color 0.3s;
  ${props =>
    props.onClick &&
    css`
      cursor: pointer;
      * {
        cursor: pointer;
      }
      &:hover {
        background-color: ${props => props.theme.blue000};
      }
    `}
`

const NoHoldings: React.FC<Props> = ({
  handleClose,
  modalActions,
  simpleBuyActions
}) => {
  return (
    <>
      <FlyoutWrapper>
        <TopText spaceBetween marginBottom>
          <Icon name='arrow-switch-thick' color='blue600' size='24px' />
          <Icon
            name='close'
            color='grey600'
            role='button'
            cursor
            onClick={handleClose}
          />
        </TopText>
        <Text size='24px' color='grey900' weight={600}>
          <FormattedMessage
            id='copy.swap_your_crypto'
            defaultMessage='Swap Your Crypto'
          />
        </Text>
        <Text
          size='16px'
          color='grey600'
          weight={500}
          style={{ marginTop: '10px' }}
        >
          <FormattedMessage
            id='copy.instantly_exchange'
            defaultMessage='Instantly exchange your crypto into any currency we offer in your wallet.'
          />
        </Text>

        <Text
          size='16px'
          color='grey800'
          weight={600}
          style={{ marginTop: '24px' }}
        >
          <FormattedMessage
            id='swap.no_holdings.own_some_first'
            defaultMessage='But you’ll need to own some first...'
          />
        </Text>
        <Text size='14px' color='grey500' weight={500}>
          <FormattedMessage
            id='swap.no_holdings.get_started'
            defaultMessage='You’re all set to Swap but we don’t see any crypto in this Wallet. Below are 3 ways to get started.'
          />
        </Text>
      </FlyoutWrapper>

      <Border />

      <DisplayContainer
        onClick={() => {
          simpleBuyActions.showModal('SwapNoHoldings')
        }}
      >
        <FlexTopRow>
          <IconBackground size='32px' style={{ marginRight: '16px' }}>
            <Icon size='16px' color='blue600' name='credit-card-sb' />
          </IconBackground>
          <div>
            <Text color='grey900' size='14px' weight={600} lineHeight='150%'>
              <FormattedMessage
                id='swap.no_holdings.buy_with_card.title'
                defaultMessage='Buy with a Card'
              />
            </Text>
            <Text size='12px' lineHeight='150%' weight={500}>
              <FormattedMessage
                id='swap.no_holdings.buy_with_card.description'
                defaultMessage='Instantly buy crypto with any Visa or Mastercard. You will need to verify your identiy to link a card'
              />
            </Text>
            <CartridgeContainer>
              <SuccessCartridge>
                <FormattedMessage
                  id='copy.most_popular'
                  defaultMessage='Most Popular'
                />
              </SuccessCartridge>
            </CartridgeContainer>
          </div>
        </FlexTopRow>
      </DisplayContainer>

      <Border />

      <DisplayContainer
        onClick={() => {
          simpleBuyActions.showModal('SwapNoHoldings')
        }}
      >
        <FlexTopRow>
          <IconBackground size='32px' style={{ marginRight: '16px' }}>
            <Text color='blue600' size='20px' weight={600}>
              <Icon size='16px' color='blue600' name='bank-filled' />
            </Text>
          </IconBackground>
          <div>
            <Text color='grey900' size='14px' weight={600} lineHeight='150%'>
              <FormattedMessage
                id='swap.no_holdings.buy_with_bank.title'
                defaultMessage='Buy with a Bank Deposit'
              />
            </Text>
            <Text size='12px' lineHeight='150%' weight={500}>
              <FormattedMessage
                id='swap.no_holdings.buy_with_bank.description'
                defaultMessage='Send cash directly from your bank. Once received, we’ll use use that balance to buy the crypto of your choice.'
              />
            </Text>
          </div>
        </FlexTopRow>
      </DisplayContainer>

      <Border />

      <DisplayContainer
        onClick={() => {
          modalActions.showModal('REQUEST_CRYPTO_MODAL', {
            origin: 'SwapNoHoldings'
          })
        }}
      >
        <FlexTopRow>
          <IconBackground size='32px' style={{ marginRight: '16px' }}>
            <Text color='blue600' size='20px' weight={600}>
              <Icon size='16px' color='blue600' name='qr-code' />
            </Text>
          </IconBackground>
          <div>
            <Text color='grey900' size='14px' weight={600} lineHeight='150%'>
              <FormattedMessage
                id='swap.no_holdings.receive_another_wallet.title'
                defaultMessage='Receive from Another Wallet'
              />
            </Text>
            <Text size='12px' lineHeight='150%' weight={500}>
              <FormattedMessage
                id='swap.no_holdings.receive_another_wallet.description'
                defaultMessage='Are you holding crypto on a different wallet? Does a friend want to send you some Bitcoin? Copy & paste or share your unique wallet addresses QR codes.'
              />
            </Text>
          </div>
        </FlexTopRow>
      </DisplayContainer>
    </>
  )
}

const mapDispatchToProps = dispatch => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(undefined, mapDispatchToProps)

const enhance = compose(connector)

type OwnProps = BaseProps & { handleClose: () => void }

export type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(NoHoldings)
