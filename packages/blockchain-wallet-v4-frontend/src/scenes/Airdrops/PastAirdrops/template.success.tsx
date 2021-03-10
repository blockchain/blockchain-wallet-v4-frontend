import React from 'react'
import { FormattedMessage } from 'react-intl'
import { BigNumber } from 'bignumber.js'

import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Text
} from 'blockchain-info-components'
import { Exchange } from 'blockchain-wallet-v4/src'

import { Props } from '../template.success'
import { Status, To, Type } from './model'

const getQuantity = (amt, currency) => {
  switch (currency) {
    case 'STX':
      // TODO: use Exchange converter once implemented
      return new BigNumber(amt).dividedBy(10000000).toString()
    case 'XLM':
      return Exchange.convertXlmToXlm({
        value: amt,
        fromUnit: 'STROOP',
        toUnit: 'XLM'
      }).value
  }
}

export default function Success({ userCampaignsInfoResponseList }: Props) {
  const completedCampaigns = userCampaignsInfoResponseList.filter(
    campaign => campaign.campaignState === 'ENDED'
  )

  return (
    <div style={{ minWidth: '500px', paddingBottom: '45px' }}>
      <Table style={{ minWidth: '500px' }}>
        <TableHeader>
          <TableCell width='18%'>
            <Text size='12px' color='grey600' weight={500}>
              <FormattedMessage
                id='scenes.pastairdrops.type'
                defaultMessage='Type'
              />
            </Text>
          </TableCell>
          <TableCell width='18%'>
            <Text size='12px' color='grey600' weight={500}>
              <FormattedMessage
                id='scenes.pastairdrops.status'
                defaultMessage='Status'
              />
            </Text>
          </TableCell>
          <TableCell width='18%'>
            <Text size='12px' color='grey600' weight={500}>
              <FormattedMessage
                id='scenes.pastairdrops.date'
                defaultMessage='Date'
              />
            </Text>
          </TableCell>
          <TableCell width='18%'>
            <Text size='12px' color='grey600' weight={500}>
              <FormattedMessage
                id='scenes.pastairdrops.to'
                defaultMessage='To'
              />
            </Text>
          </TableCell>
          <TableCell width='28%'>
            <Text size='12px' color='grey600' weight={500}>
              <FormattedMessage
                id='scenes.pastairdrops.amount'
                defaultMessage='Amount'
              />
            </Text>
          </TableCell>
        </TableHeader>
        {completedCampaigns.map(campaign => {
          return campaign.userCampaignTransactionResponseList.length ? (
            // User has campaign transactions
            campaign.userCampaignTransactionResponseList.map(
              campaignTransaction => {
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
                        {campaignTransaction.withdrawalAt
                          ? new Date(
                              campaignTransaction.withdrawalAt
                            ).toLocaleDateString()
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
              }
            )
          ) : (
            // No campaign transactions but show some info anyway
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
        })}
      </Table>
    </div>
  )
}
