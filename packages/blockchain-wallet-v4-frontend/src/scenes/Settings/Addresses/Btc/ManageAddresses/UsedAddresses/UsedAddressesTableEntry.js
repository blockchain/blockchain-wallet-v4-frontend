import React from 'react'

import { Text, TableCell, TableRow, Link } from 'blockchain-info-components'

const UsedAddressesTableEntry = () => (
  <TableRow>
    <TableCell width='40%'>
      <Link href={`https://blockchain.info/address/TODO`} size='small' weight={300} target='_blank'>
        TODO
      </Link>
    </TableCell>
    <TableCell width='40%'>
      <Text size='13px'>{'testsdg'}</Text>
    </TableCell>
    <TableCell style={{ display: 'flex', justifyContent: 'flex-end' }} width='20%'>
      TODO
    </TableCell>
  </TableRow>
)

export default UsedAddressesTableEntry
