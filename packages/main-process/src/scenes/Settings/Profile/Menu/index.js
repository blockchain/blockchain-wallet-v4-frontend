import React from 'react'
import { FormattedHTMLMessage } from 'react-intl'
import { all, propEq } from 'ramda'
import { connect } from 'react-redux'

import { getData } from './selectors'

import { Image, TabMenu, Text } from 'blockchain-info-components'
import HorizontalMenu from 'components/HorizontalMenu'

export const Menu = ({ userTiers }) => {
  const isRejected = all(propEq('state', 'rejected'), userTiers)
  return !isRejected ? null : (
    <HorizontalMenu>
      <TabMenu>
        <Image
          style={{ marginRight: '10px' }}
          name='failed-kyc'
          srcset={{
            'failed-kyc2': '2x',
            'failed-kyc3': '3x'
          }}
        />
        <Text weight={400}>
          <FormattedHTMLMessage
            id='scenes.settings.profile.menu.failedkyc'
            defaultMessage="We had trouble verifying your identity. Your Swap feature has been disabled at this time. <a href='https://support.blockchain.com/hc/en-us/articles/360018080352-Why-has-my-ID-submission-been-rejected-' target='_blank' rel='noopener noreferrer'>Learn more</a>"
          />
        </Text>
      </TabMenu>
    </HorizontalMenu>
  )
}

export default connect(getData)(Menu)
