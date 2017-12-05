import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import Layout from '../components/layout'
import { Table, TableCell, TableHeader, TableRow } from '../../src'

storiesOf('Tables', module)
  .addDecorator(story => (<Layout>{story()}</Layout>))
  .addDecorator((story, context) => withInfo({ text: 'Documentation', inline: true })(story)(context))
  .add('Table', () =>
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
  .add('Table with custom width', () =>
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
