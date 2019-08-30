import React from 'react'
import styled from 'styled-components'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import { actions } from 'data'
import { Button, Link, Icon, Text, TextGroup } from 'blockchain-info-components'
import media from 'services/ResponsiveService'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100px;
  justify-content: space-between;
  ${media.tablet`
    flex-direction: column;
    height: 135px;
    align-items: center;
  `};
`
const LeftColumn = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  margin: 0 35px 0 25px;
  ${media.tablet`
    justify-content: center;
    margin: 10px 0 0;
    padding-left: 10px;
  `};
`
const RightColumn = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-right: 25px;
`
const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 18px;

  & > :last-child {
    margin-top: 5px;
  }
`
const IconContainer = styled.div`
  height: 55px;
  width: 55px;
  min-width: 55px;
  background: ${props => props.theme['blue100']};
  border-radius: 50%;
`
const DownloadIcon = styled(Icon)`
  margin-left: 12px;
  margin-top: 10px;
`
class UpdateRequiredNotice extends React.PureComponent {
  launchLockboxSetup = () => {
    this.props.modalActions.showModal('LockboxSetup')
  }

  render () {
    return (
      <Wrapper>
        <LeftColumn>
          <IconContainer>
            <DownloadIcon name='request' color='brand-secondary' size='30px' />
          </IconContainer>
          <HeaderText>
            <Text size='18px' weight={700}>
              <FormattedMessage
                id='scenes.lockbox.dashboard.updaterequirednotice.title'
                defaultMessage='Software Update Required'
              />
            </Text>
            <TextGroup inline>
              <Text size='14px'>
                <FormattedMessage
                  id='scenes.lockbox.dashboard.updaterequirednotice.subtitle'
                  defaultMessage='In order to continue using your Lockbox, you must first update your device and reinstall the apps via the following updating software.'
                />
              </Text>
              {/* TODO: update link */}
              <Link
                href='https://blockchain.zendesk.com/hc/en-us/sections/360002593291-Setting-Up-Lockbox'
                size='14px'
                rel='noopener noreferrer'
                target='_blank'
              >
                <FormattedMessage
                  id='scenes.lockbox.dashboard.updaterequirednotice.learn'
                  defaultMessage='Learn more'
                />
              </Link>
            </TextGroup>
          </HeaderText>
        </LeftColumn>
        <RightColumn>
          <Button nature='primary' onClick={() => {}}>
            <FormattedMessage
              id='scenes.lockbox.dashboard.updaterequirednotice.download'
              defaultMessage='Download Software'
            />
          </Button>
        </RightColumn>
      </Wrapper>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(UpdateRequiredNotice)
