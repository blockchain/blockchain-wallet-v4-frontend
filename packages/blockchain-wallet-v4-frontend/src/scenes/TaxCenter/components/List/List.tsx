import React from 'react'
import { FormattedMessage } from 'react-intl'
import { colors, Icon, IconName } from '@blockchain-com/constellation'

import { Button, Link, SpinningLoader, Text } from 'blockchain-info-components'

import { Content, Description, ReportItem, StyledIcon } from './model'

const COMPLETED_STATUS = 'COMPLETED'
const PENDING_STATUS = 'PENDING'

const getReportTitle = (from, to) => {
  const isAllTimeReport =
    Math.round((Number(new Date(to)) - Number(new Date(from))) / 1000 / 60 / 60 / 24 / 365) > 1

  if (!isAllTimeReport) {
    return new Date(to).getFullYear()
  }

  return (
    <FormattedMessage
      id='scenes.tax.center.list.component.all_time.report'
      defaultMessage='All Time Transaction History'
    />
  )
}

const List = ({ reports }) => (
  <>
    {reports.map(({ filePath, from, id, insertedAt, status, to }) => {
      const isCompleted = status === COMPLETED_STATUS
      const isPending = status === PENDING_STATUS
      const insertedDate = new Date(insertedAt)
      const inserted = `${insertedDate.getDate()}/${insertedDate.getMonth()}/${insertedDate.getFullYear()}`

      return (
        <ReportItem key={id}>
          <Content>
            {isPending && <SpinningLoader borderWidth='4px' width='16px' height='16px' />}
            {!isPending && <Icon name={IconName.CLIPBOARD} color={colors.blue600} size='md' />}
            <Description>
              <Text size='16px' weight={600}>
                {getReportTitle(from, to)}
              </Text>
              <Text size='14px'>{inserted}</Text>
            </Description>
          </Content>
          {isCompleted && (
            <Link href={filePath} target='_blank'>
              <Button nature='empty-blue' data-e2e='exportButton' type='button'>
                <StyledIcon name={IconName.DOWNLOAD} color={colors.blue600} size='sm' />
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
