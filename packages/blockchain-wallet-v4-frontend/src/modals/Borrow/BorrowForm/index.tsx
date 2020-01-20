import { compose } from 'redux'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { Form, FormLabel, NumberBox } from 'components/Form'
import { FormattedMessage } from 'react-intl'
import { Text, TextGroup } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'
import React, { Component } from 'react'
import styled from 'styled-components'

interface Props {

}
interface State {

}

const Wrapper = styled.div`
  padding: 40px;
  background: ${props => props.theme.grey000};
`

const CustomFormLabel = styled(FormLabel)`
  display: block;
  margin-top: 16px;
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
  padding: 4px;
  width: 50%;
`

const MaxAmount = styled(FiatDisplay)`
  color: ${props => props.theme.blue600};
`

export class BorrowForm extends Component<Props, State> {
  state = {}

  render () {
    return (
      <Wrapper>
        {/* TODO: Borrow - make dynamic */}
        <Text color='grey900' size='24px' weight={600}><FormattedMessage id='modals.borrow.borrowusd' defaultMessage='Borrow USD' /></Text>
        <Form>
          <CustomFormLabel>
            <Text color='grey600' weight={600} size='14px'>
              <FormattedMessage id='modals.borrow.iwanttoborrow' defaultMessage='I want to borrow' />
            </Text>
          </CustomFormLabel>
          <AmountFieldContainer>
            <CustomField component={NumberBox} name='amount' autoFocus />
            <MaxAmountContainer>
              <Text color='grey600' weight={600} size='12px'>
                <FormattedMessage id='modals.borrow.canborrow' defaultMessage='You can borrow up to' />
                <MaxAmount size='12px' weight={600} coin='BTC'>1</MaxAmount>
                <>USD Pax</>
              </Text>
            </MaxAmountContainer>
          </AmountFieldContainer>
        </Form>
      </Wrapper>
    )
  }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

const enhance = compose<any>(
  reduxForm({ form: 'borrowForm' }),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(BorrowForm)
