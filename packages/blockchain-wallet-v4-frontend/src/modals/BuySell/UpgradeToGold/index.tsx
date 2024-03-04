import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'

import { Button, Icon, Image, Text } from 'blockchain-info-components'
import { FlyoutContainer } from 'components/Flyout/Layout'
import { identityVerification } from 'data/components/actions'

import { Title } from '../../components'
import {
  CloseIconContainer,
  Disclaimer,
  HeaderWrapper,
  IconsContainerRight,
  RowItemSubTitle,
  RowItemSubTitleWhite,
  RowItemTitleWhite,
  RowItemWrapper,
  StatusCartridgeBlue,
  UpgradeContainer,
  UpgradeRowWithBlueBorder
} from './styles'

const UpgradeToGold = ({ handleClose }: { handleClose: () => void }) => {
  const dispatch = useDispatch()

  const verifyIdentity = () => {
    dispatch(identityVerification.resetVerificationStep({}))
    dispatch(
      identityVerification.verifyIdentity({
        needMoreInfo: false,
        origin: 'BuySell',
        tier: 2
      })
    )
  }
  return (
    <FlyoutContainer>
      <HeaderWrapper>
        <IconsContainerRight>
          <Image width='32px' name='blue-verified' />
          <CloseIconContainer>
            <Icon
              cursor
              data-e2e='tradingLimitsCloseButton'
              name='close'
              size='20px'
              color='grey600'
              role='button'
              onClick={handleClose}
            />
          </CloseIconContainer>
        </IconsContainerRight>
        <Title color='textBlack' size='24px' weight={600} style={{ marginTop: '10px' }}>
          <FormattedMessage
            id='modals.onboarding.upgrade_now.title'
            defaultMessage='Upgrade Your Account.'
          />
        </Title>
        <Title color='textBlack' size='24px' weight={600}>
          <FormattedMessage
            id='modals.onboarding.upgrade_now.title_second'
            defaultMessage='Buy, Sell & Swap More Crypto.'
          />
        </Title>
        <Text
          color='grey600'
          size='16px'
          weight={500}
          style={{ fontStyle: 'normal', marginTop: '8px' }}
        >
          <FormattedMessage
            id='modals.onboarding.upgrade_now.description'
            defaultMessage='Verify your identity and unlock access to Buying, Selling, Swapping & Rewards Accounts.'
          />
        </Text>
      </HeaderWrapper>

      <div>
        <UpgradeContainer second>
          <UpgradeRowWithBlueBorder>
            <Image name='white-verified' size='20px' />
            <RowItemTitleWhite>
              <FormattedMessage
                id='modals.onboarding.upgrade_now.full_access'
                defaultMessage='Full Access'
              />
            </RowItemTitleWhite>
            <StatusCartridgeBlue>
              <Text color='white' size='12px' weight={500}>
                <FormattedMessage
                  id='modals.onboarding.upgrade_now.apply_now'
                  defaultMessage='Apply Now'
                />
              </Text>
            </StatusCartridgeBlue>
          </UpgradeRowWithBlueBorder>

          <UpgradeRowWithBlueBorder>
            <Image name='swap-white' size='20px' />
            <RowItemWrapper>
              <RowItemTitleWhite>
                <FormattedMessage
                  id='modals.tradinglimits.swap_crypto'
                  defaultMessage='Swap Crypto'
                />
              </RowItemTitleWhite>
              <RowItemSubTitleWhite>
                <FormattedMessage
                  id='modals.onboarding.upgrade_now.between_all_wallets_and_accounts'
                  defaultMessage='Between All Wallets & Accounts'
                />
              </RowItemSubTitleWhite>
            </RowItemWrapper>
            <Image name='check-empty-white' size='20px' />
          </UpgradeRowWithBlueBorder>

          <UpgradeRowWithBlueBorder>
            <Image name='buy-white-circle' size='20px' />
            <RowItemWrapper>
              <RowItemTitleWhite>
                <FormattedMessage
                  id='modals.onboarding.upgrade_now.buying_and_selling'
                  defaultMessage='Buying & Selling'
                />
              </RowItemTitleWhite>
              <RowItemSubTitleWhite>
                <FormattedMessage
                  id='modals.onboarding.upgrade_now.card_or_banking_methods'
                  defaultMessage='Card or Banking Methods'
                />
              </RowItemSubTitleWhite>
            </RowItemWrapper>
            <Image name='check-empty-white' size='20px' />
          </UpgradeRowWithBlueBorder>

          <UpgradeRowWithBlueBorder>
            <Image name='percent-white-circle' size='20px' />
            <RowItemWrapper>
              <RowItemTitleWhite>
                <FormattedMessage
                  id='modals.tradinglimits.earn_interest'
                  defaultMessage='Earn Rewards'
                />
              </RowItemTitleWhite>
              <RowItemSubTitleWhite>
                <FormattedMessage
                  id='modals.onboarding.upgrade_now.earn_rewards_on_your_crypto'
                  defaultMessage='Earn Rewards On Your Crypto'
                />
              </RowItemSubTitleWhite>
            </RowItemWrapper>
            <Image name='check-empty-white' size='20px' />
          </UpgradeRowWithBlueBorder>

          <div style={{ padding: '25px' }}>
            <Button
              fullwidth
              size='16px'
              height='48px'
              nature='empty-secondary'
              data-e2e='upgradeNowUnlockSilverLimits'
              type='button'
              onClick={verifyIdentity}
            >
              <FormattedMessage
                id='modals.onboarding.upgrade_now.upgrade_and_unlock'
                defaultMessage='Upgrade & Unlock'
              />
            </Button>
          </div>
        </UpgradeContainer>

        <Disclaimer>
          <RowItemSubTitle>
            <FormattedMessage
              id='modals.onboarding.upgrade_now.disclaimer_full_access'
              defaultMessage='Full Access includes all limited access features'
            />
          </RowItemSubTitle>
        </Disclaimer>
      </div>
    </FlyoutContainer>
  )
}

export default UpgradeToGold
