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

const About = (props: Props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.settings.general.about.title' defaultMessage='About' />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.settings.general.about.description'
            defaultMessage='Learn more about our company.'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Link
          onClick={() => {
            props.settingsActions.generalSettingsExternalRedirect('/about')
          }}
          href='https://www.blockchain.com/about'
          target='_blank'
        >
          <Button data-e2e='aboutLink' nature='empty-blue'>
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

export default connector(About)
