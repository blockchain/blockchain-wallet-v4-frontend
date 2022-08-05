import React from 'react'
import { Icon } from '@blockchain-com/constellation'
import { IconChevronDownV2 } from '@blockchain-com/icons'
import styled from 'styled-components'

import { Icon as CoinIcon, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

const Wrapper = styled.div`
  cursor: pointer;
  text-decoration: none;
`

const CoinIconWrapper = styled(Flex)`
  margin-right: 10px;
`

const ArrowIconWrapper = styled(Flex)`
  margin-left: 10px;
`

interface ICoinSelectProps {
  onClick(): void
  selectedCoin: string
}

const CoinSelect: React.FC<ICoinSelectProps> = ({ onClick, selectedCoin }) => (
  <Wrapper onClick={onClick}>
    <Flex alignItems='center'>
      <CoinIconWrapper>
        <CoinIcon name={selectedCoin} size='24px' />
      </CoinIconWrapper>
      <Text size='16px' lineHeight='24px' color='white' weight={600}>
        {selectedCoin}
      </Text>

      <ArrowIconWrapper>
        <Icon label='select-coin' color='grey400' size='md'>
          <IconChevronDownV2 />
        </Icon>
      </ArrowIconWrapper>
    </Flex>
  </Wrapper>
)

export default CoinSelect
