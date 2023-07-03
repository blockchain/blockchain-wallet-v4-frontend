import React, { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useDispatch } from 'react-redux'
import {
  Button,
  Flex,
  IconCloseCircleV2,
  PaletteColors,
  SemanticColors,
  Text
} from '@blockchain-com/constellation'
import { compose } from 'redux'

import { Button as ButtonLegacy, Image, Modal } from 'blockchain-info-components'
import { actions, model } from 'data'
import { ModalName } from 'data/modals/types'
import { Analytics } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { SLIPPAGE_PRESETS } from './constants'
import {
  ButtonSection,
  CloseIcon,
  CustomInput,
  InputContainer,
  Section,
  SlippageButtons
} from './styles'
import { SlippageValue, ValidatorTypeEnum } from './types'
import { useSlippageValueFromSwapForm, validateSlippage } from './utils'

const { DEX_SWAP_FORM } = model.components.dex

type Props = {
  position: number
  total: number
}

const DexSwapSettings = ({ position, total }: Props) => {
  const dispatch = useDispatch()
  const { formatMessage } = useIntl()
  const currentSlippage = useSlippageValueFromSwapForm()
  const [slippage, setSlippage] = useState<SlippageValue>(currentSlippage)
  const [customSlippage, setCustomSlippage] = useState<string>(
    currentSlippage.isCustom ? `${currentSlippage.value * 100}` : ''
  )

  useEffect(() => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.DEX_SETTINGS_OPENED,
        properties: {}
      })
    )
  }, [])

  const onSaveSettings = () => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.DEX_SLIPPAGE_CHANGED,
        properties: {}
      })
    )
    dispatch(actions.form.change(DEX_SWAP_FORM, 'slippage', slippage.value))
    dispatch(actions.modals.closeModal())
  }

  const onChangeCustomSlippage = (value: string) => {
    setSlippage(validateSlippage(value))
  }

  const handleInputChange = (event) => {
    const { value } = event.target

    if (!/^\d*\.?\d*$/.test(value)) return

    setCustomSlippage(value)
    onChangeCustomSlippage(value)
  }

  return (
    <Modal size='small' position={position} total={total} style={{ padding: '24px' }}>
      <Flex justifyContent='space-between'>
        <Text variant='title2' color={SemanticColors.body}>
          <FormattedMessage id='copy.swap_settings' defaultMessage='Swap Settings' />
        </Text>
        <CloseIcon onClick={() => dispatch(actions.modals.closeModal())}>
          <IconCloseCircleV2 color={PaletteColors['grey-400']} label='close' size='medium' />
        </CloseIcon>
      </Flex>
      <form>
        <Section>
          <Text variant='paragraph1' color={SemanticColors.body}>
            <FormattedMessage id='copy.allowed_slippage' defaultMessage='Allowed Slippage' />
          </Text>
          <SlippageButtons>
            {SLIPPAGE_PRESETS.map((option) => (
              <ButtonLegacy
                className={slippage.value === option.value && !slippage.isCustom ? 'active' : ''}
                data-e2e={`dexSlippage${option.display}Btn`}
                height='48px'
                key={option.display}
                nature='empty-blue'
                onClick={() =>
                  setSlippage({
                    isCustom: false,
                    value: option.value
                  })
                }
              >
                {option.display}
              </ButtonLegacy>
            ))}
          </SlippageButtons>
        </Section>
        <Section>
          <Text variant='paragraph1' color={SemanticColors.body}>
            <FormattedMessage
              id='copy.custom_slippage_percentage'
              defaultMessage='Custom Slippage'
            />
          </Text>
          <InputContainer>
            <CustomInput
              id='dexCoinSearch'
              type='text'
              value={customSlippage}
              placeholder={formatMessage({
                defaultMessage: 'Enter a percent',
                id: 'dex.customSlippage.placeholder'
              })}
              onChange={handleInputChange}
            />
            <Image name='dex-percentage' size='24px' />
          </InputContainer>
          {slippage.isCustom && slippage.messageType ? (
            <Text variant='caption1' color={SemanticColors[slippage.messageType]}>
              {slippage.message}
            </Text>
          ) : null}
        </Section>
        <ButtonSection>
          <Button
            size='large'
            width='full'
            variant='primary'
            text={<FormattedMessage id='buttons.save' defaultMessage='Save' />}
            onClick={onSaveSettings}
            disabled={
              slippage.isCustom &&
              (slippage.messageType === ValidatorTypeEnum.ERROR || !slippage.value)
            }
          />
        </ButtonSection>
      </form>
    </Modal>
  )
}

export default compose<React.ComponentType>(ModalEnhancer(ModalName.DEX_SWAP_SETTINGS))(
  DexSwapSettings
)
