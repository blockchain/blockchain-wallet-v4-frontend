import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { required } from 'services/FormHelper'
import { Button, Text } from 'blockchain-info-components'
import { CoinConvertor, SelectBoxDefaultAccounts } from 'components/Form'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: stretch;
  border: 1px solid black;
`

const Header = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px 30px;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme['gray-1']};
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 20px 30px;
`

const SelectionRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const Column = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  width: 45%;
`

const TitleText = styled(Text)`
  padding: 15px 0px 10px 0px;
`

const Footer = styled.div`
  display: flex;
  justify-content: center;
  padding: 0px 20px 20px 20px;
`

const FirstStep = (props) => {
  const { nextStep, invalid } = props
  const addressShouldBeSelected = value => value ? undefined : 'You must select an address'

  return (
    <Wrapper>
      <Header>
        <Text>
          <FormattedMessage id='scenes.exchange.exchangebox.firststep.title' defaultMessage='Exchange Details' />
        </Text>
        <Text weight={300}>
          <FormattedMessage id='scenes.exchange.exchangebox.firststep.stepnumber' defaultMessage='Step 1 of 2' />
        </Text>
      </Header>
      <Body>
        <SelectionRow>
          <Column>
            <TitleText>
              <FormattedMessage id='scenes.exchange.exchangebox.firststep.from' defaultMessage='Exchange from:' />
            </TitleText>
            <Field name='from' validate={[addressShouldBeSelected]} component={SelectBoxDefaultAccounts} />
          </Column>
          <Column>
            <TitleText>
              <FormattedMessage id='scenes.exchange.exchangebox.firststep.to' defaultMessage='To:' />
            </TitleText>
            <Field name='to' component={SelectBoxDefaultAccounts} />
          </Column>
        </SelectionRow>
        <SelectionRow>
          <TitleText>
            <FormattedMessage id='scenes.exchange.exchangebox.firststep.amount' defaultMessage='Enter amount:' />
          </TitleText>
        </SelectionRow>
        <SelectionRow>
          <Field name='amount' component={CoinConvertor} validate={[required]} fromCoin='BTC' toCoin='ETH' />
        </SelectionRow>
        <Text color='error' weight={300} size='12px'>
          <FormattedMessage id='scenes.exchange.exchangebox.firststep.fee' defaultMessage='x BTC needed to exchange.' />
        </Text>
      </Body>
      <Footer>
        <Button nature='primary' fullwidth disabled={invalid} onClick={nextStep}>
          <FormattedMessage id='scenes.exchange.exchangebox.firststep.logout' defaultMessage='Next step' />
        </Button>
      </Footer>
    </Wrapper>
  )
}

export default reduxForm({ form: 'exchange' })(FirstStep)
