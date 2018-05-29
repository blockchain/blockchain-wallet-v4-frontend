import React from 'react'

import { Text, TableCell, TableRow, Link } from 'blockchain-info-components'

const UsedAddressesTableEntry = ({ address }) => (
  <TableRow>
    <TableCell width='40%'>
      <Link href={`https://blockchain.info/address/TODO`} size='small' weight={300} target='_blank'>
        {address}
      </Link>
    </TableCell>
    <TableCell width='40%'>
      <Text size='13px'>
        TODO
      </Text>
    </TableCell>
    <TableCell style={{ display: 'flex', justifyContent: 'flex-end' }} width='20%'>
      <Text size='13px'>
        TODO
      </Text>
    </TableCell>
  </TableRow>
)

export default UsedAddressesTableEntry
