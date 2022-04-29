import React, { useState } from 'react'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'

const Wrapper = styled.div`
  border: 1px solid ${(props) => props.theme.grey000};
  border-radius: 8px;
  padding: 1em;
`

const Top = styled.div`
  display: flex;
  justify-content: space-between;
`

const IconWrapper = styled.div`
  display: flex;
`

const FeesWrapper = styled.div`
  padding: 1em 0em 0em 0em;
`

const FeesDropdown: React.FC<Props> = ({ children, totalFees }) => {
  const [isActive, setIsActive] = useState(false)
  const toggleDropdown = () => {
    setIsActive(!isActive)
  }

  return (
    <Wrapper>
      <Top onClick={toggleDropdown}>
        <Text weight={600} color='grey800' lineHeight='24px' size='16px'>
          Network Fees
        </Text>
        <Text style={{ marginLeft: '2.6em' }} lineHeight='24px'>
          <FiatDisplay weight={500} size='14px' coin='ETH'>
            {totalFees}
          </FiatDisplay>
        </Text>
        {!isActive && (
          <IconWrapper>
            <Icon name='chevron-right' size='24px' color='grey400' />
          </IconWrapper>
        )}
        {isActive && (
          <IconWrapper>
            <Icon name='chevron-down' size='24px' color='grey400' />
          </IconWrapper>
        )}
      </Top>
      <FeesWrapper style={isActive ? {} : { display: 'none' }}>{children}</FeesWrapper>
    </Wrapper>
  )
}

type Props = {
  coin: string
  totalFees: string
}

export default FeesDropdown
