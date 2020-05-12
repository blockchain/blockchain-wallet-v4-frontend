import { FormattedMessage } from 'react-intl'
import {
  SettingContainer,
  SettingHeader,
  SettingSummary
} from 'components/Setting'
import { SpinningLoader } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

const CustomSettingContainer = styled(SettingContainer)`
  @media (min-width: 992px) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }
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
