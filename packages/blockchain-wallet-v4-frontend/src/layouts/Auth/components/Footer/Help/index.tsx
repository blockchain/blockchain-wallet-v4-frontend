import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Link, Text } from 'blockchain-info-components'

const HelpContainer = styled.div`
  display: inline-flex;
  cursor: pointer;
`

const Help = () => (
  <HelpContainer>
    <Link
      color='grey400'
      href='https://support.blockchain.com'
      size='14px'
      target='_blank'
      weight={500}
    >
      <Text color='grey400' size='16px' weight={500}>
        <FormattedMessage id='scenes.login.need.help' defaultMessage='Need Help?' />
      </Text>
    </Link>
  </HelpContainer>
)

export default Help
