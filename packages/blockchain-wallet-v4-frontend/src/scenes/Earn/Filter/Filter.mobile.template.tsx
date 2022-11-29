import React, { ChangeEvent } from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import {
  Button,
  Checkbox,
  IconSearch,
  Input,
  SemanticColors,
  Tabs
} from '@blockchain-com/constellation'

import { Column, TabRow, TextContainer } from './Filter.model'
import { EarnFilterPropsType } from './Filter.types'

const MobileFilter = ({
  earnTab,
  handleAssetClick,
  handleHistoryClick,
  handleSearch,
  handleTabClick,
  showAvailableAssets
}: EarnFilterPropsType) => (
  <TabRow>
    <Column>
      <Tabs
        defaultActiveTab={earnTab}
        onTabChange={handleTabClick}
        size='large'
        tabs={[
          {
            key: 'All',
            titleContent: (
              <TextContainer>
                <FormattedMessage id='copy.all' defaultMessage='All' />
              </TextContainer>
            )
          },
          {
            key: 'Rewards',
            titleContent: (
              <TextContainer>
                <FormattedMessage id='copy.rewards' defaultMessage='Rewards' />
              </TextContainer>
            )
          },
          {
            key: 'Staking',
            titleContent: (
              <TextContainer>
                <FormattedMessage id='copy.staking' defaultMessage='Staking' />
              </TextContainer>
            )
          }
        ]}
        variant='default'
      />
    </Column>
    <Column>
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
    </Column>
    <Column>
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
      <Checkbox
        checked={showAvailableAssets}
        id='availableAssets'
        label={
          <FormattedMessage id='scenes.earn.filter.assets' defaultMessage='My available assets' />
        }
        onCheckedChange={handleAssetClick}
      />
    </Column>
  </TabRow>
)

export default MobileFilter
