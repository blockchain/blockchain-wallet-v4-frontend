import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Flex } from 'components/Flex'
import { CellHeaderText, CellText } from 'components/Table'

import EventTypeIcon from '../../components/EventTypeIcon'
import EventTypeName from '../../components/EventTypeName'

const NameCell = styled(CellText)`
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  gap: 8px;
`

const FlexIconWrapper = styled(Flex)`
  background: ${(props) => props.theme.grey000};
  border-radius: 50%;
  height: 36px;
  width: 36px;
`

export const getEventTypeColumn = () => ({
  Cell: ({ row: { original: values } }) => {
    return (
      <NameCell>
        <FlexIconWrapper justifyContent='center' alignItems='center'>
          <EventTypeIcon event_type={values.event_type} label='event' size='small' />
        </FlexIconWrapper>
        <EventTypeName event_type={values.event_type} />
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
