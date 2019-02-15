import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, Link, HeartbeatLoader, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import ComboDisplay from 'components/Display/ComboDisplay'

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 0;

  & > * {
    width: 150px;
  }
  & > :last-child {
    width: 100%;
  }
  &:first-child {
    padding-top: 0px;
  }
`
const Summary = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme['gray-1']};
  padding: 10px 0;
  margin: 5px 0;
  margin-bottom: 25px;

  & > * {
    padding: 10px 0;
  }
`
const Footer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  & > :first-child {
    margin-bottom: 15px;
  }
`

const Success = props => {
  const {
    submitting,
    description,
    fromAddress,
    toAddress,
    amount,
    fee,
    total,
    coin,
    handleSubmit,
    handleBack
  } = props

  return (
    <div>
      <Row>
        <Text size='16px' weight={500}>
          <FormattedMessage
            id='modals.sendbtc.secondstep.from'
            defaultMessage='From:'
          />
        </Text>
        <Text size='16px' weight={300} data-e2e='btcFromWallet'>
          {fromAddress}
        </Text>
      </Row>
      <Row>
        <Text size='16px' weight={500}>
          <FormattedMessage
            id='modals.sendbtc.secondstep.to'
            defaultMessage='To:'
          />
        </Text>
        <Text size='16px' weight={300} data-e2e='btcToAddress'>
          {toAddress}
        </Text>
      </Row>
      {description && (
        <Row>
          <Text size='16px' weight={500}>
            <FormattedMessage
              id='modals.sendbtc.secondstep.note'
              defaultMessage='Note:'
            />
          </Text>
          <Text size='16px' weight={300} data-e2e='btcSendDescription'>
            {description}
          </Text>
        </Row>
      )}
      <Row>
        <Text size='16px' weight={500}>
          <FormattedMessage
            id='modals.sendbtc.secondstep.payment'
            defaultMessage='Payment:'
          />
        </Text>
        <Text size='16px' weight={300}>
          <ComboDisplay coin={coin}>{amount}</ComboDisplay>
        </Text>
      </Row>
      <Row>
        <Text size='16px' weight={500}>
          <FormattedMessage
            id='modals.sendbtc.secondstep.fee'
            defaultMessage='Fee:'
          />
        </Text>
        <Text size='16px' weight={300}>
          <ComboDisplay coin={coin}>{fee}</ComboDisplay>
        </Text>
      </Row>
      <Summary>
        <Text size='16px' weight={300} color='sent'>
          <FormattedMessage
            id='modals.sendbtc.secontstep.total'
            defaultMessage='Total'
          />
        </Text>
        <CoinDisplay coin={coin} size='30px' weight={600} color='sent'>
          {total}
        </CoinDisplay>
        <FiatDisplay coin={coin} size='20px' weight={300} color='sent'>
          {total}
        </FiatDisplay>
      </Summary>
      <Footer>
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          nature='primary'
          fullwidth
          data-e2e='btcSendSubmitButton'
        >
          {!submitting ? (
            <FormattedMessage
              id='modals.sendbtc.secondstep.send'
              defaultMessage='Send Bitcoin'
            />
          ) : (
            <HeartbeatLoader height='20px' width='20px' color='white' />
          )}
        </Button>
        <Link
          onClick={!submitting && handleBack}
          disabled={submitting}
          size='13px'
          weight={300}
          data-e2e='btcSendBackLink'
        >
          <FormattedMessage
            id='scenes.sendbtc.secondstep.back'
            defaultMessage='Go back'
          />
        </Link>
      </Footer>
    </div>
  )
}

export default Success
