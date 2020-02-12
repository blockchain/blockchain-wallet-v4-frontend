import { all, propEq } from 'ramda'
import { connect } from 'react-redux'
import { FormattedHTMLMessage } from 'react-intl'
import { getData } from './selectors'
import { Image, TabMenu, Text } from 'blockchain-info-components'
import { StickyHeader } from 'components/Layout'
import React from 'react'

export const Menu = ({ userTiers }) => {
  const isRejected = all(propEq('state', 'rejected'), userTiers)
  return !isRejected ? null : (
    <StickyHeader>
      <TabMenu>
        <Image
          style={{ marginRight: '10px' }}
          name='failed-kyc'
          srcset={{
            'failed-kyc2': '2x',
            'failed-kyc3': '3x'
          }}
        />
        <Text weight={500}>
          <FormattedHTMLMessage
            id='scenes.settings.profile.menu.failedkyc'
            defaultMessage="We had trouble verifying your identity. Your Swap feature has been disabled at this time. <a href='https://support.blockchain.com/hc/en-us/articles/360018080352-Why-has-my-ID-submission-been-rejected-' target='_blank' rel='noopener noreferrer'>Learn more</a>"
          />
        </Text>
      </TabMenu>
    </StickyHeader>
  )
}

export default connect(getData)(Menu)
