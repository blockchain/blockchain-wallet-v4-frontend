import React from 'react'
import { Text } from 'blockchain-info-components'
import styled from 'styled-components'

import { CreatableInputField, SelectBox } from 'components/Form'

const ItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  cursor: pointer;
  overflow-x: scroll;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    width: 0 !important;
    height: 0 !important;
  }
  > div {
    white-space: nowrap;
  }
`

const renderItem = item => {
  return (
    <ItemWrapper data-e2e='bchAddressOption'>
      <Text weight={400} size='14px'>
        {item.text}
      </Text>
    </ItemWrapper>
  )
}

export default props => {
  const { input, meta, ...rest } = props
  return rest.isCreatable ? (
    <CreatableInputField {...props} templateItem={renderItem} grouped />
  ) : (
    <SelectBox {...props} templateItem={renderItem} grouped />
  )
}
