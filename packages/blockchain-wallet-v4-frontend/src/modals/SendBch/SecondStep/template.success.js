import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Banner, Button, Link, Text } from 'blockchain-info-components'
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
  margin-bottom: 20px;
  & > * {
    padding: 10px 0;
  }
`
const WarningBanner = styled.div`
  margin-bottom: 20px;
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
    description,
    fromAddress,
    toAddress,
    amount,
    fee,
    total,
    coin,
    handleSubmit,
    handleBack,
    isLegacy
  } = props

  return (
    <div>
      <Row>
        <Text size='16px' weight={500}>
          <FormattedMessage
            id='modals.sendbch.secondstep.from'
            defaultMessage='From:'
          />
        </Text>
        <Text size='16px' weight={300}>
          {fromAddress}
        </Text>
      </Row>
      <Row>
        <Text size='16px' weight={500}>
          <FormattedMessage
            id='modals.sendbch.secondstep.to'
            defaultMessage='To:'
          />
        </Text>
        <Text size='16px' weight={300}>
          {toAddress}
        </Text>
      </Row>
      {description && (
        <Row>
          <Text size='16px' weight={500}>
            <FormattedMessage
              id='modals.sendbch.secondstep.note'
              defaultMessage='Note:'
            />
          </Text>
          <Text size='16px' weight={300}>
            {description}
          </Text>
        </Row>
      )}
      <Row>
        <Text size='16px' weight={500}>
          <FormattedMessage
            id='modals.sendbch.secondstep.payment'
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
            id='modals.sendbch.secondstep.fee'
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
            id='modals.sendbch.secondstep.total'
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
      {isLegacy && (
        <WarningBanner>
          <Banner type='caution'>
            <Text size='12px'>
              <FormattedMessage
                id='modals.sendbch.secondstep.legacy_addr_warning'
                defaultMessage='Are you sure this is a Bitcoin Cash Address? Sending funds to bitcoin address by accident will result in loss of funds.'
              />
            </Text>
          </Banner>
        </WarningBanner>
      )}
      <Footer>
        <Button onClick={handleSubmit} nature='primary' fullwidth>
          <FormattedMessage
            id='modals.sendbch.secondstep.send'
            defaultMessage='Send Bitcoin Cash'
          />
        </Button>
        <Link onClick={handleBack} size='13px' weight={300}>
          <FormattedMessage
            id='modals.sendbch.secondstep.back'
            defaultMessage='Go back'
          />
        </Link>
      </Footer>
    </div>
  )
}

export default Success
