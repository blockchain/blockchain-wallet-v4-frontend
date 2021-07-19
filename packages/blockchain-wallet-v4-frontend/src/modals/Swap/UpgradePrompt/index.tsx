import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Button, Icon, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'

import { Props as BaseProps } from '..'
import { FlexStartRow, IconBackground } from '../components'

const UpgradePrompt: React.FC<Props> = (props) => {
  return (
    <>
      <FlyoutWrapper>
        <Icon
          role='button'
          name='arrow-back'
          data-e2e='backToEnterAmount'
          cursor
          size='24px'
          color='grey600'
          onClick={() =>
            props.swapActions.setStep({
              step: 'ENTER_AMOUNT'
            })
          }
          style={{ marginBottom: '28px', padding: '0' }}
        />

        <Text size='20px' color='grey800' weight={600} style={{ marginBottom: '8px' }}>
          <FormattedMessage
            id='copy.swap_upgrade_upload'
            defaultMessage='Upload Your ID. Swap More Crypto Everyday.'
          />
        </Text>
        <Text size='14px' color='grey600' weight={500} style={{ marginBottom: '30px' }}>
          <FormattedMessage
            id='copy.swap_verify_id'
            defaultMessage='Verify your identity to increase how much you can Swap everyday.'
          />
        </Text>
        <FlexStartRow style={{ marginBottom: '28px' }}>
          <IconBackground size='32px' style={{ marginRight: '16px' }}>
            <Text color='blue600' size='20px' weight={600}>
              1
            </Text>
          </IconBackground>
          <div>
            <Text color='grey900' size='14px' weight={600} lineHeight='150%'>
              <FormattedMessage
                id='copy.swap_upgrade_select'
                defaultMessage='Select Your Country'
              />
            </Text>
            <Text size='12px' lineHeight='150%' weight={500}>
              <FormattedMessage
                id='copy.swap_upgrade_current_country'
                defaultMessage='Blockchain.com needs to know your current country in accordance with local laws.'
              />
            </Text>
          </div>
        </FlexStartRow>
        <FlexStartRow style={{ marginBottom: '28px' }}>
          <IconBackground size='32px' style={{ marginRight: '16px' }}>
            <Text color='blue600' size='20px' weight={600}>
              2
            </Text>
          </IconBackground>
          <div>
            <Text color='grey900' size='14px' weight={600} lineHeight='150%'>
              <FormattedMessage
                id='modals.confirm.title.verify_identity'
                defaultMessage='Verify Your Identity'
              />
            </Text>
            <Text size='12px' lineHeight='150%' weight={500}>
              <FormattedMessage
                id='copy.swap_upgrade_really_you'
                defaultMessage="We need to make sure it's really you to prevent fraud by uploading an ID."
              />
            </Text>
          </div>
        </FlexStartRow>
        <FlexStartRow style={{ marginBottom: '62px' }}>
          <IconBackground size='32px' style={{ marginRight: '16px' }}>
            <Text color='blue600' size='20px' weight={600}>
              3
            </Text>
          </IconBackground>
          <div>
            <Text color='grey900' size='14px' weight={600} lineHeight='150%'>
              <FormattedMessage id='copy.swap_start' defaultMessage='Start Swapping' />
            </Text>
            <Text size='12px' lineHeight='150%' weight={500}>
              <FormattedMessage
                id='copy.swap_upgrade_once_verified'
                defaultMessage='Once verified, come back to Swap and exchange your crypto.'
              />
            </Text>
          </div>
        </FlexStartRow>
        <Button
          nature='primary'
          data-e2e='swapVerify'
          height='48px'
          onClick={() =>
            props.idvActions.verifyIdentity({
              needMoreInfo: false,
              origin: 'Swap',
              tier: 2
            })
          }
          fullwidth
        >
          <FormattedMessage id='buttons.verify_id_now' defaultMessage='Verify My ID Now' />
        </Button>
      </FlyoutWrapper>
    </>
  )
}

type OwnProps = BaseProps & { handleClose: () => void }

export type Props = OwnProps

export default UpgradePrompt
