import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { CellHeaderText } from '.'

const Link = styled.a`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  text-decoration: none;
  color: ${(props) => props.theme.blue600};
`

export const getLinkColumn = () => ({
  Cell: ({ row: { original: values } }) => {
    const { url } = values.sessionDetails.peerMeta
    return (
      <Link href={url} target='_blank' rel='noopener noreferrer'>
        {url}
      </Link>
    )
  },
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.link' defaultMessage='Link' />
    </CellHeaderText>
  ),
  accessor: 'link',
  sortType: 'alphanumeric'
})
