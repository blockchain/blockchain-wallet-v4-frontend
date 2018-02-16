import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { path, prop } from 'ramda'

import { required } from 'services/FormHelper'
import { Button, Icon, Separator, Text } from 'blockchain-info-components'
import { CoinConvertor, Form, SelectBox } from 'components/Form'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 30px 30px 10px 30px;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme['gray-2']};
`
const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;

  margin-bottom: 20px;
`
const Cell = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: ${props => props.fullwidth ? '100%' : '45%'};
  flex-grow: 2;
`
const CellMiddle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 50px;
  height: 50px;
  flex-grow: 1;

  & > :first-child:hover { color: ${props => props.theme['brand-primary']}; }
`
const DisplayWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 5px;
  box-sizing: border-box;
  cursor: pointer;

  & > * { margin-left: 5px; }
`
const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 5px;
  box-sizing: border-box;
  cursor: not-allowed;

  & > * { margin-left: 5px; }
`
const ItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 5px;
  box-sizing: border-box;
  cursor: pointer;

  & > * { margin-left: 5px; }

  &:hover {
    color: ${props => props.theme['gray-4']};
    background-color: ${props => props.theme['gray-1']};
  }
`

const renderDisplay = item => (
  <DisplayWrapper>
    {path(['value', 'coin'], item) === 'BTC' && <Icon name='bitcoin' size='14px' weight={300} />}
    {path(['value', 'coin'], item) === 'ETH' && <Icon name='ethereum' size='14px' weight={300} />}
    <Text size='14px' weight={300}>{item.text}</Text>
  </DisplayWrapper>
)

const renderHeader = item => (
  <HeaderWrapper>
    {prop('text', item) === 'Bitcoin' && <Icon name='bitcoin' size='14px' weight={300} />}
    {prop('text', item) === 'Ethereum' && <Icon name='ethereum' size='14px' weight={300} />}
    <Text size='14px' weight={300} uppercase>{item.text}</Text>
    <Separator />
  </HeaderWrapper>
)

const renderItem = item => (
  <ItemWrapper>
    <Text size='14px' weight={300}>{item.text}</Text>
  </ItemWrapper>
)

const FirstStep = props => {
  const { sourceCoin, targetCoin, elements, max, handleSubmit, handleSwap, invalid, submitting } = props

  return (
    <Wrapper>
      <Header>
        <Text size='12px' weight={300}>
          <FormattedMessage id='scenes.exchange.shapeshift.firststep.step' defaultMessage='Step 1 of 2' />
        </Text>
      </Header>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Cell>
            <Text size='14px' weight={400}>
              <FormattedMessage id='scenes.exchange.shapeshift.firststep.from' defaultMessage='Exchange:' />
            </Text>
            <Field name='source' component={SelectBox} elements={elements} templateDisplay={renderDisplay} templateHeader={renderHeader} templateItem={renderItem} />
          </Cell>
          <CellMiddle>
            <Icon name='exchange-2' size='24px' weight={500} cursor onClick={handleSwap} />
          </CellMiddle>
          <Cell>
            <Text size='14px' weight={400}>
              <FormattedMessage id='scenes.exchange.shapeshift.firststep.to' defaultMessage='Receive:' />
            </Text>
            <Field name='target' component={SelectBox} elements={elements} templateDisplay={renderDisplay} templateHeader={renderHeader} templateItem={renderItem} />
          </Cell>
        </Row>
        <Row>
          <Cell fullwidth>
            <Text size='14px' weight={400}>
              <FormattedMessage id='scenes.exchange.shapeshift.firststep.amount' defaultMessage='Enter amount:' />
            </Text>
            <Field name='amount' component={CoinConvertor} validate={[required]} sourceCoin={sourceCoin} targetCoin={targetCoin} max={max} />
          </Cell>
        </Row>
        <Row>
          <Button type='submit' nature='primary' fullwidth disabled={invalid || submitting}>
            <FormattedMessage id='scenes.exchange.shapeshift.firststep.next' defaultMessage='Next' />
          </Button>
        </Row>
      </Form>
    </Wrapper>
  )
}

export default reduxForm({ form: 'exchange', destroyOnUnmount: false })(FirstStep)
