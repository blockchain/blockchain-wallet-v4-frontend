import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Icon, Text, TableCell, TableRow, Link } from 'blockchain-info-components'

const Wrapper = styled.div`
  margin-top: 25px;
  display: flex;
  flex-direction: row;
  align-items: center;
`
const UsedAddressesTemplate = ({ onShowUsedAddresses }) => (
  <Wrapper>
    <Text weight={400} size='14px' style={{ marginRight: '16px' }}>
      <FormattedMessage id='scenes.settings.manage_addresses.used_addresses' defaultMessage='Used Addresses' />
    </Text>
    <Link weight={200} size='12px' onClick={onShowUsedAddresses}>
      <FormattedMessage id='scenes.settings.manage_addresses.show_used_addresses' defaultMessage='Show' />
    </Link>
  </Wrapper>
)

export default UsedAddressesTemplate
