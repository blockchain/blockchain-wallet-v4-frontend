import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { Button, Icon, Text } from 'blockchain-info-components'
import { Form, TextBox, SelectBox } from 'components/Form'
import MinimumMaximum from './MinimumMaximum'

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
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${props => props.align === 'right' ? 'flex-end' : 'flex-start'};
  align-items: flex-start;
  width: 100%;
  margin-bottom: 10px;
`
const Cell = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: ${props => props.size === 'small' ? 'center' : 'flex-start'};
  width: ${props => props.size === 'small' ? '10%' : '45%'};
`

const Success = props => {
  const { elements, handleMinimum, handleMaximum, handleSubmit, handleSwap, loading, invalid, submitting, ...rest } = props

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
        <Row align='right'>
          <Text size='12px' weight={300}>
            <FormattedMessage id='scenes.exchange.shapeshift.firststep.step' defaultMessage='Step 1 of 2' />
          </Text>
        </Row>
        <Row>
          <Cell>
            <Text size='14px' weight={400}>
              <FormattedMessage id='scenes.exchange.shapeshift.firststep.from' defaultMessage='Exchange:' />
            </Text>
          </Cell>
          <Cell size='small' />
          <Cell>
            <Text size='14px' weight={400}>
              <FormattedMessage id='scenes.exchange.shapeshift.firststep.to' defaultMessage='Receive:' />
            </Text>
          </Cell>
        </Row>
        <Row>
          <Cell>
            <Field name='source' component={SelectBox} elements={elements} />
          </Cell>
          <Cell size='small'>
            {loading
              ? <HeartbeatLoader width='20px' height='20px' />
              : <Icon name='exchange-2' size='24px' weight={500} cursor onClick={handleSwap} />
            }
          </Cell>
          <Cell>
            <Field name='target' component={SelectBox} elements={elements} />
          </Cell>
        </Row>
        <Row>
          <Text size='14px' weight={400}>
            <FormattedMessage id='scenes.exchange.shapeshift.firststep.amount' defaultMessage='Enter amount:' />
          </Text>
        </Row>
        <Row>
          <Cell>
            <Field name='sourceAmount' component={TextBox} />
            <Field name='sourceFiat' component={TextBox} />
          </Cell>
          <Cell size='small'>
            {loading
              ? <HeartbeatLoader width='20px' height='20px' />
              : <Icon name='right-arrow' size='24px' weight={500} cursor />
            }
          </Cell>
          <Cell>
            <Field name='targetAmount' component={TextBox} />
            <Field name='targetFiat' component={TextBox} />
          </Cell>
        </Row>
        <Row>
          <MinimumMaximum handleMinimum={handleMinimum} handleMaximum={handleMaximum} />
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

export default reduxForm({ form: 'exchange', destroyOnUnmount: false })(Success)
