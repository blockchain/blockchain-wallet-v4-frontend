import React, { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useDispatch } from 'react-redux'
import {
  Button,
  Flex,
  IconCloseCircleV2,
  Input,
  PaletteColors,
  SemanticColors,
  Text
} from '@blockchain-com/constellation'
import { compose } from 'redux'

import { Button as ButtonLegacy, Modal } from 'blockchain-info-components'
import { actions, model } from 'data'
import { ModalName } from 'data/modals/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { SLIPPAGE_PRESETS } from './constants'
import { CloseIcon, Section, SlippageButtons } from './styles'
import type { SlippageValue } from './utils'
import { useSlippageValueFromSwapForm, validators } from './utils'

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

  const onSaveSettings = () => {
    dispatch(actions.form.change(DEX_SWAP_FORM, 'slippage', `${slippage.value}`))
    dispatch(actions.modals.closeModal())
  }

  const onChangeCustomSlippage = (value: string) => {
    const isNumber = validators.isNumber(value)
    if (isNumber) {
      setSlippage({
        error: undefined,
        isCustom: true,
        value: parseFloat(value) / 100
      })
    }
  }

  const onValidateCustomSlippage = (value: string) => {
    const numericValue = (validators.isNumber(value) ? parseFloat(value) : 0) / 100
    const error = validators.minValue(numericValue) || validators.maxValue(numericValue)
    setSlippage({
      error,
      isCustom: true,
      value: numericValue
    })
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
            <FormattedMessage
              id='copy.allowed_slippage_percentage'
              defaultMessage='Allowed Slippage %'
            />
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
              defaultMessage='Custom Slippage %'
            />
          </Text>
          <Input
            // value={''} // TODO: Really no value prop for an INPUT field??? Fix constellation
            id='dexCoinSearch'
            defaultValue={slippage.isCustom ? slippage.value * 100 : ''}
            state={slippage.isCustom && slippage.error ? 'error' : 'default'}
            type='number' // TODO: Fix constellation input to actually accept only numbers
            placeholder={formatMessage({
              defaultMessage: 'Search Symbol or Address',
              id: 'dex.customSlippage.placeholder'
            })}
            onBlur={(event) => onValidateCustomSlippage((event.target as HTMLInputElement).value)}
            onChange={(event) => onChangeCustomSlippage((event.target as HTMLInputElement).value)}
          />
          {slippage.isCustom && slippage.error ? (
            <Text variant='caption1' color={SemanticColors.error}>
              {slippage.error}
            </Text>
          ) : null}
        </Section>
        <Section>
          <Button
            size='large'
            width='full'
            variant='primary'
            onClick={onSaveSettings}
            text={<FormattedMessage id='buttons.save' defaultMessage='Save' />}
          />
        </Section>
      </form>
    </Modal>
  )
}

export default compose<React.ComponentType>(ModalEnhancer(ModalName.DEX_SWAP_SETTINGS))(
  DexSwapSettings
)
