import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import {
  Button,
  Link,
  Text,
  TextGroup,
  TooltipIcon,
  TooltipHost
} from 'blockchain-info-components'
import { CheckBox, CountdownTimer, Form } from 'components/Form'
import CoinDisplay from 'components/Display/CoinDisplay'
import Terms from 'components/Terms'
import { checkboxShouldBeChecked } from './validation'

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
  padding: 20px 30px 20px 30px;
  border-bottom: 1px solid ${props => props.theme['gray-2']};
  box-sizing: border-box;
`
const Container = styled.div`
  padding: 20px 30px 20px 30px;
  box-sizing: border-box;
`
const Footer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-top: 10px;

  & > :first-child {
    margin-right: 20px;
  }
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${props => props.justify || 'flex-start'};
  align-items: center;
  width: 100%;
  height: ${props => props.height || 'auto'};
  margin-bottom: ${props => (props.spaced ? '20px' : '5px')};
`
const Table = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme['gray-2']};
  background-color: ${props => props.theme['white-blue']};
  & > :last-child {
    border-bottom: none;
  }
  margin-bottom: 20px;
`
const TableRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px 0;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme['gray-2']};
`
const TableCell = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  & > :first-child {
    margin-right: 5px;
  }
`

const Success = props => {
  const {
    handleSubmit,
    handleCancel,
    handleExpiry,
    submitting,
    invalid,
    ...rest
  } = props
  const {
    sourceCoin,
    sourceAmount,
    sourceFee,
    sourceTotal,
    exchangeRate,
    targetCoin,
    targetAmount,
    targetFee,
    targetLabel,
    expiration
  } = rest

  return (
    <Wrapper>
      <Header justify='space-between'>
        <Text size='14px'>
          <FormattedMessage
            id='scenes.exchange.shapeshift.secondstep.title'
            defaultMessage='Confirm Exchange Order'
          />
        </Text>
        <Text size='12px' weight={300}>
          <FormattedMessage
            id='scenes.exchange.shapeshift.secondstep.stepnumber'
            defaultMessage='Step 2 of 2'
          />
        </Text>
      </Header>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Row>
            <TextGroup inline>
              <Text size='13px' weight={300}>
                <FormattedMessage
                  id='scenes.exchange.shapeshift.secondstep.recap'
                  defaultMessage="Review the details below and click 'Confirm' to begin your exchange."
                />
              </Text>
              <Text size='13px' weight={300}>
                <FormattedMessage
                  id='scenes.exchange.shapeshift.secondstep.recap2'
                  defaultMessage='The exchanged funds will be deposited directly into {depositLabel}.'
                  values={{ depositLabel: targetLabel }}
                />
              </Text>
            </TextGroup>
          </Row>
          <Row align='right'>
            <CountdownTimer
              expiryDate={expiration}
              tooltipExpiryTime='10 minutes'
              handleExpiry={handleExpiry}
            />
          </Row>
          <Table>
            <TableRow>
              <TableCell>
                <Text size='13px' weight={400}>
                  <FormattedMessage
                    id='scenes.exchange.shapeshift.secondstep.todeposit'
                    defaultMessage='{coin} to deposit:'
                    values={{ coin: sourceCoin }}
                  />
                </Text>
              </TableCell>
              <TableCell>
                <CoinDisplay coin={sourceCoin} size='13px' weight={300}>
                  {sourceAmount}
                </CoinDisplay>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Text size='13px' weight={400}>
                  <FormattedMessage
                    id='scenes.exchange.shapeshift.secondstep.txfee'
                    defaultMessage='Transaction fee'
                  />
                </Text>
                <TooltipHost id='secondstep.txfeeexplanation'>
                  <TooltipIcon name='question-in-circle' />
                </TooltipHost>
              </TableCell>
              <TableCell>
                <CoinDisplay coin={sourceCoin} size='13px' weight={300}>
                  {sourceFee}
                </CoinDisplay>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Text size='13px' weight={400}>
                  <FormattedMessage
                    id='scenes.exchange.shapeshift.secondstep.leaving'
                    defaultMessage='Total {sourceCoin} leaving the wallet'
                    values={{ sourceCoin }}
                  />
                </Text>
              </TableCell>
              <TableCell>
                <CoinDisplay coin={sourceCoin} size='13px' weight={300}>
                  {sourceTotal}
                </CoinDisplay>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Text size='13px' weight={400}>
                  <FormattedMessage
                    id='scenes.exchange.shapeshift.secondstep.rate'
                    defaultMessage='Exchange rate'
                  />
                </Text>
                <TooltipHost id='secondstep.ratetooltip'>
                  <TooltipIcon name='question-in-circle' />
                </TooltipHost>
              </TableCell>
              <TableCell>
                <Text size='13px' weight={300}>
                  {exchangeRate}
                </Text>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Text size='13px' weight={400}>
                  <FormattedMessage
                    id='scenes.exchange.shapeshift.secondstep.networkfee'
                    defaultMessage='Network transaction fee'
                  />
                </Text>
                <TooltipHost id='secondstep.networkfeetooltip'>
                  <TooltipIcon name='question-in-circle' />
                </TooltipHost>
              </TableCell>
              <TableCell>
                <Text
                  size='13px'
                  weight={300}
                >{`${targetFee} ${targetCoin}`}</Text>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Text size='13px' weight={400}>
                  <FormattedMessage
                    id='scenes.exchange.shapeshift.exchangebox.secondstep.tobereceived'
                    defaultMessage='{coin} to be received'
                    values={{ coin: targetCoin }}
                  />
                </Text>
              </TableCell>
              <TableCell>
                <Text
                  size='13px'
                  weight={300}
                >{`${targetAmount} ${targetCoin}`}</Text>
              </TableCell>
            </TableRow>
          </Table>
          <Row>
            <Field
              name='terms'
              validate={[checkboxShouldBeChecked]}
              component={CheckBox}
            >
              <Text size='12px' weight={300}>
                <Terms company='shapeshift' />
              </Text>
            </Field>
          </Row>
          <Footer>
            <Link size='13px' weight={300} onClick={handleCancel}>
              <FormattedMessage
                id='scenes.exchange.shapeshift.secondstep.back'
                defaultMessage='Cancel'
              />
            </Link>
            <Button
              type='submit'
              nature='primary'
              disabled={submitting || invalid}
            >
              <FormattedMessage
                id='scenes.exchange.shapeshift.secondstep.finish'
                defaultMessage='Confirm'
              />
            </Button>
          </Footer>
        </Form>
      </Container>
    </Wrapper>
  )
}

export default reduxForm({ form: 'exchange_second' })(Success)
