import { FormattedMessage } from 'react-intl'
import { Status, To, Type } from './model'
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Text
} from 'blockchain-info-components'
import React from 'react'

export default function Success ({ userCampaignsInfoResponseList }) {
  const completedCampaigns = userCampaignsInfoResponseList.filter(
    campaign => campaign.campaignState === 'ENDED'
  )

  return (
    <Table>
      <TableHeader>
        <TableCell>
          <Text size='12px' weight={500}>
            <FormattedMessage
              id='scenes.pastairdrops.type'
              defaultMessage='Type'
            />
          </Text>
        </TableCell>
        <TableCell>
          <Text size='12px' weight={500}>
            <FormattedMessage
              id='scenes.pastairdrops.status'
              defaultMessage='Status'
            />
          </Text>
        </TableCell>
        <TableCell>
          <Text size='12px' weight={500}>
            <FormattedMessage
              id='scenes.pastairdrops.date'
              defaultMessage='Date'
            />
          </Text>
        </TableCell>
        <TableCell>
          <Text size='12px' weight={500}>
            <FormattedMessage id='scenes.pastairdrops.to' defaultMessage='To' />
          </Text>
        </TableCell>
        <TableCell>
          <Text size='12px' weight={500}>
            <FormattedMessage
              id='scenes.pastairdrops.amount'
              defaultMessage='Amount'
            />
          </Text>
        </TableCell>
      </TableHeader>
      {completedCampaigns.map((campaign, id) => {
        return (
          <TableRow>
            <TableCell>
              <Type {...campaign} />
            </TableCell>
            <TableCell>
              <Status {...campaign} />
            </TableCell>
            <TableCell>
              <Text size='14px' weight={500}>
                {campaign.campaignEndDate
                  ? new Date(campaign.campaignEndDate).toLocaleDateString()
                  : '-'}
              </Text>
            </TableCell>
            <TableCell>
              <To {...campaign} />
            </TableCell>
            <TableCell>
              <Text>-</Text>
            </TableCell>
          </TableRow>
        )
      })}
    </Table>
  )
}
