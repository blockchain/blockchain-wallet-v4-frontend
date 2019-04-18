import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Link, Text } from 'blockchain-info-components'
import {
  WarningWrapper,
  WarningLeftColumn,
  WarningRightColumn,
  WarningHeader
} from '../Components'

const LowEthWarningForErc20 = () => {
  return (
    <WarningWrapper>
      <WarningLeftColumn>
        <WarningHeader size='14px' weight={400} color='orange'>
          <FormattedMessage
            id='modals.sendeth.lowethwarningforerc20.title'
            defaultMessage='Not Enough Eth'
          />
        </WarningHeader>
        <Text size='13px' weight={300}>
          <FormattedMessage
            id='modals.sendeth.lowethwarningforerc20.explain'
            defaultMessage="You'll need ETH to send your ERC20 Token, USD Pax."
          />
        </Text>
      </WarningLeftColumn>
      <WarningRightColumn>
        <Link
          size='13px'
          weight={400}
          href='https://support.blockchain.com'
          target='_blank'
        >
          <FormattedMessage
            id='modals.sendeth.lowethwarningforerc20.learn'
            defaultMessage='Learn More'
          />
        </Link>
      </WarningRightColumn>
    </WarningWrapper>
  )
}

export default LowEthWarningForErc20
