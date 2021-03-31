import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Link, Text } from 'blockchain-info-components'

import {
  WarningHeader,
  WarningLeftColumn,
  WarningRightColumn,
  WarningWrapper
} from '../Components'

const LowEthWarningForErc20 = props => {
  const { coin } = props

  const supportArticle =
    coin === 'PAX'
      ? 'https://support.blockchain.com/hc/en-us/articles/360027492092-Why-do-I-need-ETH-to-send-USD-Digital-previously-USD-PAX-'
      : coin === 'USDT'
      ? 'https://support.blockchain.com/hc/en-us/articles/360045724832-Why-do-I-need-ETH-to-send-USDT-'
      : 'https://support.blockchain.com/hc/en-us/articles/360052984751-Why-do-I-need-ETH-to-send-wDGLD-'

  return (
    <WarningWrapper>
      <WarningLeftColumn>
        <WarningHeader size='14px' weight={500} color='orange600'>
          <FormattedMessage
            id='modals.sendeth.lowethwarningforerc20.title1'
            defaultMessage='Not Enough ETH in Private Key Wallet'
          />
        </WarningHeader>
        <Text size='13px' weight={400}>
          <FormattedMessage
            id='modals.sendeth.lowethwarningforerc20.explain1'
            defaultMessage="You'll need ETH to send your ERC20 Tokens"
          />
        </Text>
      </WarningLeftColumn>
      <WarningRightColumn>
        <Link size='13px' weight={500} href={supportArticle} target='_blank'>
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
