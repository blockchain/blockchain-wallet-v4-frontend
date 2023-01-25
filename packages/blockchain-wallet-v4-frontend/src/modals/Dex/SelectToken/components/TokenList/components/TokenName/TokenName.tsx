import React from 'react'
import { Flex, SemanticColors, Text } from '@blockchain-com/constellation'
import type { BigNumber } from 'bignumber.js'

import type { DexToken } from '@core/network/api/dex'
import { notReachable } from 'utils/helpers'

import { VerificationCheckmark } from '../VerificationCheckmark'

// TODO: Create domain type and move getDexTokensList to a presenter level when decided how
export const TokenName = ({ token }: { token: DexToken & { balance: number | BigNumber } }) => {
  switch (token.type) {
    case 'NATIVE':
      return (
        <Text color={SemanticColors.body} variant='body2'>
          {token.name}
        </Text>
      )
    case 'NOT_NATIVE':
      if (token.verifiedBy > 2) {
        return (
          <Flex alignItems='center'>
            <Text color={SemanticColors.body} variant='body2'>
              {token.name}
            </Text>
            <VerificationCheckmark sources={token.verifiedBy} ml={10} />
          </Flex>
        )
      }
      return (
        <Text color={SemanticColors.body} variant='body2'>
          {token.name}
        </Text>
      )
    default:
      return notReachable(token)
  }
}
