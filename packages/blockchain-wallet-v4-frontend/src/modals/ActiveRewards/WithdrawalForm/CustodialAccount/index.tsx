import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex, Padding, SemanticColors, Text } from '@blockchain-com/constellation'

import { Icon } from 'blockchain-info-components'

import { Wrapper } from './CustodialAccount.model'
import { PropsType } from './CustodialAccount.types'

const CustodialAccount = ({ coin, cryptoAmount, fiatAmount, product }: PropsType) => {
  const { coinfig } = window.coins[coin]

  return (
    <Wrapper>
      <Padding vertical={1} horizontal={1.5}>
        <Flex alignItems='center' gap={16}>
          <Icon name={coin} color={coin} size='24px' />
          <Flex flexDirection='column' justifyContent='center' gap={2}>
            <Text color={SemanticColors.title} variant='body2'>
              <FormattedMessage
                defaultMessage='{coinName} {product} Account'
                id='modals.active-rewards.custodialaccount.description'
                values={{
                  coinName: coinfig.name,
                  product
                }}
              />
            </Text>
            <Text color={SemanticColors.body} variant='paragraph1'>
              {fiatAmount} ({cryptoAmount} {coin})
            </Text>
          </Flex>
        </Flex>
      </Padding>
    </Wrapper>
  )
}

export default CustodialAccount
