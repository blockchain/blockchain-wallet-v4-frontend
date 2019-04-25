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
        <WarningHeader size='14px' weight={500} color='orange'>
          <FormattedMessage
            id='modals.sendeth.lowethwarningforerc20.title'
            defaultMessage='Not Enough Eth'
          />
        </WarningHeader>
        <Text size='13px' weight={400}>
          <FormattedMessage
            id='modals.sendeth.lowethwarningforerc20.explain'
            defaultMessage="You'll need ETH to send your ERC20 Token, USD Pax."
          />
        </Text>
      </WarningLeftColumn>
      <WarningRightColumn>
        <Link
          size='13px'
          weight={500}
          href='https://support.blockchain.com/hc/en-us/sections/360004368351-USD-Pax-FAQ'
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
