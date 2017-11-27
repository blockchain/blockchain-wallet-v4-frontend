import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { BlockchainLoader, Button, Link, Text, Tooltip } from 'blockchain-info-components'
import { CheckBox, Form } from 'components/Form'
import Terms from 'components/Terms'
import CoinDisplay from 'components/Display/CoinDisplay'

const Wrapper = styled.div`
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
  padding: 20px 30px;
`

const ExpiryText = styled(Text)`
  display: flex;
  justify-content: flex-end;
`

const RecapTableRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  justify-content: space-between;
  border-bottom: 1px solid ${props => props.theme['gray-2']};
`

const AmountText = styled(Text)`
  display: flex;
  flex-direction: row;
`

const Footer = styled.div`
  display: flex;
  justify-content: center;
  padding: 0px 20px 20px 20px;
`

const RecapTable = styled.div`
  background-color: ${props => props.theme['brand-quaternary']};
  border: 1px solid ${props => props.theme['gray-2']};
`

const SecondStep = (props) => {
  const { isLoading, expiration, previousStep, position, total, close, submitting, invalid, sourceCoin, targetCoin, sourceAddress, targetAddress, sourceAmount, minerFee, txFee, rate, received, ...rest } = props
  const { onSubmit } = rest
  const checkboxShouldBeChecked = value => value ? undefined : 'You must agree with the terms and conditions'
  const timeLeft = new Date(expiration - new Date().getTime())

  if (isLoading) {
    return (
      <BlockchainLoader />
    )
  } else {
    return (
      <Wrapper>
        <Form onSubmit={onSubmit}>
          <Header>
            <Text>
              <FormattedMessage id='scenes.exchange.exchangebox.firststep.title' defaultMessage='Confirm Exchange Order' />
            </Text>
            <Text weight={300}>
              <FormattedMessage id='scenes.exchange.exchangebox.firststep.stepnumber' defaultMessage='Step 2 of 2' />
            </Text>
          </Header>
          <Body>
            <Text size='13px' weight={300}>
              <FormattedMessage id='scenes.exchange.exchangebox.secondstep.recap' defaultMessage='Review the details below and click &apos;Confirm&apos; to begin your exchange. The exchanged funds will be deposited directly into TARGET ACCOUNT NAME' />
            </Text>
            <ExpiryText size='13px' weight={300}>
              <FormattedMessage id='scenes.exchange.exchangebox.secondstep.expiry' defaultMessage={`Quote expires in: `} />
              {timeLeft.getMinutes()}:{timeLeft.getSeconds()}
              <Tooltip>
                <FormattedMessage id='scenes.exchange.exchangebox.secondstep.expiryexplanation' defaultMessage='This rate will expire after 10 minutes. If that happens please restart your trade.' />
              </Tooltip>
            </ExpiryText>
            <RecapTable>
              <RecapTableRow>
                <Text weight={400}>
                  <FormattedMessage id='scenes.exchange.exchangebox.secondstep.todeposit' defaultMessage={`${sourceCoin} to deposit:`} />
                </Text>
                <AmountText weight={300}>
                  <CoinDisplay coin={sourceCoin}>{sourceAmount}</CoinDisplay>
                </AmountText>
              </RecapTableRow>
              <RecapTableRow>
                <Text weight={400}>
                  <FormattedMessage id='scenes.exchange.exchangebox.secondstep.txfee' defaultMessage='Transaction fee:' />
                  <Tooltip>
                    <FormattedMessage id='scenes.exchange.exchangebox.secondstep.txfeeexplanation' defaultMessage='This fee is used to send the outgoing exchange funds to ShapeShift.' />
                  </Tooltip>
                </Text>
                <AmountText weight={300}>
                  <CoinDisplay coin={sourceCoin}>{txFee}</CoinDisplay>
                </AmountText>
              </RecapTableRow>
              <RecapTableRow>
                <Text weight={400}>
                  <FormattedMessage id='scenes.exchange.exchangebox.secondstep.leaving' defaultMessage={`Total ${sourceCoin} leaving the wallet:`} />
                </Text>
                <AmountText weight={300}>
                  <CoinDisplay coin={sourceCoin}>{Number(sourceAmount) + Number(txFee)}</CoinDisplay>
                </AmountText>
              </RecapTableRow>
              <RecapTableRow>
                <Text weight={400}>
                  <FormattedMessage id='scenes.exchange.exchangebox.secondstep.rate' defaultMessage='Exchange rate:' />
                  <Tooltip>
                    <FormattedMessage id='scenes.exchange.exchangebox.secondstep.ratetooltip' defaultMessage='This rate may change depending on the market price at the time of your transaction.' />
                  </Tooltip>
                </Text>
                <AmountText weight={300}>
                  1{sourceCoin}={rate}{targetCoin}
                </AmountText>
              </RecapTableRow>
              <RecapTableRow>
                <Text weight={400}>
                  <FormattedMessage id='scenes.exchange.exchangebox.secondstep.networkfee' defaultMessage='Network transaction fee:' />
                  <Tooltip>
                    <FormattedMessage id='scenes.exchange.exchangebox.secondstep.networkfeetooltip' defaultMessage='ShapeShift will use this fee to send the incoming exchange funds to your wallet.' />
                  </Tooltip>
                </Text>
                <AmountText weight={300}>
                  <CoinDisplay coin={targetCoin}>{minerFee}</CoinDisplay>
                </AmountText>
              </RecapTableRow>
              <RecapTableRow>
                <Text weight={400}>
                  <FormattedMessage id='scenes.exchange.exchangebox.secondstep.tobereceived' defaultMessage={`${targetCoin} to be received:`} />
                </Text>
                <AmountText weight={300}>
                  <CoinDisplay coin={targetCoin}>{received}</CoinDisplay>
                </AmountText>
              </RecapTableRow>
            </RecapTable>
            <Field name='terms' validate={[checkboxShouldBeChecked]} component={CheckBox}>
              <Text size='12px' weight={300}>
                <Terms company='shapeshift' />
              </Text>
            </Field>
          </Body>
          <Footer align='spaced'>
            <Link size='13px' weight={300} onClick={previousStep}>
              <FormattedMessage id='scenes.exchange.exchangebox.secondstep.back' defaultMessage='Cancel' />
            </Link>
            <Button type='submit' nature='primary' disabled={submitting || invalid}>
              <FormattedMessage id='scenes.exchange.exchangebox.secondstep.finish' defaultMessage='Confirm' />
            </Button>
          </Footer>
        </Form>
      </Wrapper>
    )
  }
}

SecondStep.propTypes = {
  previousStep: PropTypes.func.isRequired
}

export default reduxForm({ form: 'exchange' })(SecondStep)
