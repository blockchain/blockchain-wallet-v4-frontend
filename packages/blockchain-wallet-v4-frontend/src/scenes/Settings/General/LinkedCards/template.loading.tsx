import React from 'react'
import { FormattedMessage } from 'react-intl'
import { SpinningLoader } from 'blockchain-info-components'
import styled from 'styled-components'

import {
  SettingContainer,
  SettingHeader,
  SettingSummary
} from 'components/Setting'
import { media } from 'services/styles'

const CustomSettingContainer = styled(SettingContainer)`
  ${media.atLeastTabletL`
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  `}
`
const CustomSettingHeader = styled(SettingHeader)`
  margin-bottom: 18px;
`

const Loading: React.FC = () => {
  return (
    <CustomSettingContainer>
      <SettingSummary>
        <CustomSettingHeader>
          <FormattedMessage
            id='scenes.settings.linked_cards'
            defaultMessage='Linked Cards'
          />
        </CustomSettingHeader>
        <SpinningLoader height='30px' width='30px' />
      </SettingSummary>
    </CustomSettingContainer>
  )
}

export default Loading
