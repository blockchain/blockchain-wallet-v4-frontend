import React from 'react'
import { FormattedMessage } from 'react-intl'
import { IconClipboard, IconDownload, Padding, PaletteColors } from '@blockchain-com/constellation'

import { Button, Link, Text } from 'blockchain-info-components'

import { Content, Description, EmptyReportList, ReportItem, StyledLoading } from './model'

const COMPLETED_STATUS = 'COMPLETED'
const PENDING_STATUS = 'PENDING'

const isAllTimeReport = (from, to) =>
  Math.round((Number(new Date(to)) - Number(new Date(from))) / 1000 / 60 / 60 / 24 / 365) > 1

const getTimePeriod = (from, to) => {
  if (!isAllTimeReport(from, to)) {
    return new Date(to).getFullYear()
  }
  return 0
}

const getReportTitle = (from, to) => {
  if (!isAllTimeReport(from, to)) {
    return new Date(to).getFullYear()
  }

  return (
    <FormattedMessage
      id='scenes.tax.center.list.component.all_time.report'
      defaultMessage='All Time Transaction History'
    />
  )
}

const List = ({ onExportClick, reports }) => (
  <>
    {!reports?.length && <EmptyReportList />}
    {reports.map(({ filePath, from, id, insertedAt, status, to }) => {
      const isCompleted = status === COMPLETED_STATUS
      const isPending = status === PENDING_STATUS
      const insertedDate = new Date(insertedAt)
      const inserted = `${insertedDate.getDate()}/${
        insertedDate.getMonth() + 1
      }/${insertedDate.getFullYear()}`
      const timePeriod = getTimePeriod(from, to)

      return (
        <ReportItem key={id}>
          <Content>
            {isPending && <StyledLoading borderWidth='4px' width='16px' height='16px' />}
            {!isPending && (
              <IconClipboard label='copy' color={PaletteColors['blue-600']} size='medium' />
            )}
            <Description>
              <Text size='16px' weight={600}>
                {getReportTitle(from, to)}
              </Text>
              <Text size='14px'>{inserted}</Text>
            </Description>
          </Content>
          {isCompleted && (
            <Link href={filePath} target='_blank' onClick={() => onExportClick(timePeriod)}>
              <Button nature='empty-blue' data-e2e='exportButton' type='button'>
                <Padding right={0.5}>
                  <IconDownload label='download' color={PaletteColors['blue-600']} size='small' />
                </Padding>
                <FormattedMessage
                  id='scenes.tax.center.list.component.export'
                  defaultMessage='Export'
                />
              </Button>
            </Link>
          )}
          {isPending && (
            <Button nature='grey400' data-e2e='exportButton' type='button'>
              <FormattedMessage
                id='scenes.tax.center.list.component.generating'
                defaultMessage='Generating'
              />
            </Button>
          )}
          {!isPending && !isCompleted && (
            <Button nature='grey400' data-e2e='exportButton' type='button'>
              <FormattedMessage
                id='scenes.tax.center.list.component.not_available'
                defaultMessage='Not available'
              />
            </Button>
          )}
        </ReportItem>
      )
    })}
  </>
)

export default List
