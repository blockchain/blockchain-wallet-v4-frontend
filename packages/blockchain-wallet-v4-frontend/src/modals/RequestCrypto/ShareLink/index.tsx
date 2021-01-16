import { connect, ConnectedProps } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { CoinAccountListOption } from 'components/Form'
import { FlyoutWrapper } from 'components/Flyout'
import { selectors } from 'data'
import { SupportedWalletCurrenciesType } from 'core/redux/walletOptions/types'
import CopyClipboardButton from 'components/Clipboard/CopyClipboardButton'
import QRCodeWrapper from 'components/QRCode/Wrapper'

import { Props as OwnProps } from '../index'
import { RequestSteps } from '../types'
import { StepHeader } from '../model'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
const LinkWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 40px;
  border-top: ${props => `1px solid ${props.theme.grey000}`};
  border-bottom: ${props => `1px solid ${props.theme.grey000}`};
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
  margin: 40px 0 36px;
  width: 100%;
`
const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 40px;

  & > :last-child {
    margin-top: 16px;
  }
`

class ShareLink extends React.PureComponent<Props> {
  render () {
    const { formValues, setStep, supportedCoins, walletCurrency } = this.props
    const { selectedAccount } = formValues

    const tempUrl = 'https://blockchain.com/btc/payment_requ'

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
            value={tempUrl}
          />
        </QRCodeContainer>
        <LinkWrapper>
          <LinkDisplay>
            <Text color='grey600' size='14px' lineHeight='21px' weight={500}>
              Your Link
            </Text>
            <Text color='grey800' size='16px' weight={600} lineHeight='24px'>
              {tempUrl}
            </Text>
          </LinkDisplay>
          <div style={{ marginLeft: '40px', marginTop: '6px' }}>
            <CopyClipboardButton
              textToCopy={tempUrl}
              color='blue600'
              size='24px'
            />
          </div>
        </LinkWrapper>
        <ButtonsWrapper>
          <Button
            data-e2e='copyRequestLink'
            fullwidth
            height='48px'
            nature='primary'
            onClick={() => {}}
          >
            <Text color='white' size='16px' weight={600}>
              <FormattedMessage
                id='modals.requestcrypto.sharelink.copy'
                defaultMessage='Copy Link'
              />
            </Text>
          </Button>
          <Button
            data-e2e='cancelRequestLink'
            fullwidth
            height='48px'
            nature='empty-blue'
            onClick={() => setStep(RequestSteps.BUILD_LINK)}
          >
            <Text color='blue600' size='16px' weight={600}>
              <FormattedMessage id='copy.cancel' defaultMessage='Cancel' />
            </Text>
          </Button>
        </ButtonsWrapper>
      </Wrapper>
    )
  }
}

const mapStateToProps = state => ({
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrElse({} as SupportedWalletCurrenciesType)
})

const connector = connect(mapStateToProps)
type Props = ConnectedProps<typeof connector> &
  OwnProps & {
    setStep: (step: RequestSteps) => void
  }

export default connector(ShareLink)
