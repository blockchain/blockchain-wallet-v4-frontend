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
import { CoinAccountListOption, Form } from 'components/Form'
import TextWithQRScanner from 'components/Form/TextWithQRScanner'
import { SendCryptoStepType } from 'data/components/sendCrypto/types'
import { debounce } from 'utils/helpers'

import { Props as OwnProps } from '..'
import { FormLabelWithBorder, SEND_FORM } from '../model'
import { INVALID_ADDR } from './validation'

const Wrapper = styled(Form)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100%;
`
const ToWrapper = styled(FlyoutWrapper)`
  display: flex;
  padding-top: 24px;
  padding-bottom: 12px;
`
const ErrorWrapper = styled(FlyoutWrapper)`
  display: flex;
  padding-top: 0px;
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
          <ToWrapper>
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
          </ToWrapper>
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
        </div>
        <FlyoutWrapper>
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
        </FlyoutWrapper>
      </Wrapper>
    )
  }
}

type Props = OwnProps & {
  formErrors: {
    to?: typeof INVALID_ADDR | boolean
  }
}

export default reduxForm<{}, Props>({
  destroyOnUnmount: false,
  form: SEND_FORM
})(SendEnterTo)
