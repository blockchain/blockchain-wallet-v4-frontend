import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { Flex, Padding, SemanticColors, Text } from '@blockchain-com/constellation'

import { Icon } from 'blockchain-info-components'

import { getData } from './CustodialAccount.selectors'
import { Wrapper } from './CustodialAccount.styles'
import { PropsType } from './CustodialAccount.types'

const CustodialAccount = ({ coin, cryptoAmount, fiatAmount, product }: PropsType) => {
  const { coins } = useSelector(getData)
  const { coinfig } = coins[coin]

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
