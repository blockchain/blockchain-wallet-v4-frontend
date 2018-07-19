import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Tooltip, Link } from 'blockchain-info-components'

class TxFeedTooltips extends React.PureComponent {
  render() {
    return (
      <div>
        <Tooltip id="addr" multiline />
        <Tooltip id="confirmations">
          <FormattedMessage
            id="scenes.transactions.content.list.listitem.transactionunconfirmed"
            defaultMessage="Your transaction will be complete after it has {minConfirmations} confirmations."
            values={{ minConfirmations: 3 }}
          />
          <Link
            href="https://support.blockchain.com/hc/en-us/articles/217116406-Why-hasn-t-my-transaction-confirmed-yet-"
            target="_blank"
            size="11px"
            weight={300}
            altFont
          >
            Learn more.
          </Link>
        </Tooltip>
      </div>
    )
  }
}

export default TxFeedTooltips
