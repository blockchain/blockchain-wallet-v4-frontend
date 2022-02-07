import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Exchange } from '@core'
import { Table, TableCell, TableHeader, TableRow, Text } from 'blockchain-info-components'

import { Props } from '../template.success'
import { Status, To, Type } from './model'

const getQuantity = (amt, coin) => {
  return Exchange.convertCoinToCoin({
    coin,
    value: amt
  })
}

const MissedCampaign = ({ campaign }) => {
  // filter out non-airdrops
  if (campaign.campaignName === 'MONETARY_INCENTIVE' || campaign.campaignName === 'MIAMI_2021') {
    return null
  }
  // no campaign transactions but show some info anyway
  return (
    <TableRow>
      <TableCell width='18%'>
        <Type {...campaign} />
      </TableCell>
      <TableCell width='18%'>
        <Status {...campaign} />
      </TableCell>
      <TableCell width='18%'>
        <Text size='14px' weight={500}>
          -
        </Text>
      </TableCell>
      <TableCell width='18%'>
        <To {...campaign} />
      </TableCell>
      <TableCell width='28%'>
        <Text>-</Text>
      </TableCell>
    </TableRow>
  )
}

export default function Success({ userCampaignsInfoResponseList }: Props) {
  const completedCampaigns = userCampaignsInfoResponseList.filter(
    (campaign) => campaign.campaignState === 'ENDED'
  )
  return (
    <div style={{ minWidth: '500px', paddingBottom: '45px' }}>
      <Table style={{ minWidth: '500px' }}>
        <TableHeader>
          <TableCell width='18%'>
            <Text size='12px' color='grey600' weight={500}>
              <FormattedMessage id='scenes.pastairdrops.type' defaultMessage='Type' />
            </Text>
          </TableCell>
          <TableCell width='18%'>
            <Text size='12px' color='grey600' weight={500}>
              <FormattedMessage id='scenes.pastairdrops.status' defaultMessage='Status' />
            </Text>
          </TableCell>
          <TableCell width='18%'>
            <Text size='12px' color='grey600' weight={500}>
              <FormattedMessage id='scenes.pastairdrops.date' defaultMessage='Date' />
            </Text>
          </TableCell>
          <TableCell width='18%'>
            <Text size='12px' color='grey600' weight={500}>
              <FormattedMessage id='scenes.pastairdrops.to' defaultMessage='To' />
            </Text>
          </TableCell>
          <TableCell width='28%'>
            <Text size='12px' color='grey600' weight={500}>
              <FormattedMessage id='scenes.pastairdrops.amount' defaultMessage='Amount' />
            </Text>
          </TableCell>
        </TableHeader>
        {completedCampaigns.map((campaign) => {
          return campaign.userCampaignTransactionResponseList.length ? (
            // User has campaign transactions
            campaign.userCampaignTransactionResponseList.map((campaignTransaction) => {
              return (
                <TableRow key={campaignTransaction.withdrawalCurrency}>
                  <TableCell width='18%'>
                    <Type {...campaign} />
                  </TableCell>
                  <TableCell width='18%'>
                    <Status {...campaign} />
                  </TableCell>
                  <TableCell width='18%'>
                    <Text size='14px' weight={500}>
                      {campaignTransaction.withdrawalAt
                        ? new Date(campaignTransaction.withdrawalAt).toLocaleDateString()
                        : '-'}
                    </Text>
                  </TableCell>
                  <TableCell width='18%'>
                    <To {...campaign} />
                  </TableCell>
                  <TableCell width='28%'>
                    <Text size='14px' weight={500}>
                      {getQuantity(
                        campaignTransaction.withdrawalQuantity,
                        campaignTransaction.withdrawalCurrency
                      )}{' '}
                      {campaignTransaction.withdrawalCurrency} (
                      {(campaignTransaction.fiatValue / 100).toFixed(2)}{' '}
                      {campaignTransaction.fiatCurrency})
                    </Text>
                  </TableCell>
                </TableRow>
              )
            })
          ) : (
            <MissedCampaign campaign={campaign} />
          )
        })}
      </Table>
    </div>
  )
}
