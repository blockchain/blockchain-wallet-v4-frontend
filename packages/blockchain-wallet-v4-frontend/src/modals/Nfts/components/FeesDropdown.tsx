import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
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

const FeeChild = styled.div`
  padding: 1em;
  border-top: 1px solid ${(props) => props.theme.grey100};
`

const FeesDropdown: React.FC<Props> = ({ children, totalFees }) => {
  const [isActive, setIsActive] = useState(false)
  const toggleDropdown = () => {
    setIsActive(!isActive)
  }

  return (
    <Wrapper>
      <Top onClick={toggleDropdown}>
        <Text weight={500} size='14px'>
          <FormattedMessage id='copy.network_fees' defaultMessage='Network Fees' />
        </Text>
        <Flex alignItems='center' gap={8}>
          <Text weight={600} size='14px'>
            {totalFees}
          </Text>
          <IconWrapper>
            {!isActive ? (
              <Icon name='chevron-right' size='24px' color='grey400' />
            ) : (
              <Icon name='chevron-down' size='24px' color='grey400' />
            )}
          </IconWrapper>
        </Flex>
      </Top>
      <FeesWrapper style={isActive ? {} : { display: 'none' }}>
        {React.Children.map(children, (child) => (
          <FeeChild>{child}</FeeChild>
        ))}
      </FeesWrapper>
    </Wrapper>
  )
}

type Props = {
  totalFees: string
}

export default FeesDropdown
