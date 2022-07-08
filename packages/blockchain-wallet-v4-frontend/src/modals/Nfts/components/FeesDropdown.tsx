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
<<<<<<< Updated upstream:packages/blockchain-wallet-v4-frontend/src/modals/Nfts/components/FeesDropdown.tsx
        <Text weight={500} size='14px'>
          <FormattedMessage id='copy.total_fees' defaultMessage='Total Fees' />
        </Text>
        <Flex alignItems='center' gap={8}>
          <Text weight={600} size='14px'>
            {totalFees}
=======
        <Text weight={600} size='16px' color='grey900'>
          {title}
        </Text>
        <Flex alignItems='center' gap={8}>
          <Text weight={600} size='16px'>
            {titleRight || ''}
>>>>>>> Stashed changes:packages/blockchain-wallet-v4-frontend/src/modals/Nfts/components/NftDropdown.tsx
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
<<<<<<< Updated upstream:packages/blockchain-wallet-v4-frontend/src/modals/Nfts/components/FeesDropdown.tsx
      <FeesWrapper style={isActive ? {} : { display: 'none' }}>
        {React.Children.map(children, (child) => (child ? <FeeChild>{child}</FeeChild> : null))}
      </FeesWrapper>
=======
      <ChildWrapper
        style={
          isActive
            ? { transition: 'opacity 0.5s linear' }
            : {
                height: '0',
                opacity: '0',
                visibility: 'hidden'
              }
        }
      >
        {React.Children.map(children, (child) =>
          child ? <Child hasPadding={hasPadding}>{child}</Child> : null
        )}
      </ChildWrapper>
>>>>>>> Stashed changes:packages/blockchain-wallet-v4-frontend/src/modals/Nfts/components/NftDropdown.tsx
    </Wrapper>
  )
}

type Props = {
<<<<<<< Updated upstream:packages/blockchain-wallet-v4-frontend/src/modals/Nfts/components/FeesDropdown.tsx
  totalFees: string
=======
  expanded?: boolean
  hasPadding?: boolean
  title?: string
  titleRight?: string | JSX.Element
>>>>>>> Stashed changes:packages/blockchain-wallet-v4-frontend/src/modals/Nfts/components/NftDropdown.tsx
}

export default FeesDropdown
