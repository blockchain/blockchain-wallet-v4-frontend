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

import { LeftContainer, RightContainer, TabRow, TextContainer } from './Filter.model'
import { EarnFilterPropsType } from './Filter.types'

const EarnFilter = ({
  earnTab,
  handleAssetClick,
  handleHistoryClick,
  handleSearch,
  handleTabClick,
  showAvailableAssets
}: EarnFilterPropsType) => (
  <TabRow>
    <LeftContainer>
      <Tabs
        defaultActiveTab={earnTab}
        onTabChange={handleTabClick}
        size='large'
        tabs={[
          {
            key: 'All',
            titleContent: (
              <TextContainer>
                <FormattedMessage
                  id='scenes.earn.filter.all-rewards'
                  defaultMessage='All Rewards'
                />
              </TextContainer>
            )
          },
          {
            key: 'Passive',
            titleContent: (
              <TextContainer>
                <FormattedMessage id='copy.Passive' defaultMessage='Passive' />
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
          },
          {
            key: 'Active',
            titleContent: (
              <TextContainer>
                <FormattedMessage id='copy.active' defaultMessage='Active' />
              </TextContainer>
            )
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
    </LeftContainer>
    <RightContainer>
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
    </RightContainer>
  </TabRow>
)

export default EarnFilter
