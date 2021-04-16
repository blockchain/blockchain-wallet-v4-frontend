import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

const HelpContainer = styled.div`
  display: inline-flex;
  cursor: pointer;
`

const Help = () => {
  return (
    <HelpContainer>
      <LinkContainer to='/help'>
        <Text color='grey400' size='16px' weight={500}>
          <FormattedMessage
            id='scenes.login.need.help'
            defaultMessage='Need Help?'
          />
        </Text>
      </LinkContainer>
    </HelpContainer>
  )
}
export default Help
