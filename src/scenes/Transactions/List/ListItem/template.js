import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'

import { ConfirmationGauge, Icon, Tooltip, Text } from 'blockchain-info-components'
import ButtonAmount from './ButtonAmount'
import StatusLabel from './StatusLabel'

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
const StatusContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-content: center;
  min-width: 220px;

  @media(min-width: 1200px) { 
    width: 20%; 
  }
`
const Arrow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 50px;
  transform: ${props => props.rotated ? 'rotate(-90deg)' : 'none'};
  cursor: pointer;
`
const Status = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 

  & > div > span {
    white-space: nowrap;
  }
`
const AddressesContainer = styled(HiddenOnMobile)`
  @media(min-width: 1200px) { 
    flex-direction: column;
    width: 35%;
  }
`
const Addresses = styled.div`
  min-width: 400px;
`
const DescriptionContainer = styled(HiddenOnMobile)`
  @media(min-width: 1200px) { width: 25%; }
`
const Description = styled.div`
  min-width: 250px;
`
const Edit = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const EditIcon = styled(Icon)`
  cursor: pointer;
`
const AmountContainer = styled.div`
  @media(min-width: 1200px) { 
    display: flex;
    width: 20%;
  }
`
const TransactionStatusContainer = styled.div`
  width: 100%;
  @media(min-width: 1200px) { width: 20%; }
`
const TransactionTooltipContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-items: space-between;

  & > div:first-child {
    width: 70%;
    margin-right: 5px;
  }
`
const ValueWhenReceivedContainer = styled.div`
  width: 100%;
  @media(min-width: 1200px) { width: 20%; }
`
const ExtraDetailsContainer = styled(HiddenOnDesktop)``

const ListItem = (props) => {
  const { toggled, handleToggle, transaction } = props

  const now = moment()
  const date = moment.utc(transaction.time * 1000)
  const formattedDate = (date.year() === now.year())
    ? date.format('MMMM D @kk:mm')
    : date.format('MMMM D YYYY @kk:mm')

  return (
    <Wrapper>
      <Row>
        <StatusContainer>
          <Arrow rotated={!toggled} onClick={handleToggle}>
            <Icon name='icon-down_arrow' />
          </Arrow>
          <Status>
            <StatusLabel {...props} />
            <Text size='12px' italic>{formattedDate}</Text>
          </Status>
        </StatusContainer>
        <AddressesContainer>
          <Addresses>
            <FormattedMessage id='scenes.transactions.list.listitem.to' defaultMessage='To : {to}' values={{ to: transaction.to }} />
            <FormattedMessage id='scenes.transactions.list.listitem.from' defaultMessage='From : {from}' values={{ from: transaction.from }} />
          </Addresses>
        </AddressesContainer>
        <DescriptionContainer>
          <Description>
            <Edit>
              { transaction.description !== ''
                ? <Text size='12px'>{transaction.description}</Text>
                : <Text size='12px'>Add a description</Text>
              }
              <EditIcon name='ti-pencil' />
            </Edit>
          </Description>
        </DescriptionContainer>
        <AmountContainer>
          <ButtonAmount {...props} />
        </AmountContainer>
      </Row>
      <RowDetails collapsed={!toggled}>
        <TransactionStatusContainer>
          { transaction.confirmations > 3
            ? <FormattedMessage id='scenes.transactions.list.listitem.transaction_confirmed' defaultMessage='Transaction confirmed' />
            : (
              <TransactionTooltipContainer>
                <ConfirmationGauge nbConfirmations={transaction.confirmations} />
                <Tooltip>
                  {transaction.confirmations === 0 && <FormattedMessage id='scenes.transactions.list.listitem.transaction_unconfirmed' defaultMessage='Your transaction is actually unconfirmed.' /> }
                  {transaction.confirmations === 1 && <FormattedMessage id='scenes.transactions.list.listitem.transaction_confirmed_1' defaultMessage='Your transaction confirmation is in progress (1 block ahead).' /> }
                  {transaction.confirmations === 2 && <FormattedMessage id='scenes.transactions.list.listitem.transaction_confirmed_2' defaultMessage='Your transaction confirmation is in progress (2 blocks ahead).' /> }
                  {transaction.confirmations === 3 && <FormattedMessage id='scenes.transactions.list.listitem.transaction_confirmed_3' defaultMessage='Your transaction is confirmed (3 blocks ahead).' /> }
                </Tooltip>
              </TransactionTooltipContainer>
            )
          }
        </TransactionStatusContainer>
        <ExtraDetailsContainer>
          <Edit>
            { transaction.description !== ''
              ? <Text size='12px'>{transaction.description}</Text>
              : <Text size='12px'>Add a description</Text>
            }
            <EditIcon name='ti-pencil' />
          </Edit>
        </ExtraDetailsContainer>
        <ExtraDetailsContainer>
          <FormattedMessage id='scenes.transactions.list.listitem.to' defaultMessage='To : {to}' values={{ to: transaction.to }} />
        </ExtraDetailsContainer>
        <ExtraDetailsContainer>
          <FormattedMessage id='scenes.transactions.list.listitem.from' defaultMessage='From : {from}' values={{ from: transaction.from }} />
        </ExtraDetailsContainer>
        <ValueWhenReceivedContainer>
          <Text size='12px'>{transaction.status}</Text>
          <FormattedMessage id='scenes.transactions.list.listitem.initial' defaultMessage='Value when received: {value}' values={{ value: transaction.initial_value }} />
        </ValueWhenReceivedContainer>
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
