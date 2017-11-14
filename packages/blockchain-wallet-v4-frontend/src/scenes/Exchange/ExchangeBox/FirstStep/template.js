import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { required } from 'services/FormHelper'
import { Button, Text } from 'blockchain-info-components'
import { CoinConvertor, SelectBoxesAccounts } from 'components/Form'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: stretch;
  border: 1px solid black;
  min-width: 400px;
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
  padding: 20px 10px;
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`
const TitleText = styled(Text)`
  width: 50%;
  padding: 15px 0px 10px 0px;
`
const Footer = styled.div`
  display: flex;
  justify-content: center;
  padding: 0px 10px 20px 10px;
`

const FirstStep = (props) => {
  const { sourceCoin, targetCoin, nextStep, invalid } = props

  console.log(sourceCoin, targetCoin)

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
        <Row>
          <TitleText>
            <FormattedMessage id='scenes.exchange.exchangebox.firststep.from' defaultMessage='Exchange from:' />
          </TitleText>
          <TitleText>
            <FormattedMessage id='scenes.exchange.exchangebox.firststep.to' defaultMessage='To:' />
          </TitleText>
        </Row>
        <Row>
          <Field name='accounts' component={SelectBoxesAccounts} validate={[required]} />
        </Row>
        <Row>
          <TitleText>
            <FormattedMessage id='scenes.exchange.exchangebox.firststep.amount' defaultMessage='Enter amount:' />
          </TitleText>
        </Row>
        <Row>
          <Field name='amount' component={CoinConvertor} validate={[required]} fromCoin={sourceCoin} toCoin={targetCoin} />
        </Row>
        <Text color='error' weight={300} size='12px'>
          <FormattedMessage id='scenes.exchange.exchangebox.firststep.fee' defaultMessage={`x ${sourceCoin} needed to exchange.`} />
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
