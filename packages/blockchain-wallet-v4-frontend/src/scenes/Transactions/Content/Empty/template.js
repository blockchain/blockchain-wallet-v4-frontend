import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Icon, IconButton, Separator, Text } from 'blockchain-info-components'
import BchWelcome from './BchWelcome'
import BtcWelcome from './BtcWelcome'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`
const Transactions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
`
const Bitcoin = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
  & > :first-child {
    margin-right: 10px;
  }
`
const TransactionIcon = styled(Icon)`
  justify-content: center;
`

const Empty = props => {
  const { handleSend, handleRequest, coin } = props

  return (
    <Wrapper>
      {coin === 'BTC' ? <BtcWelcome /> : <BchWelcome />}
      <Transactions>
        <Text size='20px' weight={300} capitalize>
          <TransactionIcon name='transactions' />
          <FormattedMessage
            id='scenes.transactions.content.empty.transactions'
            defaultMessage='Your transactions'
          />
        </Text>
        <Text size='14px' weight={300}>
          <FormattedMessage
            id='scenes.transactions.content.empty.explain'
            defaultMessage='Transactions occur when you send and receive currencies.'
          />
        </Text>
        <Separator />
      </Transactions>
      <Bitcoin>
        <IconButton name='send' nature='empty' onClick={handleSend}>
          <FormattedMessage
            id='scenes.transactions.content.empty.send'
            defaultMessage='Send'
          />
        </IconButton>
        <IconButton name='request' nature='empty' onClick={handleRequest}>
          <FormattedMessage
            id='scenes.transactions.content.empty.request'
            defaultMessage='Request'
          />
        </IconButton>
      </Bitcoin>
    </Wrapper>
  )
}

Empty.propTypes = {
  handleSend: PropTypes.func.isRequired,
  handleRequest: PropTypes.func.isRequired
}

export default Empty
