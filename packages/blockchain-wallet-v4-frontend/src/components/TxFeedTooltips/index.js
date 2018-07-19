import React from 'react'
import { FormattedMessage } from 'react-intl'
import ReactTooltip from 'react-tooltip'
import { Link } from 'blockchain-info-components'
import styled from 'styled-components'

const StyledTip = styled(ReactTooltip)`
  pointer-events: auto !important;
  &:hover {
    visibility: visible !important;
    opacity: 1 !important;
  }
`

class TxFeedTooltips extends React.PureComponent {
  render () {
    return (
      <div>
        <StyledTip
          id='addr'
          multiline
          effect='solid'
          delayHide={200}
          offset={{ bottom: 8 }}
        />
        <StyledTip
          id='confirmations'
          effect='solid'
          delayHide={200}
          offset={{ bottom: 8 }}
        >
          <FormattedMessage
            id='scenes.transactions.content.list.listitem.transactionunconfirmed'
            defaultMessage='Your transaction will be complete after it has {minConfirmations} confirmations.'
            values={{ minConfirmations: 3 }}
          />
          <Link
            href='https://support.blockchain.com/hc/en-us/articles/217116406-Why-hasn-t-my-transaction-confirmed-yet-'
            target='_blank'
            size='11px'
            weight={300}
            altFont
          >
            Learn more.
          </Link>
        </StyledTip>
      </div>
    )
  }
}

export default TxFeedTooltips
