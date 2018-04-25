import React from 'react'
import styled from 'styled-components'

import { Icon, Text, TableCell, TableRow, Link } from 'blockchain-info-components'

const ClickableIcon = styled(Icon)`
  &:hover {
    cursor: pointer;
  }
`

const UnusedAddressesTableEntry = ({ entry, deriveAddress, onEditLabel, onDeleteLabel }) => (
  <TableRow>
    <TableCell width='40%'>
      <Link href={`https://blockchain.info/address/${deriveAddress(entry.index)}`} size='small' weight={300} target='_blank'>
        {deriveAddress(entry.index)}
      </Link>
    </TableCell>
    <TableCell width='40%'>
      <Text size='13px'>{entry.label}</Text>
    </TableCell>
    <TableCell style={{ display: 'flex', justifyContent: 'flex-end' }} width='20%'>
      <ClickableIcon name='pencil' onClick={() => onEditLabel(entry.index)} style={{ marginRight: 10 }} />
      <ClickableIcon name='trash' onClick={() => onDeleteLabel(entry.index)} />
    </TableCell>
  </TableRow>
)

export default UnusedAddressesTableEntry
