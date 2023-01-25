import React from 'react'
import { Flex, Padding, SemanticColors, Text } from '@blockchain-com/constellation'

import { Container } from './TableRow.styles'
import { TableRowPropsType } from './TableRow.types'

const TableRow = ({
  activeInfo,
  hasBorder,
  passiveInfo,
  stakingInfo,
  title
}: TableRowPropsType) => (
  <Container hasBorder={hasBorder}>
    <Flex>
      <Flex alignItems='center' justifyContent='center'>
        <Padding horizontal={0.5} vertical={1}>
          <Flex>
            <Text color={SemanticColors.title} textAlign='center' variant='paragraph2'>
              {title}
            </Text>
          </Flex>
        </Padding>
      </Flex>
      <Flex alignItems='center' justifyContent='center'>
        <Padding horizontal={0.5} vertical={1}>
          <Flex>
            <Text color={SemanticColors.title} textAlign='center' variant='paragraph1'>
              {passiveInfo}
            </Text>
          </Flex>
        </Padding>
      </Flex>
      <Flex alignItems='center' justifyContent='center'>
        <Padding horizontal={0.5} vertical={1}>
          <Flex>
            <Text color={SemanticColors.title} textAlign='center' variant='paragraph1'>
              {stakingInfo}
            </Text>
          </Flex>
        </Padding>
      </Flex>
      <Flex alignItems='center' justifyContent='center'>
        <Padding horizontal={0.5} vertical={1}>
          <Flex>
            <Text color={SemanticColors.title} textAlign='center' variant='paragraph1'>
              {activeInfo}
            </Text>
          </Flex>
        </Padding>
      </Flex>
    </Flex>
  </Container>
)

export default TableRow
