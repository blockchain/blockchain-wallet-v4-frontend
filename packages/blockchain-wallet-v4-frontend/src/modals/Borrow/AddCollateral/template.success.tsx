import { BorrowFormValuesType } from 'data/components/borrow/types'
import { Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { FlyoutWrapper } from 'components/Flyout'
import { Form, FormLabel, NumberBox } from 'components/Form'
import { FormattedMessage } from 'react-intl'
import { LinkDispatchPropsType, OwnProps, SuccessStateType } from '.'
import { maximumAmount, minimumAmount } from '../BorrowForm/validation'
import { model, selectors } from 'data'
import BorrowCoinDropdown from '../BorrowForm/BorrowCoinDropdown'
import React from 'react'
import styled from 'styled-components'

const { getCollateralAmtRequired } = model.components.borrow

const CustomForm = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Top = styled(FlyoutWrapper)`
  padding-bottom: 0px;
`
const TopText = styled(Text)`
  display: flex;
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
  values?: BorrowFormValuesType
}

export type Props = OwnProps &
  SuccessStateType &
  LinkDispatchPropsType &
  LinkStatePropsType

const Success: React.FC<InjectedFormProps & Props> = props => {
  return (
    <CustomForm onSubmit={props.handleSubmit}>
      <Top>
        <TopText color='grey900' size='20px' weight={600}>
          <Icon
            cursor
            style={{ marginRight: '24px' }}
            name='arrow-left'
            size='20px'
            color='grey600'
            onClick={() =>
              props.borrowActions.setStep({
                step: 'DETAILS',
                loan: props.loan,
                offer: props.offer
              })
            }
          />
          <FormattedMessage
            id='modals.borrow.addingcollateral'
            defaultMessage='Adding Collateral'
          />
        </TopText>
        <MaxAmountContainer>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.borrow.needtoadd'
              defaultMessage='You need to add'
            />{' '}
            <FiatContainer
              onClick={() =>
                props.borrowActions.handleAddCollateralRequiredClick()
              }
            >
              <Text cursor='pointer' color='blue600' size='14px' weight={500}>
                {'$' + getCollateralAmtRequired(props.loan, props.offer)}
              </Text>
            </FiatContainer>{' '}
            <FormattedMessage
              id='modals.borrow.additionalcollateral'
              defaultMessage='of additional collateral to avoid being liquidated.'
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
              id='modals.borrow.enteradditional'
              defaultMessage='Enter additional collateral'
            />
          </Text>
        </CustomFormLabel>
        <AmountFieldContainer>
          <CustomField
            component={NumberBox}
            data-e2e='additionalCollateralInput'
            name='additionalCollateral'
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
        <>
          <div>
            <Button
              nature='primary'
              type='submit'
              data-e2e='addCollateralSubmit'
              disabled={props.submitting || props.invalid}
            >
              {props.submitting ? (
                <HeartbeatLoader height='16px' width='16px' color='white' />
              ) : (
                <Text size='16px' weight={600} color='white'>
                  <FormattedMessage
                    id='modals.borrow.addcollateralform.addcollateral'
                    defaultMessage='Add Collateral'
                  />
                </Text>
              )}
            </Button>
          </div>
        </>
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
