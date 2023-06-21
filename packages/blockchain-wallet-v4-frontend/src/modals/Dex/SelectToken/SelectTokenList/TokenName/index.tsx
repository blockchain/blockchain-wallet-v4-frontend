import React from 'react'
import { SemanticColors, Text } from '@blockchain-com/constellation'

const TokenName = ({ name }: { name: string }) => (
  <Text color={SemanticColors.body} variant='body2'>
    {name}
  </Text>
)

export default TokenName
