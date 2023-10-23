import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import {
  Button,
  Flex,
  IconCloseCircle,
  Padding,
  SemanticColors
} from '@blockchain-com/constellation'

import { Image, Link, Text } from 'blockchain-info-components'
import { getData } from 'components/Banner/selectors'

import { CloseLink } from '../styles'
import { CardWrapper } from './ActiveRewardsBanner.model'
import { ActiveRewardsBannerTypes } from './ActiveRewardsBanner.types'

const ActiveRewardsBanner = ({ onClickClose, rate }: ActiveRewardsBannerTypes) => {
  const isUserFromUK = useSelector(getData)?.country === 'GB'

  return (
    <CardWrapper>
      <Padding horizontal={1} vertical={1.5}>
        <Flex flexDirection='row' alignItems='center' justifyContent='space-between' gap={16}>
          <Flex alignItems='center' gap={16}>
            <Image name='bars' height='36px' />
            <Flex flexDirection='column' gap={4}>
              <Text color='grey800' weight={600} size='20px'>
                <FormattedMessage
                  id='home.banners.activeRewardsBanner.title'
                  defaultMessage='Earn up to {rate}% on BTC with Active Rewards'
                  values={{ rate }}
                />
              </Text>

              <Text color='grey600' weight={500} size='12px'>
                <FormattedMessage
                  id='home.banners.activeRewardsBanner.body'
                  defaultMessage='Maximize your earnings by forecasting BTC’s price every week.'
                />
              </Text>
              {isUserFromUK && (
                <Text color='grey600' weight={500} size='12px' italic>
                  APYs are always indicative based on past performance and are not guaranteed. Find
                  out more about Staking and Rewards as well as the risks{' '}
                  <Link
                    size='12px'
                    href='https://support.blockchain.com/hc/en-us/articles/10857163796380-Staking-and-Rewards-what-are-the-risks'
                    target='_blank'
                    style={{ textDecoration: 'underline' }}
                  >
                    here
                  </Link>
                  .
                </Text>
              )}
            </Flex>
          </Flex>
          <Flex alignItems='center'>
            <NavLink style={{ textDecoration: 'none' }} to='/earn' data-e2e='vistEarnPage'>
              <Button
                as='button'
                size='default'
                state='initial'
                text={
                  <FormattedMessage
                    id='home.banners.activeRewardsBanner.button'
                    defaultMessage='Go to Earn'
                  />
                }
                type='button'
                variant='primary'
                width='auto'
              />
            </NavLink>

            <CloseLink data-e2e='newCoinCloseButton' onClick={onClickClose}>
              <IconCloseCircle color={SemanticColors.medium} size='medium' />
            </CloseLink>
          </Flex>
        </Flex>
      </Padding>
    </CardWrapper>
  )
}
export default ActiveRewardsBanner
