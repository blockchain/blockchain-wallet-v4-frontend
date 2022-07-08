import React from 'react'
import { Icon } from '@blockchain-com/constellation'
import { IconChevronDown, IconChevronUp, IconFlag } from '@blockchain-com/icons'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 24px 16px;
`
const RightColumn = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`
const GasFeeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 20px;
  padding: 4px 8px;
  margin-right: 8px;
  border-radius: 4px;
  background-color: ${(props) => props.theme.grey000};
  > :first-child {
    margin-right: 4px;
  }
`
const ShowDetailsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`

const BaseRateAndFees = ({ handleDetailsToggle, swapDetailsOpen }: Props) => (
  <Wrapper>
    <Text weight={500} size='14px' color='textBlack'>
      1 ETH = 23432 YSD
    </Text>
    <RightColumn>
      <GasFeeWrapper>
        <Icon label='gas fees' color='grey400' size='sm'>
          <IconFlag />
        </Icon>
        <Text weight={600} size='12px' color='textBlack' lineHeight='150%'>
          ~$6.43
        </Text>
      </GasFeeWrapper>
      <ShowDetailsWrapper>
        {swapDetailsOpen && (
          <Icon label='hide swap details' color='grey400' size='md'>
            <IconChevronUp onClick={handleDetailsToggle} />
          </Icon>
        )}
        {!swapDetailsOpen && (
          <Icon label='show swap details' color='grey400' size='md'>
            <IconChevronDown onClick={handleDetailsToggle} />
          </Icon>
        )}
      </ShowDetailsWrapper>
    </RightColumn>
  </Wrapper>
)

type Props = {
  handleDetailsToggle: () => void
  swapDetailsOpen: boolean
}

export default BaseRateAndFees
