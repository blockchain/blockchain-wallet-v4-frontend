import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { Icon, Text } from '@blockchain-com/constellation'
import { IconArrowLeft } from '@blockchain-com/icons'
import { bindActionCreators } from 'redux'

import CircleBackground from 'components/CircleBackground'
import { Wrapper } from 'components/Public'
import { actions } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import { UpgradeSteps } from 'data/auth/types'

import {
  BackArrow,
  ButtonNext,
  CenteredTitle,
  Item,
  Items,
  StyledTemporaryButton,
  SubHeaderWrapper,
  TierDescription,
  TierTitle
} from '../AccountUpgrade.models'

const UpgradeOverview = (props) => {
  const handleNext = () => props.formActions.change(LOGIN_FORM, 'step', UpgradeSteps.CREATE_WALLET)

  const handlePrev = () =>
    props.formActions.change(LOGIN_FORM, 'step', UpgradeSteps.UPGRADE_OR_SKIP)

  return (
    <>
      <Wrapper>
        <SubHeaderWrapper>
          <BackArrow onClick={() => null}>
            {!props.hideBackArrow && (
              <Icon data-e2e='upgradeBack' label='back' size='md' color='blue600'>
                <IconArrowLeft />
              </Icon>
            )}
            <Text color='grey900' variant='paragraph-1'>
              <FormattedMessage id='copy.back' defaultMessage='Back' />
            </Text>
          </BackArrow>
          <Text color='blue600' variant='micro'>
            <FormattedMessage
              id='scenes.login.upgrade.next_steps.upgrading_accounts'
              defaultMessage='Upgrading accounts'
            />
          </Text>
        </SubHeaderWrapper>
        <CenteredTitle color='black' variant='title-3'>
          <FormattedMessage
            id='scenes.login.upgrade.next_steps.header'
            defaultMessage='What´s Next'
          />
        </CenteredTitle>
        <Items>
          <Item>
            <CircleBackground size='24px'>
              <Text variant='body-2' color='blue600'>
                1
              </Text>
            </CircleBackground>
            <TierDescription>
              <TierTitle color='grey900' variant='body-2'>
                <FormattedMessage
                  id='scenes.login.upgrade.next_steps.item_1.title'
                  defaultMessage='Create a New Password'
                />
              </TierTitle>

              <Text color='grey600' variant='paragraph-1'>
                <FormattedMessage
                  id='scenes.login.upgrade.next_steps.item_1.text'
                  defaultMessage='This new password will allow you to log into your Wallet and Exchange accounts with the same email and password.'
                />
              </Text>
            </TierDescription>
          </Item>
          <Item>
            <CircleBackground size='24px'>
              <Text variant='body-2' color='blue600'>
                2
              </Text>
            </CircleBackground>
            <TierDescription>
              <TierTitle color='grey900' variant='body-2'>
                <FormattedMessage
                  id='scenes.login.upgrade.next_steps.item_2.title'
                  defaultMessage='Create a New 2FA'
                />
              </TierTitle>

              <Text color='grey600' variant='paragraph-1'>
                <FormattedMessage
                  id='scenes.login.upgrade.next_steps.item_2.text'
                  defaultMessage='This new 2FA method will replace your old Exchange 2FA. You will use this for 2FA on the Wallet and Exchange.'
                />
              </Text>
            </TierDescription>
          </Item>
          <Item>
            <CircleBackground size='24px'>
              <Text variant='body-2' color='blue600'>
                3
              </Text>
            </CircleBackground>
            <TierDescription>
              <TierTitle color='grey900' variant='body-2'>
                <FormattedMessage
                  id='scenes.login.upgrade.next_steps.item_3.title'
                  defaultMessage='You’re All Set!'
                />
              </TierTitle>

              <Text color='grey600' variant='paragraph-1'>
                <FormattedMessage
                  id='scenes.login.upgrade.next_steps.item_3.text'
                  defaultMessage='You’ll get a confirmation email. Use your email, new password, and new 2FA to log in to the Wallet or Exchange.'
                />
              </Text>
            </TierDescription>
          </Item>
        </Items>

        <ButtonNext
          nature='primary'
          data-e2e='nextButton'
          fullwidth
          height='48px'
          onClick={handleNext}
        >
          <FormattedMessage id='buttons.next' defaultMessage='Next' />
        </ButtonNext>
      </Wrapper>
      <StyledTemporaryButton onClick={handlePrev} type='button'>
        Prev Step
      </StyledTemporaryButton>
      <StyledTemporaryButton onClick={handleNext} type='button'>
        Next Step
      </StyledTemporaryButton>
    </>
  )
}

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connect(null, mapDispatchToProps)(UpgradeOverview)
