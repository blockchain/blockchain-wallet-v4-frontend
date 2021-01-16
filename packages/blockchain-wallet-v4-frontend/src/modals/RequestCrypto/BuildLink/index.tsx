import { connect, ConnectedProps } from 'react-redux'
import { Field, Form } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { CoinAccountListOption, NumberBox, TextBox } from 'components/Form'
import { FlyoutWrapper } from 'components/Flyout'
import { required } from 'services/forms'
import { selectors } from 'data'
import { SupportedWalletCurrenciesType } from 'core/redux/walletOptions/types'
import CopyClipboardButton from 'components/Clipboard/CopyClipboardButton'

import { Props as OwnProps } from '../index'
import { RequestSteps } from '../types'
import { StepHeader } from '../model'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
`
const AddressWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 40px;
  border-top: ${props => `1px solid ${props.theme.grey000}`};
  border-bottom: ${props => `1px solid ${props.theme.grey000}`};
`
const AddressDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  overflow-wrap: anywhere;
  word-break: break-all;
  hyphens: none;
`
const ClipboardWrapper = styled.div`
  margin-left: 24px;
  margin-top: 6px;
`
const FormContainer = styled(Form)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 40px 0;
  padding: 0 40px;
`
const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 40px;
  margin-top: 8px;

  & > :last-child {
    margin-top: 16px;
  }
`
const FormLabel = styled.div`
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  width: 100%;
`

class BuildLink extends React.PureComponent<Props> {
  render () {
    const {
      formValues,
      invalid,
      setStep,
      supportedCoins,
      walletCurrency
    } = this.props
    const { selectedAccount } = formValues

    // TODO: ensure selectors return next address for BCH/BTC
    const receiveAddress =
      // @ts-ignore
      selectedAccount.nextAddress || selectedAccount.address

    return (
      <Wrapper>
        <FlyoutWrapper>
          <StepHeader>
            <Icon
              cursor
              onClick={() => setStep(RequestSteps.SHOW_ADDRESS)}
              name='arrow-back'
              color='grey600'
              size='24px'
              style={{ marginRight: '20px' }}
            />
            <Text size='24px' color='grey800' weight={600}>
              <FormattedMessage
                id='modals.requestcrypto.buildlink.title'
                defaultMessage='Create Link'
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
        <AddressWrapper>
          <AddressDisplay>
            <Text color='grey600' size='14px' lineHeight='21px' weight={500}>
              <FormattedMessage id='copy.address' defaultMessage='Address' />
            </Text>
            <Text color='grey800' size='16px' weight={600} lineHeight='24px'>
              {receiveAddress}
            </Text>
          </AddressDisplay>
          <ClipboardWrapper>
            <CopyClipboardButton
              textToCopy={receiveAddress}
              color='blue600'
              size='24px'
            />
          </ClipboardWrapper>
        </AddressWrapper>
        <FormContainer>
          <FormLabel>
            <Text color='grey600' weight={500} size='14px'>
              <FormattedMessage id='copy.amount' defaultMessage='Amount' />
            </Text>
            <Text color='grey600' weight={500} size='14px'>
              USD | BTC
            </Text>
          </FormLabel>
          <Field
            autoFocus
            coin={selectedAccount.coin}
            component={NumberBox}
            data-e2e='requestAmount'
            displayCoin={false}
            name='requestAmount'
            placeholder='0.00'
            validate={[required]}
            {...{ errorBottom: true }}
          />
          <FormLabel style={{ marginTop: '24px' }}>
            <Text color='grey600' weight={500} size='14px'>
              <FormattedMessage
                id='copy.description'
                defaultMessage='Description'
              />
            </Text>
          </FormLabel>
          <Field
            component={TextBox}
            name='requestDescription'
            placeholder="What's this for?"
            validate={[required]}
            {...{ errorBottom: true }}
          />
        </FormContainer>
        <ButtonsWrapper>
          <Button
            data-e2e='createRequestLinkNext'
            disabled={invalid}
            fullwidth
            height='48px'
            nature='primary'
            onClick={() => setStep(RequestSteps.SHARE_LINK)}
          >
            <Text color='white' size='16px' weight={600}>
              <FormattedMessage id='copy.next' defaultMessage='Next' />
            </Text>
          </Button>
          <Button
            data-e2e='createRequestLinkBack'
            fullwidth
            height='48px'
            nature='empty-blue'
            onClick={() => setStep(RequestSteps.SHOW_ADDRESS)}
          >
            <Text color='blue600' size='16px' weight={600}>
              <FormattedMessage id='copy.back' defaultMessage='Back' />
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

export default connector(BuildLink)
