import React from 'react'
import { Flex, IconChevronRight, PaletteColors, Text } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { LocationAddress } from '@core/types'

import HighLight from '../HighLight'

const Row = styled.div`
  box-sizing: border-box;
  border-top: 1px solid ${PaletteColors['grey-000']};
  &:last-child {
    border-bottom: 1px solid ${PaletteColors['grey-000']};
  }
`
const FlexWrapper = styled(Row)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  cursor: pointer;
`

const DescriptionText = styled(Flex)`
  max-width: 260px;
`

const AddressItem = ({ address, handleClick, searchText }: Props) => {
  return (
    <FlexWrapper onClick={() => handleClick(address)}>
      <DescriptionText>
        <Text variant='body1'>
          <HighLight hightLight={searchText} text={address.text} />
        </Text>
      </DescriptionText>
      {address.type === 'Container' && (
        <Flex flexDirection='column' justifyContent='center'>
          <Flex>
            {address.description}
            <IconChevronRight
              color={PaletteColors['grey-400']}
              label='chevron-right'
              size='medium'
            />
          </Flex>
        </Flex>
      )}
    </FlexWrapper>
  )
}

type Props = {
  address: LocationAddress
  handleClick: (address: LocationAddress) => void
  searchText: string
}

export default AddressItem
