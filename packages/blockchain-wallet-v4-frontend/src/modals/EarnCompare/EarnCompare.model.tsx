import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import {
  Button,
  Flex,
  IconLockClosed,
  IconRewardsCircle,
  Link,
  SemanticColors
} from '@blockchain-com/constellation'

import { Icon, Image } from 'blockchain-info-components'

import { TableDataPropsType } from './EarnComapre.types'
import { TableRowPropsType } from './TableRow/TableRow.types'
import TableTopTitle from './TableTopTitle'

export const tableData = ({
  maxActiveRate,
  maxPassiveRate,
  maxStakingRate
}: TableDataPropsType): TableRowPropsType[] => [
  // row0 top titles
  {
    activeInfo: (
      <TableTopTitle
        description={
          <FormattedMessage
            defaultMessage='Earn rewards by forecasting the market'
            id='modals.earn-compare.table.active.top-title.description'
          />
        }
        icon={<Image name='bars' width='20px' height='24px' />}
        title={
          <FormattedMessage
            defaultMessage='Active Rewards'
            id='modals.earn-compare.table.active.top-title.title'
          />
        }
      />
    ),
    key: 'modals.earn-compare.table.active.row0.info',
    passiveInfo: (
      <TableTopTitle
        description={
          <FormattedMessage
            defaultMessage='Earn rewards for simply holding'
            id='modals.earn-compare.table.passive.top-title.description'
          />
        }
        icon={<IconRewardsCircle color={SemanticColors.primary} size='medium' />}
        title={
          <FormattedMessage
            defaultMessage='Passive Rewards'
            id='modals.earn-compare.table.passive.top-title.title'
          />
        }
      />
    ),
    stakingInfo: (
      <TableTopTitle
        description={
          <FormattedMessage
            defaultMessage='Earn rewards by securing networks'
            id='modals.earn-compare.table.staking.top-title.description'
          />
        }
        icon={<IconLockClosed color={SemanticColors.primary} size='medium' />}
        title={
          <FormattedMessage
            defaultMessage='Staking Rewards'
            id='modals.earn-compare.table.staking.top-title.title'
          />
        }
      />
    )
  },
  // row1 For
  {
    activeInfo: (
      <FormattedMessage
        defaultMessage='Advanced users'
        id='modals.earn-compare.table.active.row1.info'
      />
    ),
    hasBorder: true,
    key: 'modals.earn-compare.table.active.row1.info',
    passiveInfo: (
      <FormattedMessage
        defaultMessage='All eligible users'
        id='modals.earn-compare.table.passive.row1.info'
      />
    ),
    stakingInfo: (
      <FormattedMessage
        defaultMessage='Intermediate users'
        id='modals.earn-compare.table.staking.row1.info'
      />
    ),
    title: <FormattedMessage defaultMessage='For' id='copy.for' />
  },
  // row2 Assets
  {
    activeInfo: (
      <Flex alignItems='center' gap={8}>
        <Icon name='BTC' size='24px' /> Bitcoin
      </Flex>
    ),
    hasBorder: true,
    key: 'modals.earn-compare.table.active.row2.info',
    passiveInfo: <FormattedMessage defaultMessage='All' id='copy.all' />,
    stakingInfo: (
      <Flex alignItems='center' gap={8}>
        <Icon name='ETH' size='24px' /> Ethereum
      </Flex>
    ),
    title: <FormattedMessage defaultMessage='Assets' id='copy.assets' />
  },
  // row3 Use case
  {
    activeInfo: (
      <FormattedMessage
        defaultMessage='You want to hold an asset and don’t think it will appreciate significantly in the next week'
        id='modals.earn-compare.table.active.row3.info'
      />
    ),
    hasBorder: true,
    key: 'modals.earn-compare.table.active.row3.info',
    passiveInfo: (
      <FormattedMessage
        defaultMessage='You want to hold an asset for a longer period of time'
        id='modals.earn-compare.table.passive.row3.info'
      />
    ),
    stakingInfo: (
      <FormattedMessage
        defaultMessage='You want to hold an asset and secure the network'
        id='modals.earn-compare.table.staking.row3.info'
      />
    ),
    title: <FormattedMessage defaultMessage='Use case' id='modals.earn-compare.table.row3.title' />
  },
  // row4 Rate
  {
    activeInfo: (
      <FormattedMessage
        defaultMessage='Up to {maxActiveRate}% annually, variable weekly'
        id='modals.earn-compare.table.active.row4.info'
        values={{
          maxActiveRate
        }}
      />
    ),
    hasBorder: true,
    key: 'modals.earn-compare.table.active.row4.info',
    passiveInfo: (
      <FormattedMessage
        defaultMessage='Up to {maxPassiveRate}% annually, updated monthly'
        id='modals.earn-compare.table.passive.row4.info'
        values={{ maxPassiveRate }}
      />
    ),
    stakingInfo: (
      <FormattedMessage
        defaultMessage='Up to {maxStakingRate}% annually, variable by network'
        id='modals.earn-compare.table.staking.row4.info'
        values={{ maxStakingRate }}
      />
    ),
    title: <FormattedMessage defaultMessage='Rate' id='copy.rate' />
  },
  // row5 Earned
  {
    activeInfo: <FormattedMessage defaultMessage='Weekly' id='copy.weekly' />,
    hasBorder: true,
    key: 'modals.earn-compare.table.active.row5.info',
    passiveInfo: <FormattedMessage defaultMessage='Daily' id='copy.daily' />,
    stakingInfo: <FormattedMessage defaultMessage='Daily' id='copy.daily' />,
    title: <FormattedMessage defaultMessage='Earned' id='copy.earned' />
  },
  // row6 Paid
  {
    activeInfo: <FormattedMessage defaultMessage='Weekly' id='copy.weekly' />,
    hasBorder: true,
    key: 'modals.earn-compare.table.active.row6.info',
    passiveInfo: <FormattedMessage defaultMessage='Monthly' id='copy.monthly' />,
    stakingInfo: <FormattedMessage defaultMessage='Daily' id='copy.daily' />,
    title: <FormattedMessage defaultMessage='Paid' id='copy.paid' />
  },
  // row7 Withdraw
  {
    activeInfo: <FormattedMessage defaultMessage='Weekly' id='copy.weekly' />,
    hasBorder: true,
    key: 'modals.earn-compare.table.active.row7.info',
    passiveInfo: (
      <FormattedMessage
        defaultMessage='After 7 days'
        id='modals.earn-compare.table.passive.row7.info'
      />
    ),
    stakingInfo: (
      <FormattedMessage
        defaultMessage='Network dependent'
        id='modals.earn-compare.table.staking.row7.info'
      />
    ),
    title: <FormattedMessage defaultMessage='Withdraw' id='copy.withdraw' />
  },
  // row8 Learn more
  {
    activeInfo: (
      <LinkContainer to='/earn/active-rewards-learn'>
        <Button
          as='button'
          size='small'
          state='initial'
          text={<FormattedMessage defaultMessage='Learn More' id='buttons.learn_more' />}
          type='button'
          variant='minimal'
          width='auto'
        />
      </LinkContainer>
    ),
    key: 'modals.earn-compare.table.active.row8.info',
    passiveInfo: (
      <Link
        href='https://support.blockchain.com/hc/en-us/sections/4416668318740-Rewards'
        target='_blank'
        size='small'
        text={
          <Button
            as='button'
            size='small'
            state='initial'
            text={<FormattedMessage defaultMessage='Learn More' id='buttons.learn_more' />}
            type='button'
            variant='minimal'
            width='auto'
          />
        }
      />
    ),
    stakingInfo: (
      <Link
        href='https://support.blockchain.com/hc/en-us/sections/5954708914460-Staking'
        target='_blank'
        size='small'
        text={
          <Button
            as='button'
            size='small'
            state='initial'
            text={<FormattedMessage defaultMessage='Learn More' id='buttons.learn_more' />}
            type='button'
            variant='minimal'
            width='auto'
          />
        }
      />
    )
  }
]
