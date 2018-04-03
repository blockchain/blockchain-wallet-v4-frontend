import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

// import { required } from 'services/FormHelper'
import { Button, HeartbeatLoader, Icon, Text, TextInput } from 'blockchain-info-components'
import { Form, SelectBox } from 'components/Form'
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
  justify-content: ${props => props.justify || 'flex-start'};
  align-items: flex-start;
  width: 100%;
  height: ${props => props.height || 'auto'};
  margin-bottom: 10px;
`
const Cell = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: ${props => props.size === 'small' ? 'center' : 'flex-start'};
  width: ${props => props.size === 'small' ? '10%' : '45%'};
  height: 100%;
`

const Success = props => {
  const { elements, quotationLoading, quotationError, handleMinimum, handleMaximum, handleSwap, handleSubmit, invalid, submitting } = props
  console.log('success', quotationLoading, quotationError)
  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
        <Row justify='flex-end'>
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
        <Row height='50px'>
          <Cell>
            <Field name='source' component={SelectBox} elements={elements} />
          </Cell>
          <Cell size='small'>
            <Icon name='exchange-2' size='24px' weight={500} cursor onClick={handleSwap} />
          </Cell>
          <Cell>
            <Field name='target' component={SelectBox} elements={elements} />
          </Cell>
        </Row>
        <Row justify='space-between'>
          <Text size='14px' weight={400}>
            <FormattedMessage id='scenes.exchange.shapeshift.firststep.amount' defaultMessage='Enter amount:' />
          </Text>
          {quotationError &&
            <Text size='12px' weight={300} color='error'>
              {quotationError && quotationError.message === 'effective_balance' && <FormattedMessage id='scenes.exchange.shapeshift.firststep.balance' defaultMessage='Amount is above effective balance ({effectiveBalance})' values={{ effectiveBalance: quotationError.data }} />}
              {quotationError && quotationError.message === 'shapeshift_minimum' && <FormattedMessage id='scenes.exchange.shapeshift.firststep.minimum' defaultMessage='Amount is below Shapeshift minimum ({minimum})' values={{ minimum: quotationError.data }} />}
              {quotationError && quotationError.message === 'shapeshift_maximum' && <FormattedMessage id='scenes.exchange.shapeshift.firststep.maximum' defaultMessage='Amount is above Shapeshift maximum ({maximum})' values={{ maximum: quotationError.data }} />}
            </Text>
          }
        </Row>
        <Row height='80px'>
          <Cell>
            <Field name='sourceAmount' component={TextInput} />
            <Field name='sourceFiat' component={TextInput} />
          </Cell>
          <Cell size='small'>
            {quotationLoading
              ? <HeartbeatLoader width='20px' height='20px' />
              : <Icon name='right-arrow' size='24px' weight={500} cursor />
            }
          </Cell>
          <Cell>
            <Field name='targetAmount' component={TextInput} />
            <Field name='targetFiat' component={TextInput} />
          </Cell>
        </Row>
        <Row>
          <MinimumMaximum handleMinimum={handleMinimum} handleMaximum={handleMaximum} />
        </Row>
        <Row>
          <Button type='submit' nature='primary' fullwidth disabled={quotationError.message || quotationLoading || invalid || submitting}>
            <FormattedMessage id='scenes.exchange.shapeshift.firststep.next' defaultMessage='Next' />
          </Button>
        </Row>
      </Form>
    </Wrapper>
  )
}

export default reduxForm({ form: 'exchange', destroyOnUnmount: false })(Success)
