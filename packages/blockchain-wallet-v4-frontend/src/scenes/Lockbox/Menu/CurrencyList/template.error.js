import React from 'react'
import styled from 'styled-components'
import { FormattedHTMLMessage } from 'react-intl'
import { Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 20px 40px;
  border-bottom: 1px solid ${props => props.theme['gray-1']};
  > div {
    margin-right: 25px;
  }
`

const Refresh = styled.div`
  background-color: ${props => props.theme['white-blue']};
  border-radius: 3px;
  margin-right: 25px;
  max-height: 72px;
  padding: 10px;
  width: 180px;
  .link {
    cursor: pointer;
    color: ${props => props.theme['brand-secondary']};
  }
`

const Error = props => {
  return (
    <Wrapper>
      <Refresh onClick={() => props.handleRefresh()}>
        <Text weight={300} size='14px'>
          <FormattedHTMLMessage
            id='scenes.lockbox.menu.currencylist.error'
            defaultMessage='Oops. Something went wrong. Click <span class=&quot;link&quot;>here</span> to refresh.'
          />
        </Text>
      </Refresh>
    </Wrapper>
  )
}

export default Error
