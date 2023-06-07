import React from 'react'
import { Flex, Padding, SemanticColors, Text } from '@blockchain-com/constellation'

export const ErrorMessage = ({ error }: { error: string }) => (
  <Padding vertical={1}>
    <Flex justifyContent='center'>
      <Text color={SemanticColors.error} textAlign='center' variant='paragraph1'>
        {error}
      </Text>
    </Flex>
  </Padding>
)
