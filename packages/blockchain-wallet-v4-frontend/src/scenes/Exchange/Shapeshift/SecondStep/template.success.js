import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { Button, Link, Text, TextGroup, Tooltip } from 'blockchain-info-components'
import { CheckBox, CountdownTimer, Form } from 'components/Form'
import CoinDisplay from 'components/Display/CoinDisplay'
import Terms from 'components/Terms'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  border: 1px solid ${props => props.theme['gray-2']};
`
const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 15px 30px;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme['gray-2']};
`
const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 15px 30px 5px 30px;
  box-sizing: border-box;
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${props => props.align === 'right' ? 'flex-end' : 'flex-start'};
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
`

const Table = styled.div`
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme['gray-2']};
  background-color: ${props => props.theme['brand-quaternary']};
  & > :last-child { border-bottom: none; }
`
const TableRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 5px 0;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme['gray-2']};
`
const TableCell = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`

const Success = props => {
  const { handleSubmit, handleCancel, handleExpiry, submitting, invalid, ...rest } = props
  const { sourceCoin, sourceAmount, sourceFee, sourceTotal, exchangeRate, targetCoin, targetAmount, targetFee, expiration } = rest
  const checkboxShouldBeChecked = value => value ? undefined : 'You must agree with the terms and conditions'

  return (
    <Wrapper>
      <Header>
        <Text size='14px'>
          <FormattedMessage id='scenes.exchange.shapeshift.secondstep.title' defaultMessage='Confirm Exchange Order' />
        </Text>
        <Text size='12px' weight={300}>
          <FormattedMessage id='scenes.exchange.shapeshift.secondstep.stepnumber' defaultMessage='Step 2 of 2' />
        </Text>
      </Header>
      <Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <TextGroup>
              <Text size='13px' weight={300}>
                <FormattedMessage id='scenes.exchange.shapeshift.secondstep.recap' defaultMessage="Review the details below and click 'Confirm' to begin your exchange." />
              </Text>
              <Text size='13px' weight={300}>
                <FormattedMessage id='scenes.exchange.shapeshift.secondstep.recap2' defaultMessage='The exchanged funds will be deposited directly into {depositLabel}' values={{ depositLabel: 'My Ether Wallet' }} />
              </Text>
            </TextGroup>
          </Row>
          <Row align='right'>
            <CountdownTimer expiryDate={expiration} />
          </Row>
          <Row>
            <Table>
              <TableRow>
                <TableCell>
                  <Text size='13px' weight={400}>
                    <FormattedMessage id='scenes.exchange.shapeshift.secondstep.todeposit' defaultMessage={'{sourceCoin} to deposit:'} values={{ sourceCoin }} />
                  </Text>
                </TableCell>
                <TableCell>
                  <CoinDisplay coin={sourceCoin} size='13px' weight={300}>{sourceAmount}</CoinDisplay>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Text size='13px' weight={400}>
                    <FormattedMessage id='scenes.exchange.shapeshift.secondstep.txfee' defaultMessage='Transaction fee:' />
                  </Text>
                  <Tooltip>
                    <FormattedMessage id='scenes.exchange.shapeshift.secondstep.txfeeexplanation' defaultMessage='This fee is used to send the outgoing exchange funds to ShapeShift.' />
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <CoinDisplay coin={sourceCoin} size='13px' weight={300}>{sourceFee}</CoinDisplay>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Text size='13px' weight={400}>
                    <FormattedMessage id='scenes.exchange.shapeshift.secondstep.leaving' defaultMessage={'Total {sourceCoin} leaving the wallet:'} values={{ sourceCoin }} />
                  </Text>
                </TableCell>
                <TableCell>
                  <CoinDisplay coin={sourceCoin} size='13px' weight={300}>{sourceTotal}</CoinDisplay>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Text size='13px' weight={400}>
                    <FormattedMessage id='scenes.exchange.shapeshift.secondstep.rate' defaultMessage='Exchange rate:' />
                  </Text>
                  <Tooltip>
                    <FormattedMessage id='scenes.exchange.shapeshift.secondstep.ratetooltip' defaultMessage='This rate may change depending on the market price at the time of your transaction.' />
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Text size='13px' weight={300}>{exchangeRate}</Text>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Text size='13px' weight={400}>
                    <FormattedMessage id='scenes.exchange.shapeshift.secondstep.networkfee' defaultMessage='Network transaction fee:' />
                  </Text>
                  <Tooltip>
                    <FormattedMessage id='scenes.exchange.shapeshift.secondstep.networkfeetooltip' defaultMessage='ShapeShift will use this fee to send the incoming exchange funds to your wallet.' />
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Text size='13px' weight={300}>{`${targetFee} ${targetCoin}`}</Text>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Text size='13px' weight={400}>
                    <FormattedMessage id='scenes.exchange.shapeshift.exchangebox.secondstep.tobereceived' defaultMessage={`${targetCoin} to be received:`} />
                  </Text>
                </TableCell>
                <TableCell>
                  <Text size='13px' weight={300}>{`${targetAmount} ${targetCoin}`}</Text>
                </TableCell>
              </TableRow>
            </Table>
          </Row>
          <Row>
            <Field name='terms' validate={[checkboxShouldBeChecked]} component={CheckBox}>
              <Text size='12px' weight={300}>
                <Terms company='shapeshift' />
              </Text>
            </Field>
            <Row align='right'>
              <Link size='13px' weight={300} onClick={handleCancel}>
                <FormattedMessage id='scenes.exchange.shapeshift.secondstep.back' defaultMessage='Cancel' />
              </Link>
              <Button type='submit' nature='primary' disabled={submitting || invalid}>
                <FormattedMessage id='scenes.exchange.shapeshift.secondstep.finish' defaultMessage='Confirm' />
              </Button>
            </Row>
          </Row>
        </Form>
      </Body>
    </Wrapper>
  )
}

export default reduxForm({ form: 'exchange' })(Success)
