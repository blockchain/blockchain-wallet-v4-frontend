import { actions, selectors } from 'data'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { Form, FormLabel, NumberBox, SelectBoxBtcAddresses } from 'components/Form'
import { FormattedMessage } from 'react-intl'
import { Text } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'
import React, { Component } from 'react'
import styled from 'styled-components'

type LinkDispatchPropsType = {
  borrowActions: typeof actions.components.borrow
}

type LinkStatePropsType = {
  values?: {
    maxCollateral: number
  }
}

type Props = LinkDispatchPropsType & LinkStatePropsType

const Wrapper = styled.div`
  padding: 40px;
  background: ${props => props.theme.grey000};
`

const CustomFormLabel = styled(FormLabel)`
  display: block;
  margin-top: 24px;
`

const CustomField = styled(Field)`
  width: 50%;
`

const AmountFieldContainer = styled.div`
  display: flex;
`

const MaxAmountContainer = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  width: 45%;
`

const InlineText = styled(Text)`
  * {
    display: inline-flex;
  }
`

export class BorrowForm extends Component<Props> {
  state = {}

  componentDidMount () {
    this.props.borrowActions.initializeBorrow('BTC')
  }

  render () {
    const { values } = this.props
    const maxAmount = values ? values.maxCollateral : 0

    return (
      <Wrapper>
        {/* TODO: Borrow - make dynamic */}
        <Text color='grey900' size='24px' weight={600}><FormattedMessage id='modals.borrow.borrowusd' defaultMessage='Borrow USD' /></Text>
        <Form>
          <CustomFormLabel>
            <Text color='grey600' weight={500} size='14px'>
              <FormattedMessage id='modals.borrow.iwanttoborrow' defaultMessage='I want to borrow' />
            </Text>
          </CustomFormLabel>
          <AmountFieldContainer>
            <CustomField component={NumberBox} name='principal' autofocus max={maxAmount} />
            <MaxAmountContainer>
              <InlineText color='grey600' weight={500} size='12px'>
                <FormattedMessage id='modals.borrow.canborrow' defaultMessage='You can borrow up to' />
                <br />
                <FiatDisplay cursor='pointer' color='blue600' size='12px' weight={500} coin='BTC'>{maxAmount}</FiatDisplay>
                {' '}USD Pax
              </InlineText>
            </MaxAmountContainer>
          </AmountFieldContainer>
          <CustomFormLabel>
            <Text color='grey600' weight={500} size='14px'>
              <FormattedMessage id='modals.borrow.collateralfrom' defaultMessage='Send collateral from' />
            </Text>
          </CustomFormLabel>
          {/* TODO: Borrow - handle other coins */}
          <Field component={SelectBoxBtcAddresses} includeAll={false} name='collateral' />
        </Form>
      </Wrapper>
    )
  }
}

const mapStateToProps = (state) => ({
  values: selectors.form.getFormValues('borrowForm')(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  borrowActions: bindActionCreators(actions.components.borrow, dispatch)
})

const enhance = compose<any>(
  reduxForm({ form: 'borrowForm' }),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(BorrowForm)
