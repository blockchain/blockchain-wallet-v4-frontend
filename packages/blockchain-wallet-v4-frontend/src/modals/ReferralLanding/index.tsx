import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon, Padding } from '@blockchain-com/constellation'
import { IconCloseCircleV2 } from '@blockchain-com/icons'
import styled from 'styled-components'

import { Button, Image, Text } from 'blockchain-info-components'
import Flyout, { duration, FlyoutChild, FlyoutWrapper } from 'components/Flyout'
import { FlyoutContent, FlyoutFooter } from 'components/Flyout/Layout'
import { ModalName } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../types'

const HeaderWrapper = styled(FlyoutWrapper)`
  flex-direction: row;
  justify-content: flex-end;
  display: flex;
  max-width: 480px;
  background-color: ${(props) => props.theme.white};
`

const CloseIconContainer = styled.div`
  cursor: pointer;
`

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 18px;
`

const Title = styled(Text)`
  display: flex;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
`

const DescriptionWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
`

const Description = styled(Text)`
  display: flex;
  text-align: center;
  margin-bottom: 7px;
  font-size: 16px;
  font-weight: 500;
  max-width: 345px;
`

class ReferralLanding extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { show: false }
  }

  componentDidMount() {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  render() {
    return (
      <Flyout {...this.props} isOpen={this.state.show} onClose={this.handleClose}>
        <FlyoutChild>
          <HeaderWrapper>
            <CloseIconContainer onClick={() => this.props.close()}>
              <Icon label='close' color='grey600' data-e2e='sendNoFundsCloseModalIcon' size='md'>
                <IconCloseCircleV2 />
              </Icon>
            </CloseIconContainer>
          </HeaderWrapper>

          <FlyoutContent mode='top'>
            <ImageWrapper>
              <Image name='cowboys' size='122px' />
            </ImageWrapper>
            <Padding top={45} left={40} right={40} bottom={8}>
              <Title color='textBlack'>
                <FormattedMessage
                  id='modals.referralLanding.title'
                  defaultMessage='Refer 3+ friends and you could win Blockchain.com suite tickets'
                />
              </Title>
            </Padding>
            <DescriptionWrapper>
              <Padding top={0} left={40} right={40} bottom={8}>
                <Description>
                  <FormattedMessage
                    id='modals.referralLanding.description'
                    defaultMessage="Verify your ID, refer 3+ friends and you'll be entered for a chance to win 8 tickets to the Blockchain.com suite at AT&T Stadium for the December 11th game against the Houston Texans."
                  />
                </Description>
              </Padding>
            </DescriptionWrapper>
          </FlyoutContent>

          <FlyoutFooter collapsed>
            <Button
              data-e2e='sendNoFundsReceiveCrypto'
              nature='primary'
              onClick={() => {
                // do nothing atm
              }}
              fullwidth
            >
              <FormattedMessage id='buttons.share' defaultMessage='Share' />
            </Button>
          </FlyoutFooter>
        </FlyoutChild>
      </Flyout>
    )
  }
}

const enhance = ModalEnhancer(ModalName.REFERRAL_LANDING_MODAL, { transition: duration })

export type Props = ModalPropsType
type State = { show: boolean }

export default enhance(ReferralLanding)
