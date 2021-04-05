import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import bip21 from 'bip21'
import styled from 'styled-components'

import { Button, Icon, Text, TextGroup } from 'blockchain-info-components'
import { Exchange } from 'blockchain-wallet-v4/src'
import CopyClipboardButton from 'components/Clipboard/CopyClipboardButton'
import { FlyoutWrapper } from 'components/Flyout'
import { CoinAccountListOption } from 'components/Form'
import QRCodeWrapper from 'components/QRCode/Wrapper'
import { selectors } from 'data'

import { Props as OwnProps } from '../index'
import { ClipboardWrapper, StepHeader } from '../model'
import { RequestSteps } from '../types'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
const SectionWrapper = styled.div<{ center?: boolean; direction?: string }>`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  justify-content: space-between;
  align-items: ${props => (props.center ? 'center' : 'flex-start')};
  padding: 16px 40px;
  border-top: ${props => `1px solid ${props.theme.grey000}`};
`
const LinkDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  overflow-wrap: anywhere;
  word-break: break-all;
  hyphens: none;
`
const QRCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px 0;
  width: 100%;
  border-top: ${props => `1px solid ${props.theme.grey000}`};
`
const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  border-top: ${props => `1px solid ${props.theme.grey000}`};
`

class ShareLink extends React.PureComponent<Props> {
  render() {
    const {
      formValues,
      handleClose,
      rates,
      setStep,
      supportedCoins,
      walletCurrency
    } = this.props
    const {
      currencyDisplay,
      requestAmount,
      requestDescription,
      selectedAccount
    } = formValues
    const receiveAddress =
      // @ts-ignore
      selectedAccount.nextReceiveAddress || selectedAccount.address

    const currencySymbol = Exchange.getSymbol(walletCurrency) as string
    const coinAmount =
      currencyDisplay === walletCurrency
        ? Exchange.convertFiatToCoin(
            requestAmount,
            selectedAccount.coin,
            walletCurrency,
            rates
          )
        : requestAmount
    const fiatAmount =
      currencyDisplay === walletCurrency
        ? requestAmount
        : Exchange.convertCoinToFiat(
            requestAmount,
            selectedAccount.coin,
            walletCurrency,
            rates
          )

    const requestLink = `https://blockchain.com/${selectedAccount.coin.toLowerCase()}/payment_request?address=${receiveAddress}&amount=${coinAmount}&message=${requestDescription}`
    const requestLinkBip21 = bip21.encode(receiveAddress, {
      amount: coinAmount,
      label: requestDescription
    })

    return (
      <Wrapper>
        <FlyoutWrapper>
          <StepHeader>
            <Icon
              cursor
              onClick={() => setStep(RequestSteps.BUILD_LINK)}
              name='arrow-back'
              color='grey600'
              size='24px'
              style={{ marginRight: '20px' }}
            />
            <Text size='24px' color='grey800' weight={600}>
              <FormattedMessage
                id='modals.requestcrypto.sharelink.title'
                defaultMessage='Share Link'
              />
            </Text>
          </StepHeader>
        </FlyoutWrapper>
        <CoinAccountListOption
          account={selectedAccount}
          coinModel={supportedCoins[selectedAccount.coin]}
          displayOnly
          hideActionIcon
          walletCurrency={walletCurrency}
        />
        <QRCodeContainer>
          <QRCodeWrapper
            data-e2e='requestLinkQrCode'
            size={280}
            value={requestLinkBip21}
          />
        </QRCodeContainer>
        <SectionWrapper center>
          <LinkDisplay>
            <Text color='grey600' size='14px' lineHeight='21px' weight={500}>
              <FormattedMessage id='copy.yourlink' defaultMessage='Your Link' />
            </Text>
            <Text color='grey800' size='16px' weight={600} lineHeight='21px'>
              {requestLink.substr(0, 38)}…
            </Text>
          </LinkDisplay>
          <ClipboardWrapper>
            <CopyClipboardButton
              textToCopy={requestLink}
              color='blue600'
              size='24px'
            />
          </ClipboardWrapper>
        </SectionWrapper>
        <SectionWrapper direction='column'>
          <Text color='grey600' size='14px' lineHeight='21px' weight={500}>
            <FormattedMessage id='copy.amount' defaultMessage='Amount' />
          </Text>
          <TextGroup inline>
            <Text color='grey800' size='16px' weight={600} lineHeight='21px'>
              {coinAmount} {selectedAccount.coin}
            </Text>
            <Text color='grey600' size='16px' weight={600} lineHeight='21px'>
              ({currencySymbol}
              {Exchange.displayFiatToFiat({ value: fiatAmount })})
            </Text>
          </TextGroup>
        </SectionWrapper>
        <SectionWrapper direction='column'>
          <Text color='grey600' size='14px' lineHeight='21px' weight={500}>
            <FormattedMessage
              id='copy.description'
              defaultMessage='Description'
            />
          </Text>
          <Text color='grey800' size='16px' weight={600} lineHeight='21px'>
            {requestDescription}
          </Text>
        </SectionWrapper>
        <ButtonsWrapper>
          <Button
            data-e2e='copyRequestLink'
            fullwidth
            height='48px'
            nature='primary'
            onClick={handleClose}
          >
            <Text color='white' size='16px' weight={600}>
              <FormattedMessage id='copy.close' defaultMessage='Close' />
            </Text>
          </Button>
        </ButtonsWrapper>
      </Wrapper>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  rates: selectors.core.data.misc
    .getRatesSelector(
      ownProps.formValues?.selectedAccount?.coin || 'BTC',
      state
    )
    .getOrFail('Failed to get coin rates')
})

const connector = connect(mapStateToProps)
type Props = ConnectedProps<typeof connector> &
  OwnProps & {
    handleClose: () => void
    setStep: (step: RequestSteps) => void
  }

export default connector(ShareLink)
