import React from 'react'
import styled from 'styled-components'
import { FormattedHTMLMessage } from 'react-intl'
import { all, propEq } from 'ramda'
import { connect } from 'react-redux'

import { getData } from './selectors'

import { Image, TabMenu, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 12px 30px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white-blue']};
  border-bottom: 1px solid ${props => props.theme['gray-1']};
  a {
    color: ${props => props.theme['brand-secondary']};
    text-decoration: none;
  }
`

export const Menu = ({ userTiers }) => {
  const isRejected = all(propEq('state', 'rejected'), userTiers)
  return !isRejected ? null : (
    <Wrapper>
      <TabMenu>
        <Image
          style={{ marginRight: '10px' }}
          name='failed-kyc'
          srcset={{
            'failed-kyc2': '2x',
            'failed-kyc3': '3x'
          }}
        />
        <Text weight={300}>
          <FormattedHTMLMessage
            id='scenes.settings.profile.menu.failedkyc'
            defaultMessage="We had trouble verifying your identity. Your Swap feature has been disabled at this time. <a href='https://support.blockchain.com/hc/en-us/articles/360018080352-Why-has-my-ID-submission-been-rejected-' target='_blank' rel='noopener noreferrer'>Learn more</a>"
          />
        </Text>
      </TabMenu>
    </Wrapper>
  )
}

export default connect(getData)(Menu)
