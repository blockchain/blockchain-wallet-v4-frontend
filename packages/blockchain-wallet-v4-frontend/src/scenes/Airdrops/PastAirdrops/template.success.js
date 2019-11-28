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
  return (
    <Table>
      <TableHeader>
        <TableCell>
          <Text>Type</Text>
        </TableCell>
        <TableCell>
          <Text>Status</Text>
        </TableCell>
        <TableCell>
          <Text>Date</Text>
        </TableCell>
        <TableCell>
          <Text>To</Text>
        </TableCell>
        <TableCell>
          <Text>Amount</Text>
        </TableCell>
      </TableHeader>
      {userCampaignsInfoResponseList.map((campaign, id) => {
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
