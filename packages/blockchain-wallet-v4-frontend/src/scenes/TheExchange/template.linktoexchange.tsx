import { Button, Link } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { Props } from './template'
import React from 'react'

const LinkToExchange: React.FC<Props> = props => {
  const exchangeUrl = props.domains.exchange + '/trade'

  return (
    <Link
      href={`${exchangeUrl}?utm_source=web_wallet&utm_medium=referral&utm_campaign=sidenav_exchange_linked`}
      rel='noopener noreferrer'
      target='_blank'
    >
      <Button
        data-e2e='launchExchange'
        nature='primary'
        height='48px'
        fullwidth
      >
        <FormattedMessage
          id='scenes.exchange.launchexchange'
          defaultMessage='Launch Exchange'
        />
      </Button>
    </Link>
  )
}

export default LinkToExchange
