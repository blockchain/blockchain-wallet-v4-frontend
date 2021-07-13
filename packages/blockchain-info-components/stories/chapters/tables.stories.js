import React from 'react'
import { withInfo } from '@storybook/addon-info'
import { addDecorator } from '@storybook/react'

import Layout from '../components/layout'
import { Table, TableCell, TableHeader, TableRow } from '../../src'

addDecorator(withInfo)

export default {
  title: 'Tables',
  parameters: {
    info: { text: 'Documentation', inline: true }
  },
  decorators: [(story) => <Layout>{story()}</Layout>]
}

export const _Table = () => (
  <Table>
    <TableHeader>
      <TableCell>Header 1</TableCell>
      <TableCell>Header 2</TableCell>
      <TableCell>Header 3</TableCell>
      <TableCell>Header 4</TableCell>
    </TableHeader>
    <TableRow>
      <TableCell>Cell 1-1</TableCell>
      <TableCell>Cell 2-1</TableCell>
      <TableCell>Cell 3-1</TableCell>
      <TableCell>Cell 4-1</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Cell 1-2</TableCell>
      <TableCell>Cell 2-2</TableCell>
      <TableCell>Cell 3-2</TableCell>
      <TableCell>Cell 4-2</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Cell 1-3</TableCell>
      <TableCell>Cell 2-3</TableCell>
      <TableCell>Cell 3-3</TableCell>
      <TableCell>Cell 4-3</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Cell 1-4</TableCell>
      <TableCell>Cell 2-4</TableCell>
      <TableCell>Cell 3-4</TableCell>
      <TableCell>Cell 4-4</TableCell>
    </TableRow>
  </Table>
)

export const TableWithCustomWidth = () => (
  <Table>
    <TableHeader>
      <TableCell width='10%'>Header 1</TableCell>
      <TableCell width='35%'>Header 2</TableCell>
      <TableCell width='20%'>Header 3</TableCell>
      <TableCell width='35%'>Header 4</TableCell>
    </TableHeader>
    <TableRow>
      <TableCell width='10%'>Cell 1-1</TableCell>
      <TableCell width='35%'>Cell 2-1</TableCell>
      <TableCell width='20%'>Cell 3-1</TableCell>
      <TableCell width='35%'>Cell 4-1</TableCell>
    </TableRow>
    <TableRow>
      <TableCell width='10%'>Cell 1-2</TableCell>
      <TableCell width='35%'>Cell 2-2</TableCell>
      <TableCell width='20%'>Cell 3-2</TableCell>
      <TableCell width='35%'>Cell 4-2</TableCell>
    </TableRow>
    <TableRow>
      <TableCell width='10%'>Cell 1-3</TableCell>
      <TableCell width='35%'>Cell 2-3</TableCell>
      <TableCell width='20%'>Cell 3-3</TableCell>
      <TableCell width='35%'>Cell 4-3</TableCell>
    </TableRow>
    <TableRow>
      <TableCell width='10%'>Cell 1-4</TableCell>
      <TableCell width='35%'>Cell 2-4</TableCell>
      <TableCell width='20%'>Cell 3-4</TableCell>
      <TableCell width='35%'>Cell 4-4</TableCell>
    </TableRow>
  </Table>
)

TableWithCustomWidth.story = {
  name: 'Table with custom width'
}
