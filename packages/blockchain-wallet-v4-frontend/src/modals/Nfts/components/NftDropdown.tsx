import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon } from '@blockchain-com/constellation'
import { IconChevronDown, IconChevronUp } from '@blockchain-com/icons'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

const Wrapper = styled.div`
  border: 1px solid ${(props) => props.theme.grey100};
  border-radius: 8px;
`

const Top = styled.div.attrs({ role: 'button' })`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 1em;
`

const IconWrapper = styled.div`
  display: flex;
`

const FeesWrapper = styled.div``

const FeeChild = styled.div<{ hasPadding: boolean }>`
  border-top: 1px solid ${(props) => props.theme.grey100};
  padding: ${({ hasPadding }) => (hasPadding ? '1em' : '0')};
`

const NftDropdown: React.FC<Props> = ({
  children,
  expanded = false,
  hasPadding = false,
  title,
  totalFees
}) => {
  const [isActive, setIsActive] = useState(expanded)
  const toggleDropdown = () => {
    setIsActive(!isActive)
  }

  return (
    <Wrapper>
      <Top onClick={toggleDropdown}>
        <Text weight={600} size='14px' color='grey900'>
          {title}
        </Text>
        <Flex alignItems='center' gap={8}>
          <Text weight={600} size='14px'>
            {totalFees || ''}
          </Text>
          <IconWrapper>
            {!isActive ? (
              <Icon label='chevron-right' color='grey400' size='sm'>
                <IconChevronDown />
              </Icon>
            ) : (
              <Icon label='chevron-down' color='grey400' size='sm'>
                <IconChevronUp />
              </Icon>
            )}
          </IconWrapper>
        </Flex>
      </Top>
      <FeesWrapper style={isActive ? {} : { display: 'none' }}>
        {React.Children.map(children, (child) =>
          child ? <FeeChild hasPadding={hasPadding}>{child}</FeeChild> : null
        )}
      </FeesWrapper>
    </Wrapper>
  )
}

type Props = {
  expanded?: boolean
  hasPadding?: boolean
  title?: string
  totalFees?: string
}

export default NftDropdown
