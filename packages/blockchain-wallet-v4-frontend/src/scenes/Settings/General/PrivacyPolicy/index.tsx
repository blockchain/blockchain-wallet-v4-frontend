import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Button, Icon, Link } from 'blockchain-info-components'
import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'
import { actions } from 'data'

const PrivacyPolicy = (props: Props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.settings.general.privacypolicy.title'
            defaultMessage='Privacy Policy'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.settings.general.privacypolicy.description'
            defaultMessage='Read about the privacy and security of your personal information.'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Link
          onClick={() => {
            props.settingsActions.generalSettingsExternalRedirect('/legal/privacy')
          }}
          href='https://www.blockchain.com/legal/privacy'
          target='_blank'
        >
          <Button data-e2e='privacyLink' nature='empty-blue'>
            <Icon name='open-in-new-tab' size='20px' />
          </Button>
        </Link>
      </SettingComponent>
    </SettingContainer>
  )
}

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type Props = {} & ConnectedProps<typeof connector>

export default connector(PrivacyPolicy)
