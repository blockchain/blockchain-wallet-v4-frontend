import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'

import { Button, ConfirmationGauge, Icon, Tooltip, Text } from 'blockchain-info-components'
import CurrencyDisplay from 'components/CurrencyDisplay'
import CoinDisplay from 'components/CoinDisplay'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #DDDDDD;
`
const Row = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`
const RowDetails = styled.div`
  display: ${props => props.collapsed ? 'none' : 'flex'};
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  margin-top: 10px;

  & > div { padding: 10px 0; }

  @media(min-width: 1200px) { 
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  } 
`
const HiddenOnMobile = styled.div`
  display: none;
  @media(min-width: 1200px) { display: flex; }
`
const HiddenOnDesktop = styled.div`
  display: flex;
  @media(min-width: 1200px) { display: none; }
`
const Status = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-content: center;
  min-width: 220px;
  margin-left: 60px;

  @media(min-width: 1200px) {  width: 20%; }
`
const Arrow = styled.div`
  position: absolute;
  left: 20px;
  top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: ${props => props.rotated ? 'rotate(-90deg)' : 'none'};

  cursor: pointer;
`
const Addresses = styled(HiddenOnMobile)`
  min-width: 400px;

  @media(min-width: 1200px) { 
    flex-direction: column;
    width: 35%;
  }
`
const Description = styled(HiddenOnMobile)`
  min-width: 250px;
  @media(min-width: 1200px) { width: 25%; }
`
const Amount = styled.div`
  min-width: 200px;
  @media(min-width: 1200px) {
    display: flex;
    width: 20%;
  }
`
const TransactionStatus = styled.div`
  width: 100%;
  @media(min-width: 1200px) { width: 20%; }
`
const TransactionTooltip = styled.div`
  display: flex;
  flex-direction: row;
  justify-items: space-between;

  & > div:first-child {
    width: 70%;
    margin-right: 5px;
  }
`
const ValueWhenReceived = styled.div`
  width: 100%;
  @media(min-width: 1200px) { width: 20%; }
`
const ExtraDetailsContainer = styled(HiddenOnDesktop)`
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  & > * { padding: 10px 0;}
`
const selectColors = type => {
  switch (type) {
    case 'Sent': return 'sent'
    case 'Transferred': return 'transferred'
    case 'Received': return 'received'
    default: return ''
  }
}

const ListItem = (props) => {
  const { coinDisplayed, toggled, handleToggle, handleClick, transaction } = props

  const now = moment()
  const date = moment.utc(transaction.time * 1000)
  const formattedDate = (date.year() === now.year())
    ? date.format('MMMM D @kk:mm')
    : date.format('MMMM D YYYY @kk:mm')

  return (
    <Wrapper>
      <Row>
        <Status>
          <Arrow rotated={!toggled} onClick={handleToggle}>
            <Icon name='down_arrow' size='10px' />
          </Arrow>
          <Text weight={500} color={selectColors(transaction.type)} uppercase>
            { transaction.type === 'Sent' && <FormattedMessage id='scenes.transactions.list.listitem.sent' defaultMessage='Sent' /> }
            { transaction.type === 'Received' && <FormattedMessage id='scenes.transactions.list.listitem.received' defaultMessage='Received' /> }
            { transaction.type === 'Transferred' && <FormattedMessage id='scenes.transactions.list.listitem.transferred' defaultMessage='Transferred' /> }
          </Text>
          <Text size='12px' weight={300} italic>{formattedDate}</Text>
        </Status>
        <Addresses>
          <Text size='14px' weight={300}>
            <FormattedMessage id='scenes.transactions.list.listitem.to' defaultMessage='To : {to}' values={{ to: transaction.to }} />
          </Text>
          <Text size='14px' weight={300}>
            <FormattedMessage id='scenes.transactions.list.listitem.from' defaultMessage='From : {from}' values={{ from: transaction.from }} />
          </Text>
        </Addresses>
        <Description>
          { transaction.description !== ''
            ? <Text size='14px' weight={300}>
              <FormattedMessage id='scenes.transactions.list.listitem.description' defaultMessage='Description: {description}' values={{ description: transaction.description }} />
            </Text>
            : <Text size='14px' weight={300}>
              <FormattedMessage id='scenes.transactions.list.listitem.adddescription' defaultMessage='Add a description' />
            </Text>
          }
          <Icon name='pencil' size='14px' />
        </Description>
        <Amount>
          <Button nature={transaction.type.toLowerCase()} onClick={handleClick} fullwidth>
            { coinDisplayed
              ? <CoinDisplay>{transaction.amount}</CoinDisplay>
              : <CurrencyDisplay>{transaction.amount}</CurrencyDisplay>
            }
          </Button>
        </Amount>
      </Row>
      <RowDetails collapsed={!toggled}>
        <TransactionStatus>
          <Text size='12px'>{transaction.status}</Text>
          { transaction.confirmations > 3
            ? <FormattedMessage id='scenes.transactions.list.listitem.transaction_confirmed' defaultMessage='Transaction confirmed' />
            : (
              <TransactionTooltip>
                <ConfirmationGauge nbConfirmations={transaction.confirmations} />
                <Tooltip>
                  {transaction.confirmations === 0 && <FormattedMessage id='scenes.transactions.list.listitem.transaction_unconfirmed' defaultMessage='Your transaction is actually unconfirmed.' /> }
                  {transaction.confirmations === 1 && <FormattedMessage id='scenes.transactions.list.listitem.transaction_confirmed_1' defaultMessage='Your transaction confirmation is in progress (1 block ahead).' /> }
                  {transaction.confirmations === 2 && <FormattedMessage id='scenes.transactions.list.listitem.transaction_confirmed_2' defaultMessage='Your transaction confirmation is in progress (2 blocks ahead).' /> }
                  {transaction.confirmations === 3 && <FormattedMessage id='scenes.transactions.list.listitem.transaction_confirmed_3' defaultMessage='Your transaction is confirmed (3 blocks ahead).' /> }
                </Tooltip>
              </TransactionTooltip>
            )
          }
        </TransactionStatus>
        <ExtraDetailsContainer>
          <div>
            { transaction.description !== ''
              ? <Text size='14px' weight={300}>
                <FormattedMessage id='scenes.transactions.list.listitem.description' defaultMessage='Description: {description}' values={{ description: transaction.description }} />
              </Text>
              : <Text size='14px' weight={300}>
                <FormattedMessage id='scenes.transactions.list.listitem.adddescription' defaultMessage='Add a description' />
              </Text>
            }
            <Icon name='pencil' size='14px' />
          </div>
          <Text size='14px' weight={300}>
            <FormattedMessage id='scenes.transactions.list.listitem.to' defaultMessage='To : {to}' values={{ to: transaction.to }} />
          </Text>
          <Text size='14px' weight={300}>
            <FormattedMessage id='scenes.transactions.list.listitem.from' defaultMessage='From : {from}' values={{ from: transaction.from }} />
          </Text>
        </ExtraDetailsContainer>
        <ValueWhenReceived>
          <Text size='14px' weight={300}>
            <FormattedMessage id='scenes.transactions.list.listitem.initial' defaultMessage='Value when received: {value}' values={{ value: transaction.initial_value }} />
          </Text>
        </ValueWhenReceived>
      </RowDetails>
    </Wrapper>
  )
}

ListItem.propTypes = {
  toggled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  transaction: PropTypes.shape({
    type: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    time: PropTypes.number.isRequired,
    to: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.string,
    initial_value: PropTypes.string
  })
}

export default ListItem
