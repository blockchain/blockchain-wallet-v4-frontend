import React from 'react'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { SelectBox } from 'components/Form'

const ItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 5px;
  box-sizing: border-box;
  cursor: pointer;
  overflow-x: scroll;
  & > * {
    margin-left: 5px;
  }
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    width: 0 !important;
    height: 0 !important;
  }
`

const renderItem = item => (
  <ItemWrapper>
    <Text weight={300} size='14px'>
      {item.text}
    </Text>
  </ItemWrapper>
)

export default props => (
  <SelectBox {...props} templateItem={renderItem} grouped />
)
