import { Banner, Text } from 'blockchain-info-components'
import { CreatableInputField, SelectBox } from 'components/Form'
import { FormattedMessage } from 'react-intl'
import { path } from 'ramda'
import React from 'react'
import styled from 'styled-components'

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
    <ItemWrapper data-e2e='btcAddressOption'>
      <Text weight={400} size='14px'>
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

export default props => {
  const { input, meta, ...rest } = props
  return rest.isCreatable ? (
    <CreatableInputField {...props} templateItem={renderItem} grouped />
  ) : (
    <SelectBox {...props} templateItem={renderItem} grouped />
  )
}
