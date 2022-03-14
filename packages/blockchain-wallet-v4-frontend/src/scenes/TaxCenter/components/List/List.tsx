import React from 'react'
import { FormattedMessage } from 'react-intl'
import { colors, Icon, IconName } from '@blockchain-com/constellation'
import moment from 'moment'
import styled from 'styled-components'

import { Button, Link, Text } from 'blockchain-info-components'

const ReportItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
`

const Content = styled.div`
  display: flex;

  svg {
    margin-top: 4px;
  }
`

const Description = styled.div`
  margin-left: 16px;
`

const StyledIcon = styled(Icon)`
  margin-right: 8px;
`
const COMPLETED_STATUS = 'COMPLETED'

const getReportTitle = (from, to) => {
  if (moment(to).diff(moment(from), 'year') === 0) {
    return moment(to).format('YYYY')
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
    {reports.map(({ filePath, from, id, insertedAt, status, to }) => (
      <ReportItem key={id}>
        <Content>
          <Icon name={IconName.CLIPBOARD} color={colors.blue600} size='md' />
          <Description>
            <Text size='16px' weight={600}>
              {getReportTitle(from, to)}
            </Text>
            <Text size='14px'>{moment(insertedAt).format('DD/MM/YYYY')}</Text>
          </Description>
        </Content>
        {status === COMPLETED_STATUS && (
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
        {status !== COMPLETED_STATUS && (
          <Button nature='grey400' data-e2e='exportButton' type='button'>
            <FormattedMessage
              id='scenes.tax.center.list.component.generating'
              defaultMessage='Generating'
            />
          </Button>
        )}
      </ReportItem>
    ))}
  </>
)

export default List
