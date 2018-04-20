import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { FlatLoader, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  box-sizing: border-box;
`

export default (props) => {
  return (
    <Wrapper>
      <Text size='12px' weight={300}>
        <FormattedMessage id='scenes.transactions.bitcoin.content.list.listitem.initial' defaultMessage={`Value when ${props.type}: `} />
      </Text>
      <FlatLoader width='40px' height='10px' />
    </Wrapper>
  )
}
