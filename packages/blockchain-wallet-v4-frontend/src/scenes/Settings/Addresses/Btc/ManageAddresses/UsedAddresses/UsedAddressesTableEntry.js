import React from 'react'
import styled from 'styled-components'

import { Icon, Text, TableCell, TableRow, Link } from 'blockchain-info-components'

const UsedAddressesTableEntry = ({  }) => (
  <TableRow>
    <TableCell width='40%'>
      <Link href={`https://blockchain.info/address/1`} size='small' weight={300} target='_blank'>
        123124
      </Link>
    </TableCell>
    <TableCell width='40%'>
      <Text size='13px'>{'testsdg'}</Text>
    </TableCell>
    <TableCell style={{ display: 'flex', justifyContent: 'flex-end' }} width='20%'>
      12321
    </TableCell>
  </TableRow>
)

export default UsedAddressesTableEntry
