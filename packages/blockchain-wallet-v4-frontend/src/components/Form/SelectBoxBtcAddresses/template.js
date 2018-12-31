import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { path } from 'ramda'

import { Banner, Text } from 'blockchain-info-components'
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

const renderItem = item => {
  return (
    <ItemWrapper>
      <Text weight={300} size='14px'>
        {item.text}
      </Text>
      {path(['value', 'watchOnly'], item) && (
        <Banner type='informational' inline>
          <FormattedMessage
            id='components.selectboxbtcaddresses.watchonly'
            defaultMessage='Non-Spendable'
          />
        </Banner>
      )}
    </ItemWrapper>
  )
}

export default props => (
  <SelectBox {...props} templateItem={renderItem} grouped />
)
