import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import settings from 'config'

import { ConfirmationGauge, Icon, Link, Text, Tooltip } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`

const TransactionTooltip = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-items: flex-start;
  align-items: flex-start;
  width: 150px;

  & > :last-child { width: 20px; margin-left: 10px; }
`

const Confirmation = props => props.confirmations > 3
  ? (
    <Wrapper>
      <Link href={`${settings.ROOT_URL}tx/${props.hash}`} target='_blank'>
        <Icon name='globe' color='received' cursor />
      </Link>
      <Text size='13px' weight={300} color='received'>
        <FormattedMessage id='scenes.transactions.bitcoin.content.pages.listitem.confirmation.confirmed' defaultMessage='Transaction confirmed' />
      </Text>
      <Icon name='checkmark' color='received' />
    </Wrapper>
  ) : (
    <TransactionTooltip>
      <ConfirmationGauge nbConfirmations={props.confirmations} />
      <Tooltip>
        <FormattedMessage id='scenes.transactions.bitcoin.content.list.listitem.transaction_unconfirmed' defaultMessage='Your transaction will be complete after it has 3 confirmations.' />
        <Link href='https://support.blockchain.com/hc/en-us/articles/217116406-Why-hasn-t-my-transaction-confirmed-yet-' target='_blank' size='12px' weight={300} altFont>Learn more.</Link>
      </Tooltip>
    </TransactionTooltip>
  )

Confirmation.propTypes = {
  confirmations: PropTypes.number.isRequired,
  hash: PropTypes.string.isRequired
}

export default Confirmation
