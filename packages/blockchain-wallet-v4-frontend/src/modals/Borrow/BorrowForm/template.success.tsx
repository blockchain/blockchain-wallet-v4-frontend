import { BorrowFormValuesType } from 'data/components/borrow/types'
import { Button, HeartbeatLoader, Text } from 'blockchain-info-components'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Form, FormItem, FormLabel, NumberBox } from 'components/Form'
import { FormattedMessage } from 'react-intl'
import { LinkDispatchPropsType, SuccessStateType } from '.'
import { maximumAmount, minimumAmount } from './validation'
import { selectors } from 'data'
import BorrowCoinDropdown from './BorrowCoinDropdown'
import FiatDisplay from 'components/Display/FiatDisplay'
import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'
import Summary from '../Summary'

const CustomForm = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Padded = styled.div`
  padding: 40px;
  ${media.tablet`
    padding: 20px;
  `}
`

const Top = styled(Padded)``

const Bottom = styled(Padded)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

const CustomFormLabel = styled(FormLabel)`
  display: block;
  margin-top: 24px;
`

const CustomField = styled(Field)`
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
  margin-top: 40px;
`

const FiatContainer = styled.div`
  cursor: pointer;
  display: inline-block;
  padding: 4px 8px;
  border-radius: 20px;
  background-color: ${props => props.theme.grey000};
`

type LinkStatePropsType = {
  values: BorrowFormValuesType
}

type Props = SuccessStateType & LinkDispatchPropsType & LinkStatePropsType

const Success: React.FC<InjectedFormProps & Props> = props => {
  const offer = props.offers.find(
    offer =>
      offer.terms.collateralCcy === props.coin &&
      offer.terms.principalCcy === 'PAX'
  )

  const displayName = props.supportedCoins['PAX'].displayName

  return (
    <CustomForm onSubmit={props.handleSubmit}>
      <Top>
        <Text color='grey900' size='20px' weight={600}>
          <FormattedMessage
            id='modals.borrow.borrowusd'
            defaultMessage='Borrow {displayName}'
            values={{ displayName }}
          />
        </Text>
        <MaxAmountContainer>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.borrow.canborrow'
              defaultMessage='You can borrow up to'
            />{' '}
            <FiatContainer
              onClick={() => props.borrowActions.handleMaxCollateralClick()}
            >
              <FiatDisplay
                cursor='pointer'
                color='blue600'
                size='14px'
                weight={500}
                coin='BTC'
              >
                {props.payment.effectiveBalance}
              </FiatDisplay>
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
        <BorrowCoinDropdown {...props} />
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
          />
          <PrincipalCcyAbsolute>
            <Text color='grey400' size='14px' weight={600}>
              USD
            </Text>
          </PrincipalCcyAbsolute>
        </AmountFieldContainer>
      </Top>
      <Bottom>
        {offer ? (
          <>
            <Summary
              {...props}
              {...props.values}
              collateral={0}
              displayName={displayName}
              offer={offer}
            />
            <div>
              <Button
                nature='primary'
                type='submit'
                disabled={props.submitting || props.invalid}
              >
                {props.submitting ? (
                  <HeartbeatLoader height='16px' width='16px' color='white' />
                ) : (
                  <Text size='16px' weight={600} color='white'>
                    <FormattedMessage
                      id='modals.borrow.collateralform.create'
                      defaultMessage='Create Loan'
                    />
                  </Text>
                )}
              </Button>
            </div>
          </>
        ) : (
          <Text color='grey700' weight={600} size='16px'>
            There is no loan offer for {props.coin} to {displayName}
          </Text>
        )}
      </Bottom>
    </CustomForm>
  )
}

const mapStateToProps = state => ({
  values: selectors.form.getFormValues('borrowForm')(state)
})

const enhance = compose<any>(
  reduxForm({ form: 'borrowForm', destroyOnUnmount: false }),
  connect(mapStateToProps)
)

export default enhance(Success)
