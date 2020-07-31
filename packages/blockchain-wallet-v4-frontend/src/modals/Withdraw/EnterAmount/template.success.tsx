import { Button, Icon, Text } from 'blockchain-info-components'
import { IcoMoonType } from 'blockchain-info-components/src/Icons/Icomoon'
import React from 'react'
import styled from 'styled-components'

import { AmountFieldContainer, FlyoutWrapper } from 'components/Flyout'
import { displayFiatToFiat } from 'blockchain-wallet-v4/src/exchange'
import { ErrorCartridge } from 'components/Cartridge'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Form, NumberBox } from 'components/Form'
import { FormattedMessage } from 'react-intl'
import { formatTextAmount } from 'services/ValidationHelper'
import { maximumAmount } from './validation'
import { Props as OwnProps, SuccessStateType } from '.'
import { WithdrawCheckoutFormValuesType } from 'data/types'
import Beneficary from './Beneficiary'
import CoinDisplay from 'components/Display/CoinDisplay'
import Currencies from 'core/exchange/currencies'

const Top = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`
const ToContainer = styled.div`
  margin-top: 32px;
`
const ActionContainer = styled.div`
  margin-top: 24px;
`
const MinMaxContainer = styled.div`
  margin: 24px 0 40px;
  min-height: 30px;
  display: flex;
`
const CustomErrorCartridge = styled(ErrorCartridge)`
  cursor: pointer;
`

const normalizeAmount = (value, prevValue) => {
  if (isNaN(Number(value)) && value !== '.' && value !== '') return prevValue
  return formatTextAmount(value, true)
}

const Success: React.FC<InjectedFormProps<
  Props & WithdrawCheckoutFormValuesType
> &
  Props> = props => {
  const beneficiary = props.defaultBeneficiary

  const amtError =
    typeof props.formErrors.amount === 'string' && props.formErrors.amount

  return (
    <FlyoutWrapper>
      <Top>
        <Icon
          name={props.fiatCurrency.toLowerCase() as keyof IcoMoonType}
          color='fiat'
          size='32px'
        />
        <Icon
          cursor
          data-e2e='withdrawCloseModal'
          name='close'
          size='20px'
          color='grey600'
          role='button'
          onClick={() => props.handleClose()}
        />
      </Top>
      <Text size='24px' color='black' weight={600}>
        <FormattedMessage id='buttons.withdraw' defaultMessage='Withdraw' />{' '}
        {props.fiatCurrency}
      </Text>
      <CoinDisplay
        size='24px'
        color='grey600'
        weight={600}
        coin={props.fiatCurrency}
        style={{ marginTop: '4px' }}
      >
        {props.balance}
      </CoinDisplay>
      <Form onSubmit={props.handleSubmit}>
        <AmountFieldContainer>
          <Text size='56px' color='grey400' weight={500}>
            {Currencies[props.fiatCurrency].units[props.fiatCurrency].symbol}
          </Text>
          <Field
            data-e2e='sbAmountInput'
            name='amount'
            component={NumberBox}
            normalize={normalizeAmount}
            validate={[maximumAmount]}
            placeholder='0'
            {...{
              autoFocus: true,
              errorBottom: true,
              errorLeft: true
            }}
          />
        </AmountFieldContainer>
        <MinMaxContainer>
          {amtError && amtError === 'ABOVE_MAX' && (
            <CustomErrorCartridge
              role='button'
              onClick={() =>
                props.formActions.change(
                  'custodyWithdrawForm',
                  'amount',
                  displayFiatToFiat({ value: props.balance })
                )
              }
            >
              <CoinDisplay
                size='14px'
                weight={600}
                color='inherit'
                cursor='pointer'
                coin={props.fiatCurrency}
              >
                {props.balance}
              </CoinDisplay>
              &nbsp;
              <FormattedMessage id='copy.max' defaultMessage='Max' />
            </CustomErrorCartridge>
          )}
        </MinMaxContainer>
        <ToContainer>
          <Text
            size='14px'
            weight={500}
            color='grey600'
            style={{ marginBottom: '4px' }}
          >
            <FormattedMessage id='buttons.withdraw' defaultMessage='Withdraw' />{' '}
            <FormattedMessage id='copy.to' defaultMessage='To' />
          </Text>
          <Beneficary {...props} beneficiary={beneficiary} />
        </ToContainer>
        <ActionContainer>
          <Button
            disabled={props.invalid}
            data-e2e='withdrawNext'
            type='submit'
            nature='primary'
            size='16px'
            height='48px'
            fullwidth
          >
            <FormattedMessage id='buttons.next' defaultMessage='Next' />
          </Button>
        </ActionContainer>
      </Form>
    </FlyoutWrapper>
  )
}

export type Props = OwnProps & SuccessStateType

export default reduxForm<WithdrawCheckoutFormValuesType, Props>({
  form: 'custodyWithdrawForm'
})(Success)
