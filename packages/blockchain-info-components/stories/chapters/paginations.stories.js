import React from 'react'
import { withInfo } from '@storybook/addon-info'
import { addDecorator } from '@storybook/react'

import Layout from '../components/layout'
import { Pagination, PaginationItem } from '../../src'

addDecorator(withInfo)

export default {
  title: 'Paginations',
  parameters: {
    info: { text: 'Documentation', inline: true }
  },
  decorators: [(story) => <Layout>{story()}</Layout>]
}

export const _Pagination = () => (
  <Pagination>
    <PaginationItem>1</PaginationItem>
    <PaginationItem>2</PaginationItem>
    <PaginationItem>3</PaginationItem>
    <PaginationItem>4</PaginationItem>
    <PaginationItem>5</PaginationItem>
  </Pagination>
)

export const PaginationWithSelectedItem = () => (
  <Pagination>
    <PaginationItem>1</PaginationItem>
    <PaginationItem selected>2</PaginationItem>
    <PaginationItem>3</PaginationItem>
    <PaginationItem>4</PaginationItem>
    <PaginationItem>5</PaginationItem>
  </Pagination>
)

PaginationWithSelectedItem.story = {
  name: 'Pagination with selected item'
}
