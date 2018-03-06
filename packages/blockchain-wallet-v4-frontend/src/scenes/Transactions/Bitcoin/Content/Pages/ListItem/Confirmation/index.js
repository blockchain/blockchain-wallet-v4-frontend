import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import settings from 'config'

import { Icon, Link, Text, Tooltip } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
`
const TransactionText = styled(Text)`
  
`
const TransactionTooltip = styled.div`
  position: relative;
  display: flex;
  justify-items: flex-start;
`
const IconWrapper = styled.div`
  display: flex;
  justify-items: center;
  margin-left: 6px;
  & > :last-child { margin-left: 4px; }
`

const Confirmation = (props) => {
  return (
    <Wrapper>
      <TransactionText size='13px' weight={300} color='received'>
        <FormattedMessage id='scenes.transactions.bitcoin.content.pages.listitem.confirmation.confirmed' defaultMessage='Transaction confirmed' />
      </TransactionText>
      <IconWrapper>
        <TransactionTooltip>
          <Tooltip>
            <FormattedMessage id='scenes.transactions.bitcoin.content.list.listitem.transaction_unconfirmed' defaultMessage='Your transaction will be complete after it has 3 confirmations.' />
            <Link href='https://support.blockchain.com/hc/en-us/articles/217116406-Why-hasn-t-my-transaction-confirmed-yet-' target='_blank' size='12px' weight={300} altFont>Learn more.</Link>
          </Tooltip>
        </TransactionTooltip>
        <Link href={`${settings.ROOT_URL}tx/${props.hash}`} target='_blank'>
          <Icon name='up-arrow-in-circle' color='marketing-primary' cursor='pointer' size='17px'/>
        </Link>
      </IconWrapper>
    </Wrapper>
  )
}
Confirmation.propTypes = {
  confirmations: PropTypes.number.isRequired,
  hash: PropTypes.string.isRequired
}

export default Confirmation
