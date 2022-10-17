import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex } from '@blockchain-com/constellation'

import { Icon, Text, TooltipHost } from 'blockchain-info-components'
import { SceneHeader, SceneHeaderText } from 'components/Layout'

import { CustomLink, SceneSubHeaderTextCustom, SubheaderSeparator } from './Earn.model'

const EarnHeader = () => {
  return (
    <>
      <SceneHeader>
        <SceneHeaderText>
          <FormattedMessage id='copy.earn' defaultMessage='Earn' />
        </SceneHeaderText>
      </SceneHeader>
      <SceneSubHeaderTextCustom>
        <Flex alignItems='center' gap={4}>
          <FormattedMessage
            defaultMessage='Get daily or monthly rewards on your crypto.'
            id='scenes.earn.subheader'
          />
          <CustomLink
            color='blue600'
            href='https://support.blockchain.com/hc/en-us/sections/5969256857244-Earn'
            size='16px'
            target='_blank'
            weight={500}
          >
            <FormattedMessage defaultMessage='Learn More' id='buttons.learn_more' />
          </CustomLink>
        </Flex>
        <SubheaderSeparator />
        <Flex alignItems='center' justifyContent='flex-end'>
          <TooltipHost id='scenes.interest.legaldisclaimer'>
            <Icon name='info' size='12px' color='grey400' />
            <Text size='12px' color='grey400' weight={500} style={{ margin: '-2px 0 0 5px' }}>
              <FormattedMessage
                id='scenes.interest.legaldiscalimer'
                defaultMessage='Legal disclaimer'
              />
            </Text>
          </TooltipHost>
        </Flex>
      </SceneSubHeaderTextCustom>
    </>
  )
}

export default EarnHeader
