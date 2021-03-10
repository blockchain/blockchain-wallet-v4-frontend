import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { actions } from 'data'

export const IconBackground = styled.div`
  margin-right: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  min-width: 32px;
  background-color: ${props => props.theme.blue000};
  border-radius: 40px;
`

export const FlexStartRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`

const SellEmptyState: React.FC<Props> = props => {
  return (
    <>
      <FlyoutWrapper>
        <Text
          size='20px'
          color='grey800'
          weight={600}
          style={{ marginBottom: '8px' }}
        >
          <FormattedMessage
            id='copy.crypto_selection_empty.needtoown'
            defaultMessage="You'll need to own crypto first..."
          />
        </Text>
        <Text
          size='14px'
          color='grey600'
          weight={500}
          style={{ marginBottom: '30px' }}
        >
          <FormattedMessage
            id='copy.crypto_selection_empty.getstarted'
            defaultMessage="You're all set to Sell, but we don't see any crypto in this Wallet. Below are 3 ways to get started."
          />
        </Text>
        <FlexStartRow style={{ marginBottom: '28px' }}>
          <IconBackground>
            <Icon size='16px' color='blue600' name='credit-card-sb' />
          </IconBackground>
          <div>
            <Text color='grey900' size='14px' weight={600} lineHeight='150%'>
              <FormattedMessage
                id='copy.crypto_selection_empty.buycardtitle'
                defaultMessage='Buy with a Card'
              />
            </Text>
            <Text size='12px' lineHeight='150%' weight={500}>
              <FormattedMessage
                id='copy.crypto_selection_empty.buycard'
                defaultMessage='Link any Visa or Mastercard and buy crypto. You will need to verify your identity to link a card.'
              />
            </Text>
          </div>
        </FlexStartRow>
        <FlexStartRow style={{ marginBottom: '28px' }}>
          <IconBackground>
            <Icon name='bank-filled' color='blue600' size='20px' />
          </IconBackground>
          <div>
            <Text color='grey900' size='14px' weight={600} lineHeight='150%'>
              <FormattedMessage
                id='copy.crypto_selection_empty.buybanktitle'
                defaultMessage='Buy with a Bank Deposit'
              />
            </Text>
            <Text size='12px' lineHeight='150%' weight={500}>
              <FormattedMessage
                id='copy.crypto_selection_empty.buybank'
                defaultMessage="Send cash directly from your bank. Once received, we'll use that balance to buy the crypto of your choice"
              />
            </Text>
          </div>
        </FlexStartRow>
        <FlexStartRow style={{ marginBottom: '62px' }}>
          <IconBackground>
            <Icon name='send' color='blue600' size='20px' />
          </IconBackground>
          <div>
            <Text color='grey900' size='14px' weight={600} lineHeight='150%'>
              <FormattedMessage
                id='copy.crypto_selection_empty.receivetitle'
                defaultMessage='Receive from Another Wallet'
              />
            </Text>
            <Text size='12px' lineHeight='150%' weight={500}>
              <FormattedMessage
                id='copy.crypto_selection_empty.receive'
                defaultMessage='Are you holding crypto on a different wallet? Does a friend want to send you some Bitcoin? Copy and paste or share your unique wallet addresses QR codes.'
              />
            </Text>
          </div>
        </FlexStartRow>
        <Button
          nature='primary'
          data-e2e='sellEmptyBuyCta'
          height='48px'
          onClick={() =>
            props.simpleBuyActions.showModal('SellEmpty', 'BTC', 'BUY')
          }
          fullwidth
        >
          <FormattedMessage
            id='modals.wallet.welcome.sb.button'
            defaultMessage='Buy Crypto Now'
          />
        </Button>
      </FlyoutWrapper>
    </>
  )
}

const mapDispatchToProps = dispatch => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type Props = ConnectedProps<typeof connector> & { handleClose: () => void }

export default connector(SellEmptyState)
