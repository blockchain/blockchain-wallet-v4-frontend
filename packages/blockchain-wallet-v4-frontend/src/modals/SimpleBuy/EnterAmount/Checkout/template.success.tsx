import { Button, Icon, Text } from 'blockchain-info-components'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { FlyoutWrapper } from 'components/Flyout'
import { Form, NumberBox } from 'components/Form'
import { FormattedMessage } from 'react-intl'
import { maximumAmount, minimumAmount } from './validation'
import { Props as OwnProps, SuccessStateType } from '.'
import CoinSelect from './CoinSelect'
import React from 'react'
import styled from 'styled-components'

const CustomForm = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const TopText = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

type Props = OwnProps & SuccessStateType

const Success: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  return (
    <CustomForm onSubmit={props.handleSubmit}>
      <FlyoutWrapper>
        <TopText color='grey900' size='20px' weight={600}>
          <FormattedMessage
            id='modals.simplebuy.buycrypto'
            defaultMessage='Buy Crypto'
          />
          <Icon
            cursor
            name='close'
            size='20px'
            color='grey600'
            onClick={() => props.handleClose()}
          />
        </TopText>
        <CoinSelect name='pair' {...props} />
        <Field
          name='amount'
          component={NumberBox}
          validate={[maximumAmount, minimumAmount]}
          {...{
            autoFocus: true,
            errorBottom: true,
            errorLeft: true,
            errorIcon: 'alert-filled'
          }}
        />
        <Button
          data-e2e='submitSBAmount'
          height='48px'
          size='16px'
          nature='primary'
          type='submit'
          fullwidth
          disabled={props.invalid}
        >
          <FormattedMessage
            id='modals.simplebuy.continue'
            defaultMessage='Continue'
          />
        </Button>
      </FlyoutWrapper>
    </CustomForm>
  )
}

export default reduxForm<{}, Props>({ form: 'simpleBuyCheckout' })(Success)
