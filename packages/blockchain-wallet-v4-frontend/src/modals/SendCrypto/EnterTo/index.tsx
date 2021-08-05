import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'
import reduxForm, { InjectedFormProps } from 'redux-form/lib/reduxForm'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { CoinAccountListOption, Form } from 'components/Form'
import TextWithQRScanner from 'components/Form/TextWithQRScanner'
import { SendCryptoStepType } from 'data/components/sendCrypto/types'

import { StepHeader } from '../../RequestCrypto/model'
import { Props as OwnProps } from '..'
import { FormLabelWithBorder, SEND_FORM } from '../model'

const Wrapper = styled(Form)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100%;
`
const ToWrapper = styled(FlyoutWrapper)`
  display: flex;
  padding-top: 24px;
`

class SendEnterTo extends React.PureComponent<InjectedFormProps<{}, Props> & Props> {
  render() {
    const { formValues, sendCryptoActions, walletCurrency } = this.props
    const { selectedAccount, to } = formValues

    const { coinfig } = window.coins[selectedAccount.coin]

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
              component={TextWithQRScanner}
              placeholder={`${coinfig.name} Address`}
            />
          </ToWrapper>
        </div>
        <FlyoutWrapper>
          <Button
            nature='primary'
            type='submit'
            data-e2e='enterToBtn'
            fullwidth
            jumbo
            disabled={!to}
          >
            <FormattedMessage id='buttons.next' defaultMessage='Next' />
          </Button>
        </FlyoutWrapper>
      </Wrapper>
    )
  }
}

type Props = OwnProps

export default reduxForm<{}, Props>({
  destroyOnUnmount: false,
  form: SEND_FORM
})(SendEnterTo)
