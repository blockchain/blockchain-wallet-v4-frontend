import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Button, Link } from 'blockchain-info-components'

const NftNotInvited: React.FC<Props> = () => {
  return (
    <>
      <Link href='https://www.blockchain.com/waitlist/nft' target='_blank'>
        <Button jumbo nature='primary' fullwidth data-e2e='joinWaitlist'>
          <FormattedMessage id='copy.join_waitlist' defaultMessage='Join the Waitlist' />
        </Button>
      </Link>
    </>
  )
}

type Props = {}

export default NftNotInvited
