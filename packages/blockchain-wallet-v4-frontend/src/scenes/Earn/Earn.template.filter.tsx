import React, { ChangeEvent } from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import {
  Button,
  Checkbox,
  Flex,
  IconSearch,
  Input,
  SemanticColors,
  Tabs
} from '@blockchain-com/constellation'
import styled from 'styled-components'

import { EarnFilterPropsType } from './Earn.types'

const TabRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`

const EarnFilter = ({
  earnTab,
  handleAssetClick,
  handleHistoryClick,
  handleSearch,
  handleTabClick,
  showAvailableAssets
}: EarnFilterPropsType) => {
  return (
    <TabRow>
      <Flex gap={16}>
        <Tabs
          defaultActiveTab={earnTab}
          onTabChange={handleTabClick}
          size='large'
          tabs={[
            { key: 'All', titleContent: <FormattedMessage id='copy.all' defaultMessage='All' /> },
            {
              key: 'Rewards',
              titleContent: <FormattedMessage id='copy.rewards' defaultMessage='Rewards' />
            },
            {
              key: 'Staking',
              titleContent: <FormattedMessage id='copy.staking' defaultMessage='Staking' />
            }
          ]}
          variant='default'
        />
        <Checkbox
          checked={showAvailableAssets}
          id='availableAssets'
          label={
            <FormattedMessage id='scenes.earn.filter.assets' defaultMessage='My available assets' />
          }
          onCheckedChange={handleAssetClick}
        />
      </Flex>
      <Flex alignItems='center' justifyContent='flex-end' gap={8}>
        <Input
          id='primary'
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            e.persist()
            handleSearch(e)
          }}
          placeholder='Search'
          postfix={<IconSearch color={SemanticColors.muted} size='small' />}
          state='default'
          type='text'
        />
        <LinkContainer to='/earn/history'>
          <Button
            as='button'
            onClick={handleHistoryClick}
            size='default'
            state='initial'
            text={<FormattedMessage id='copy.activity' defaultMessage='Activity' />}
            type='button'
            variant='minimal'
            width='auto'
          />
        </LinkContainer>
      </Flex>
    </TabRow>
  )
}

export default EarnFilter
