import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Image, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'

import {
  NumberContainer,
  NumberDescription,
  NumberWrapper,
  RowNumber,
  SubTitle
} from '../template.rejected.styles'
import { Props } from '.'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`
const Title = styled(Text)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 20px 0 8px;
`
const ContentContainer = styled(FlyoutWrapper)`
  border-top: 1px solid ${props => props.theme.grey000};
`
const DisplayTitle = styled(Text)`
  font-weight: 600;
  font-size: 15px;
  display: flex;
  color: ${props => props.theme.textBlack};
  width: 100%;
`
const IconsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`
const Template: React.FC<Props> = props => {
  return (
    <Wrapper>
      <FlyoutWrapper>
        <IconsContainer>
          <Image name='tier-gold' size='32px' />
          <Icon
            cursor
            data-e2e='sbCloseModalIcon'
            name='close'
            size='20px'
            color='grey600'
            role='button'
            onClick={props.handleClose}
          />
        </IconsContainer>
        <Title color='grey800' size='24px' weight={600}>
          <div>
            <FormattedMessage
              id='modals.simplebuy.goldupgrade.title1'
              defaultMessage='Upgrade Your Profile.'
            />
          </div>
          <div>
            <FormattedMessage
              id='modals.simplebuy.goldupgrade.title2'
              defaultMessage='Buy & Sell More Crypto.'
            />
          </div>
        </Title>
        <Text color='grey600' weight={500}>
          <FormattedMessage
            id='modals.simplebuy.goldupgrade.subtitle'
            defaultMessage='Verify your identity to increase how much you can Buy, Sell and Swap each week.'
          />
        </Text>
      </FlyoutWrapper>

      <ContentContainer>
        <Text color='grey600' weight={500}>
          <RowNumber>
            <NumberWrapper>
              <NumberContainer>1</NumberContainer>
            </NumberWrapper>
            <NumberDescription>
              <DisplayTitle>
                <FormattedMessage
                  id='modals.confirm.title.verify_identity'
                  defaultMessage='Verify Your Identity'
                />
              </DisplayTitle>
              <SubTitle>
                <FormattedMessage
                  id='modals.simplebuy.kycrequired.verify_identity_description'
                  defaultMessage='To prevent identity theft or fraud, we’ll need a make sure it’s really you by uploading an ID.'
                />
              </SubTitle>
            </NumberDescription>
          </RowNumber>
          <RowNumber>
            <NumberWrapper>
              <NumberContainer>2</NumberContainer>
            </NumberWrapper>
            <NumberDescription>
              <DisplayTitle>
                <FormattedMessage
                  id='modals.simplebuy.goldupgrade.step2.title'
                  defaultMessage='Get Approved'
                />
              </DisplayTitle>
              <SubTitle>
                <FormattedMessage
                  id='modals.simplebuy.goldupgrade.step2.desc'
                  defaultMessage='Most applications are approved within minutes but some may take a few days to be reviewed.'
                />
              </SubTitle>
            </NumberDescription>
          </RowNumber>
          <RowNumber>
            <NumberWrapper>
              <NumberContainer>3</NumberContainer>
            </NumberWrapper>
            <NumberDescription>
              <DisplayTitle>
                <FormattedMessage
                  id='modals.simplebuy.goldupgrade.step3.title'
                  defaultMessage='Buy More Crypto'
                />
              </DisplayTitle>
              <SubTitle>
                <FormattedMessage
                  id='modals.simplebuy.goldupgrade.step3.desc'
                  defaultMessage='Buy, Sell, Swap crypto instantly and never miss another big day in the market.'
                />
              </SubTitle>
            </NumberDescription>
          </RowNumber>
        </Text>

        <Button
          fullwidth
          size='16px'
          height='48px'
          nature='primary'
          data-e2e='upgradeNowBtn'
          onClick={() => {
            props.analyticsActions.logEvent([
              'UPGRADE_TO_GOLD',
              'upgrade_now_clicked'
            ])
            props.verifyIdentity()
          }}
          style={{ marginTop: '16px' }}
          type='button'
        >
          <FormattedMessage
            id='scenes.airdrops.success.upgradenow'
            defaultMessage='Upgrade Now'
          />
        </Button>
        <Button
          fullwidth
          size='16px'
          height='48px'
          nature='empty-blue'
          data-e2e='doLaterBtn'
          onClick={() => {
            props.analyticsActions.logEvent([
              'UPGRADE_TO_GOLD',
              'Ill_do_it_later_clicked'
            ])
            props.handleClose()
          }}
          style={{ marginTop: '8px' }}
          type='button'
        >
          <FormattedMessage
            id='modals.confirm.cancel.verify_identity'
            defaultMessage="I'll Do This Later"
          />
        </Button>
      </ContentContainer>
    </Wrapper>
  )
}

export default Template
