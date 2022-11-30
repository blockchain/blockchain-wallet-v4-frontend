import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'
import reduxForm, { InjectedFormProps } from 'redux-form/lib/reduxForm'
import styled from 'styled-components'

import { Remote } from '@core'
import { Button, Icon, Text } from 'blockchain-info-components'
import { ErrorCartridge } from 'components/Cartridge'
import { FlyoutWrapper } from 'components/Flyout'
import { StepHeader } from 'components/Flyout/SendRequestCrypto'
import CoinAccountListOption from 'components/Form/CoinAccountListOption'
import Form from 'components/Form/Form'
import TextBox from 'components/Form/TextBox'
import TextWithQRScanner from 'components/Form/TextWithQRScanner'
import { NetworkWarning, NetworkWarningVariant } from 'components/NetworkWarning'
import { SendCryptoStepType } from 'data/components/sendCrypto/types'
import { debounce } from 'utils/helpers'

import { Props as OwnProps } from '..'
import { FormLabelWithBorder, SEND_FORM } from '../model'

const Wrapper = styled(Form)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100%;
`
const FieldWrapper = styled(FlyoutWrapper)`
  display: flex;
  padding-top: 24px;
  padding-bottom: 12px;
`
const ErrorWrapper = styled(FlyoutWrapper)`
  display: flex;
  padding-bottom: 0px;
  padding-top: 0px;
`
const ActionWrapper = styled(FlyoutWrapper)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

class SendEnterTo extends React.PureComponent<InjectedFormProps<{}, Props> & Props> {
  componentDidMount() {
    this.props.sendCryptoActions.fetchWithdrawalFees({
      account: this.props.formValues.selectedAccount
    })
  }

  render() {
    const { formValues, isValidAddress, sendCryptoActions, walletCurrency } = this.props
    const { selectedAccount, to } = formValues

    const { coinfig } = window.coins[selectedAccount.coin]

    const valid = isValidAddress.cata({
      Failure: () => false,
      Loading: () => false,
      NotAsked: () => false,
      Success: (res) => res
    })
    const disabled = !Remote.Success.is(isValidAddress) || !valid

    return (
      <Wrapper
        onSubmit={() => sendCryptoActions.setStep({ step: SendCryptoStepType.ENTER_AMOUNT })}
      >
        <div>
          <FlyoutWrapper>
            <StepHeader>
              <Icon
                cursor
                onClick={() =>
                  sendCryptoActions.setStep({ step: SendCryptoStepType.COIN_SELECTION })
                }
                role='button'
                name='arrow-back'
                color='grey600'
                size='24px'
                style={{ marginRight: '20px' }}
              />
              <Text size='24px' color='grey800' weight={600}>
                <FormattedMessage id='modals.sendcrypto.enteramount.title' defaultMessage='Send' />
              </Text>
            </StepHeader>
          </FlyoutWrapper>
          <CoinAccountListOption
            account={selectedAccount}
            walletCurrency={walletCurrency}
            coin={selectedAccount.coin}
            displayOnly
            hideActionIcon
          />
          <FormLabelWithBorder>
            <FormattedMessage id='copy.to' defaultMessage='To' />
          </FormLabelWithBorder>
          <FieldWrapper>
            <Field
              name='to'
              // @ts-ignore
              component={TextWithQRScanner}
              onScan={(data) => this.props.formActions.change(SEND_FORM, 'to', data)}
              onChange={debounce((e) => {
                this.props.sendCryptoActions.validateAddress({
                  address: e.currentTarget.value,
                  coin: selectedAccount.coin
                })
              }, 100)}
              placeholder={`${coinfig.name} Address`}
            />
          </FieldWrapper>
          {isValidAddress.cata({
            Failure: () => null,
            Loading: () => null,
            NotAsked: () => null,
            Success: (val) => {
              return val ? null : (
                <ErrorWrapper>
                  <ErrorCartridge>
                    <FormattedMessage id='copy.invalid_addr' defaultMessage='Invalid Address' />
                  </ErrorCartridge>
                </ErrorWrapper>
              )
            }
          })}
          {coinfig.type.isMemoBased ? (
            <>
              <FormLabelWithBorder>
                <FormattedMessage id='copy.memo' defaultMessage='Memo' />
              </FormLabelWithBorder>
              <FieldWrapper>
                <Field component={TextBox} type='text' name='memo' />
              </FieldWrapper>
            </>
          ) : null}
        </div>
        <ActionWrapper>
          <NetworkWarning coin={selectedAccount.coin} variant={NetworkWarningVariant.SEND} />

          <Button
            nature='primary'
            type='submit'
            data-e2e='enterToBtn'
            fullwidth
            jumbo
            disabled={!to || disabled}
          >
            <FormattedMessage id='buttons.next' defaultMessage='Next' />
          </Button>
        </ActionWrapper>
      </Wrapper>
    )
  }
}

type Props = OwnProps

export default reduxForm<{}, Props>({
  destroyOnUnmount: false,
  form: SEND_FORM
})(SendEnterTo)
