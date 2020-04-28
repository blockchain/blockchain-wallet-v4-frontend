import { FormattedMessage } from 'react-intl'
import { Link, Text } from 'blockchain-info-components'
import {
  WarningHeader,
  WarningLeftColumn,
  WarningRightColumn,
  WarningWrapper
} from '../Components'
import React from 'react'

const LowEthWarningForErc20 = () => {
  return (
    <WarningWrapper>
      <WarningLeftColumn>
        <WarningHeader size='14px' weight={500} color='orange600'>
          <FormattedMessage
            id='modals.sendeth.lowethwarningforerc20.title1'
            defaultMessage='Not Enough ETH'
          />
        </WarningHeader>
        <Text size='13px' weight={400}>
          <FormattedMessage
            id='modals.sendeth.lowethwarningforerc20.explain1'
            defaultMessage="You'll need ETH to send your ERC20 Token, USD Digital."
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
            id='buttons.learn_more'
            defaultMessage='Learn More'
          />
        </Link>
      </WarningRightColumn>
    </WarningWrapper>
  )
}

export default LowEthWarningForErc20
