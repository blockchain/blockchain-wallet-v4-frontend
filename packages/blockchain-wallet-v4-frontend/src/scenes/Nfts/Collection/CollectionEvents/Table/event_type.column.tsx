import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { CellHeaderText, CellText } from 'components/Table'

const NameCell = styled(CellText)<{ role: 'button' }>`
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
`
const Logo = styled.img`
  height: 30px;
  width: 30px;
  border-radius: 50%;
  margin-right: 8px;
`

export const getEventTypeColumn = () => ({
  Cell: ({ row: { original: values } }) => {
    return (
      <NameCell cursor='pointer' role='button'>
        <Logo src={values.image_url} />
        {values.event_type}
      </NameCell>
    )
  },
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.event_type' defaultMessage='Event' />
    </CellHeaderText>
  ),
  accessor: 'event_type',
  disableGlobalFilter: true
})
