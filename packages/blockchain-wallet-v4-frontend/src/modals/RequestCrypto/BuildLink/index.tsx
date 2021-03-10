import React from 'react'
import { FormattedMessage } from 'react-intl'
import { BaseFieldProps, Field, Form } from 'redux-form'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { Exchange } from 'blockchain-wallet-v4/src'
import { WalletCurrencyType } from 'blockchain-wallet-v4/src/types'
import CopyClipboardButton from 'components/Clipboard/CopyClipboardButton'
import { FlyoutWrapper } from 'components/Flyout'
import { CoinAccountListOption, NumberBox, TextBox } from 'components/Form'
import { required } from 'services/forms'

import { Props as OwnProps } from '..'
import { ClipboardWrapper, REQUEST_FORM, StepHeader } from '../model'
import { RequestSteps } from '../types'

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
const AmountFieldContainer = styled.div`
  display: flex;
  position: relative;
  width: 100%;
`
const CustomField = styled(Field)<
  BaseFieldProps & {
    autoFocus: boolean
    isFiatBaseCcy: boolean
    placeholder: string
  }
>`
  > input {
    padding-left: ${props => (props.isFiatBaseCcy ? '32px' : '50px')};
  }
  > div:last-child {
    display: none;
  }
`
const BaseCurrencyAbsolute = styled.div`
  position: absolute;
  top: 16px;
  left: 12px;
`
const ToggleCurrencyText = styled(Text)<{ selected?: boolean }>`
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: inline;
  color: ${props =>
    props.selected ? props.theme.blue600 : props.theme.grey800};
`

class BuildLink extends React.PureComponent<Props> {
  handleDisplayToggle = (currency: WalletCurrencyType) => {
    this.props.formActions.change(REQUEST_FORM, 'currencyDisplay', currency)
  }

  render() {
    const {
      formValues,
      invalid,
      setStep,
      supportedCoins,
      walletCurrency
    } = this.props
    const { currencyDisplay, selectedAccount } = formValues
    const currencySymbol = Exchange.getSymbol(walletCurrency) as string
    const isFiatBaseCcy = currencyDisplay === walletCurrency
    const receiveAddress =
      // @ts-ignore
      selectedAccount.nextReceiveAddress || selectedAccount.address

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
            <div style={{ display: 'inline' }}>
              <ToggleCurrencyText
                data-e2e='toggleFiat'
                onClick={() =>
                  this.handleDisplayToggle(walletCurrency as WalletCurrencyType)
                }
                selected={isFiatBaseCcy}
              >
                {walletCurrency}
              </ToggleCurrencyText>
              |{' '}
              <ToggleCurrencyText
                data-e2e='toggleCoin'
                onClick={() => this.handleDisplayToggle(selectedAccount.coin)}
                selected={!isFiatBaseCcy}
              >
                {selectedAccount.coin}
              </ToggleCurrencyText>
            </div>
          </FormLabel>
          <AmountFieldContainer>
            <CustomField
              autoFocus
              component={NumberBox}
              data-e2e='requestAmount'
              isFiatBaseCcy={isFiatBaseCcy}
              name='requestAmount'
              placeholder='0.00'
              validate={[required]}
              {...{ errorBottom: true }}
            />
            <BaseCurrencyAbsolute>
              <Text color='grey600' size='14px' weight={600}>
                {isFiatBaseCcy ? currencySymbol : selectedAccount.coin}
              </Text>
            </BaseCurrencyAbsolute>
          </AmountFieldContainer>
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

type Props = OwnProps & { setStep: (step: RequestSteps) => void }

export default BuildLink
