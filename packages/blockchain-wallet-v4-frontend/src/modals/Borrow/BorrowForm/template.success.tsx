import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { BaseFieldProps, Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/currency'
import { FlyoutWrapper } from 'components/Flyout'
import {
  CoinBalanceDropdown,
  Form,
  FormLabel,
  NumberBox
} from 'components/Form'
import { selectors } from 'data'
import { BorrowFormValuesType } from 'data/components/borrow/types'

import { LinkDispatchPropsType, OwnProps, SuccessStateType } from '.'
import Summary from './Summary'
import { maximumAmount, minimumAmount } from './validation'

const CustomForm = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Top = styled(FlyoutWrapper)`
  padding-bottom: 0;
`

const TopText = styled(Text)`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`

const Bottom = styled(FlyoutWrapper)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

const CustomFormLabel = styled(FormLabel)`
  display: block;
  margin-top: 24px;
`

const CustomField = styled(Field)<BaseFieldProps>`
  > input {
    padding-left: 50px;
  }
`

const AmountFieldContainer = styled.div`
  display: flex;
  position: relative;
`

const PrincipalCcyAbsolute = styled.div`
  position: absolute;
  top: 16px;
  left: 12px;
`

const MaxAmountContainer = styled.div`
  align-items: center;
  display: flex;
  margin-top: 16px;
`

const FiatContainer = styled.div`
  cursor: pointer;
  display: inline-block;
  padding: 4px 8px;
  border-radius: 20px;
  background-color: ${props => props.theme.grey000};
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  > button {
    height: 48px !important;
    width: 45% !important;
    padding: 15px !important;
  }
`

const Success: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  // TODO: Borrow - make dynamic
  const displayName = props.supportedCoins['PAX'].displayName

  return (
    <CustomForm onSubmit={props.handleSubmit}>
      <Top>
        <TopText color='grey800' size='20px' weight={600}>
          <FormattedMessage
            id='modals.borrow.borrowusd'
            defaultMessage='Borrow {displayName}'
            values={{ displayName }}
          />
          <Icon
            onClick={props.handleClose}
            cursor
            name='close'
            size='20px'
            color='grey600'
            data-e2e='closeBorrow'
          />
        </TopText>
        <MaxAmountContainer>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.borrow.canborrow'
              defaultMessage='You can borrow up to'
            />{' '}
            <FiatContainer
              onClick={() => props.borrowActions.handleMaxCollateralClick()}
            >
              <Text color='blue600' size='14px' weight={500}>
                {fiatToString({
                  value: props.limits.maxFiat,
                  unit: 'USD'
                })}
              </Text>
            </FiatContainer>{' '}
            {displayName}{' '}
            <FormattedMessage
              id='modals.borrow.basedonwallet'
              defaultMessage="based on the selected Wallet's balance."
            />
          </Text>
        </MaxAmountContainer>
        <CustomFormLabel>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.borrow.collateralfrom'
              defaultMessage='Send collateral from'
            />
          </Text>
        </CustomFormLabel>
        <CoinBalanceDropdown
          includeCustodial={false}
          {...props}
          name='collateral'
        />
        <CustomFormLabel>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.borrow.enterloanamt'
              defaultMessage='Enter loan amount'
            />
          </Text>
        </CustomFormLabel>
        <AmountFieldContainer>
          <CustomField
            component={NumberBox}
            data-e2e='principalInput'
            name='principal'
            validate={[maximumAmount, minimumAmount]}
            {...{
              autoFocus: true,
              errorBottom: true,
              errorLeft: true,
              errorIcon: 'alert-filled'
            }}
          />
          <PrincipalCcyAbsolute>
            <Text color='grey400' size='14px' weight={600}>
              USD
            </Text>
          </PrincipalCcyAbsolute>
        </AmountFieldContainer>
      </Top>
      <Bottom>
        <>
          <Summary
            {...props}
            {...props.values}
            collateral={0}
            displayName={displayName}
          />
          <ButtonContainer>
            <Button
              nature='empty'
              data-e2e='borrowCancel'
              onClick={props.handleClose}
            >
              <Text size='16px' weight={600} color='blue600'>
                <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
              </Text>
            </Button>
            <Button
              nature='primary'
              type='submit'
              data-e2e='borrowSubmit'
              disabled={props.invalid}
            >
              <Text size='16px' weight={600} color='white'>
                <FormattedMessage
                  id='buttons.continue'
                  defaultMessage='Continue'
                />
              </Text>
            </Button>
          </ButtonContainer>
        </>
      </Bottom>
    </CustomForm>
  )
}

const mapStateToProps = state => ({
  values: selectors.form.getFormValues('borrowForm')(state)
})

// @ts-ignore
const enhance = compose(
  reduxForm<{}, Props>({ form: 'borrowForm', destroyOnUnmount: false }),
  connect(mapStateToProps)
)

type LinkStatePropsType = {
  values?: BorrowFormValuesType
}

type FormProps = {
  onSubmit: () => void
}

export type Props = OwnProps &
  SuccessStateType &
  LinkDispatchPropsType &
  LinkStatePropsType &
  FormProps

export default enhance(Success) as React.FunctionComponent<Props>
