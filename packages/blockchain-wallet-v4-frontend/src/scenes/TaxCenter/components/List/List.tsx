import React from 'react'
import { FormattedMessage } from 'react-intl'
import { colors, Icon, IconName } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'

const ReportItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const List = ({ reports }) => (
  <>
    {reports.map(({ id }) => (
      <ReportItem key={id}>
        <Content>
          <Icon name={IconName.CLIPBOARD} color={colors.blue600} size='md' />
          <Description>
            <Text size='16px' weight={600}>
              All Time Transaction History
            </Text>
            <Text size='14px'>01/05/2022</Text>
          </Description>
        </Content>
        <Button nature='empty-blue' data-e2e='exportButton' type='button'>
          <StyledIcon name={IconName.DOWNLOAD} color={colors.blue600} size='sm' />
          <FormattedMessage id='scenes.tax.center.list.component.export' defaultMessage='Export' />
        </Button>
      </ReportItem>
    ))}
  </>
)

export default List
