import React from 'react'
import styled from 'styled-components'
import { Icon, Image, Text, Button, Link } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl';
import { MediaContextConsumer } from 'providers/MatchMediaProvider'
import bowser from 'bowser'
import { prop, toLower, equals } from 'ramda'

const Container = styled.div`
  width: 100%;
  height: 75px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background: rgba(240, 240, 238, 1);
  box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, .35);
  position: fixed;
  z-index: 9999;
  top: 0;
`
const HideWrapper = styled.div`
  width: 2.5rem;
  display: flex;
  justify-content: center;
`
const LogoWrapper = styled.div`
  margin-right: 1rem;
`
const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
`
const LinkWrapper = styled.div`
  width: 9rem;
  display: flex;
  justify-content: center;
`
const ButtonText = styled(Text)`
  text-transform: uppercase;
`
const LinkButton = styled(Button)`
  min-width: 100px;
`

const isChrome = equals(toLower(prop('name', bowser)), 'chrome')

class MobileAppLink extends React.PureComponent {
  state = { show: true }

  onClose = () => this.setState({ show: false })

  handleOpen = () => {
    window.open('blockchain://', '_blank')
  }

  render () {
    const renderIfMobile = (mobile) =>
      !this.state.show || !mobile || !isChrome
        ? null
        : <Container>
          <HideWrapper>
            <Icon
              name='close'
              size='15px'
              weight={300}
              color='gray-5'
              cursor
              onClick={this.onClose}
            />
          </HideWrapper>
          <LogoWrapper>
            <Image name='blue-logo' height='60px' width='60px' />
          </LogoWrapper>
          <InfoWrapper>
            <Text size='12px' weight={400}>
              <FormattedMessage
                id='mobileapplink.title'
                defaultMessage='Blockchain'
              />
            </Text>
            <Text size='12px' weight={300}>
              <FormattedMessage
                id='mobileapplink.info'
                defaultMessage='Crypto on the go.'
              />
            </Text>
          </InfoWrapper>
          <LinkWrapper>
          <Link>
            <LinkButton nature='primary' onClick={this.handleOpen}>
              <ButtonText color='white' size='12px'>
                <FormattedMessage
                  id='mobileapplink.open'
                  defaultMessage='open in app'
                />
              </ButtonText>
            </LinkButton>
          </Link>
          </LinkWrapper>
        </Container>

    return (
      <MediaContextConsumer>
        {({ mobile }) => (
          renderIfMobile(mobile)
        )}
      </MediaContextConsumer>
    )
  }
}

export default MobileAppLink
