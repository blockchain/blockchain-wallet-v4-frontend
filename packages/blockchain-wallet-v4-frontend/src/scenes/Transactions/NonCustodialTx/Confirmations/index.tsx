import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { toString } from 'ramda'
import styled from 'styled-components'

import { Icon, Link, Tooltip, TooltipHost } from 'blockchain-info-components'
import { CoinType, WalletOptionsType } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { media } from 'services/styles'

import { RowValue } from '../../components'
import { getBlockHeight } from './selectors'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  z-index: 9;
  ${media.atLeastMobile`
    flex-direction: row;
  `}
`
const ConfirmationsText = styled(RowValue)`
  * {
    white-space: nowrap;
  }
`

const TransactionTooltip = styled(TooltipHost)`
  position: relative;
  display: flex;
  justify-items: flex-start;
`
const IconWrapper = styled.div`
  display: flex;
  justify-items: center;
  margin-left: 4px;
  & > :last-child {
    display: inline;
  }
`

const Confirmations = (props: Props) => {
  const { blockHeight, coin, domains, isConfirmed, onViewTxDetails, txBlockHeight = 0 } = props
  const conf = blockHeight - txBlockHeight + 1
  const confirmations = props.confirmations || (conf > 0 && txBlockHeight) ? conf : 0
  const { coinfig } = window.coins[coin]
  const { parentChain = coin } = coinfig.type
  const { minimumOnChainConfirmations = 3 } = window.coins[parentChain].coinfig.type

  return (
    <Wrapper>
      {confirmations >= minimumOnChainConfirmations || isConfirmed ? (
        <RowValue>
          <FormattedMessage
            id='scenes.transactions.content.pages.listitem.confirmation.confirmed'
            defaultMessage='Transaction Confirmed'
          />
        </RowValue>
      ) : (
        <ConfirmationsText size='14px' weight={400} color='grey400'>
          <FormattedMessage
            id='scenes.transactions.content.pages.listitem.confirmation.unconfirmed'
            defaultMessage='Pending: {count}/{total} Confirmations'
            values={{
              count: toString(confirmations),
              total: minimumOnChainConfirmations
            }}
          />
        </ConfirmationsText>
      )}
      <IconWrapper>
        {confirmations < minimumOnChainConfirmations && (
          <TransactionTooltip id='confirmations' data-iscapture='true' data-offset="{'left': 0.75}">
            <Icon name='question-in-circle' />
          </TransactionTooltip>
        )}
        <Link
          href={`${domains.comRoot}/search/?search=${props.hash}`}
          target='_blank'
          data-e2e='transactionListItemExplorerLink'
          onClick={() => onViewTxDetails(coin)}
        >
          <Icon name='open-in-new-tab' color='marketing-primary' cursor size='17px' />
        </Link>
      </IconWrapper>
      <Tooltip id='confirmations' offset={{ bottom: 8 }}>
        <FormattedMessage
          id='scenes.transactions.content.list.listitem.transactionunconfirmed'
          defaultMessage='Your transaction will be complete after it has {minimumOnChainConfirmations} confirmations.'
          values={{ minimumOnChainConfirmations }}
        />
        <span>&nbsp;</span>
        <Link
          href='https://support.blockchain.com/hc/en-us/articles/217116406-Why-hasn-t-my-transaction-confirmed-yet-'
          target='_blank'
          size='11px'
          weight={500}
          altFont
        >
          Learn more.
        </Link>
      </Tooltip>
    </Wrapper>
  )
}

const mapStateToProps = (state, ownProps) => ({
  blockHeight: getBlockHeight(state, ownProps.coin),
  domains: selectors.core.walletOptions.getDomains(state).getOrElse({
    comRoot: 'https://blockchain.com'
  } as WalletOptionsType['domains'])
})

const connector = connect(mapStateToProps)

type OwnProps = {
  coin: CoinType
  confirmations?: number
  hash: string
  isConfirmed?: boolean
  onViewTxDetails: (coin: CoinType) => void
  txBlockHeight?: number
}

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(Confirmations)
