import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Icon, IconButton, Separator, Text } from 'blockchain-info-components'
import CoinWelcome from './CoinWelcome'

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
  margin-top: 40px;
  & > :first-child {
    margin-bottom: 6px;
  }
  & > :last-child {
    margin-top: 14px;
  }
`
const SendRequestContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  & > :first-child {
    margin-right: 10px;
  }
`
const TransactionIcon = styled(Icon)`
  justify-content: center;
  margin-bottom: 8px;
`

const Empty = props => {
  const { handleSend, handleRequest, coin } = props

  return (
    <Wrapper>
      <CoinWelcome coin={coin} />
      <Transactions>
        <Text size='20px' weight={300} capitalize>
          <TransactionIcon name='transactions' size='28px' />
          <FormattedMessage
            id='scenes.transactions.content.empty.transactions'
            defaultMessage='Your transactions'
          />
        </Text>
        <Text size='14px' weight={300}>
          <FormattedMessage
            id='scenes.transactions.content.empty.explain'
            defaultMessage='Transactions occur when you send and receive coins.'
          />
        </Text>
        <Separator />
      </Transactions>
      <SendRequestContainer>
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
      </SendRequestContainer>
    </Wrapper>
  )
}

Empty.propTypes = {
  handleSend: PropTypes.func.isRequired,
  handleRequest: PropTypes.func.isRequired
}

export default Empty
