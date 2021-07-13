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

const TermsOfService = (props: Props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.settings.general.termsofservice.title'
            defaultMessage='Terms of Service'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.settings.general.termsofservice.description'
            defaultMessage='Read our terms and services agreement.'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Link
          onClick={() => {
            props.settingsActions.generalSettingsExternalRedirect('/legal/terms')
          }}
          href='https://www.blockchain.com/legal/terms'
          target='_blank'
        >
          <Button data-e2e='termsLink' nature='empty-blue'>
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

export default connector(TermsOfService)
