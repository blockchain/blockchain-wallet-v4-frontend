import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex } from '@blockchain-com/constellation'

import { Icon, Text, TooltipHost } from 'blockchain-info-components'
import { SceneHeader, SceneHeaderText } from 'components/Layout'

import { SceneSubHeaderTextCustom } from './Earn.model'

const EarnHeader = () => {
  return (
    <>
      <SceneHeader>
        <SceneHeaderText>
          <FormattedMessage id='copy.earn' defaultMessage='Earn' />
        </SceneHeaderText>
      </SceneHeader>
      <SceneSubHeaderTextCustom>
        <Flex justifyContent='space-between' alignItems='center' gap={8}>
          <FormattedMessage
            defaultMessage='Get rewards on your crypto.'
            id='scenes.earn.subheader'
          />
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
        </Flex>
      </SceneSubHeaderTextCustom>
    </>
  )
}

export default EarnHeader
