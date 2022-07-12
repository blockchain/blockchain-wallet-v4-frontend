import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { Icon } from '@blockchain-com/constellation'
import { IconCloseCircleV2 } from '@blockchain-com/icons'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { Field, getFormValues, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Modal, Text } from 'blockchain-info-components'
import Form from 'components/Form/Form'
import NumberBox from 'components/Form/NumberBox'
import { actions, model } from 'data'
import { DEX_SWAP_FORM } from 'data/components/dex/model'
import { DexSwapSettingsForm } from 'data/components/dex/types'
import { ModalName } from 'data/modals/types'
import { RootState } from 'data/rootReducer'
import ModalEnhancer from 'providers/ModalEnhancer'

const { DEX_SWAP_SETTINGS_FORM } = model.components.dex

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`
const CloseIcon = styled.div`
  > :first-child {
    cursor: pointer;
  }
`
const Section = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
`
const SlippageButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 8px;

  > button {
    width: calc(25% - 8px);
    min-width: calc(25% - 8px);
    max-width: calc(25% - 8px);

    &.active {
      color: ${(props) => props.theme.white};
      background-color: ${(props) => props.theme.grey800};
      border: 1px solid ${(props) => props.theme.grey800};
      cursor: default;
    }
  }
`

// determine active slippage with priority on custom, then standard values else default to 'Auto' (null)
const determineActiveSlippage = (formValues?: DexSwapSettingsForm) => {
  return formValues?.customSlippage?.toString() || formValues?.standardSlippage?.toString() || null
}

const DexSwapSettings = ({ formActions, formValues, modalActions, position, total }: Props) => {
  const onStandardSlippageSelect = (val) => {
    formActions.change(DEX_SWAP_SETTINGS_FORM, 'customSlippage', undefined)
    formActions.change(DEX_SWAP_SETTINGS_FORM, 'standardSlippage', val)
  }
  const onSaveSettings = () => {
    const slippage = determineActiveSlippage(formValues)
    formActions.change(DEX_SWAP_SETTINGS_FORM, 'activeSlippage', slippage)
    formActions.change(DEX_SWAP_FORM, 'slippage', slippage)
    modalActions.closeModal()
  }
  const activeSlippage = determineActiveSlippage(formValues)

  return (
    <Modal size='small' position={position} total={total} style={{ padding: '24px' }}>
      <Header>
        <Text color='textBlack' lineHeight='135%' size='24px' weight={600}>
          <FormattedMessage id='copy.swap_settings' defaultMessage='Swap Settings' />
        </Text>
        <CloseIcon
          onClick={() => {
            modalActions.closeModal()
          }}
        >
          <Icon label='close' size='md' color='grey400'>
            <IconCloseCircleV2 />
          </Icon>
        </CloseIcon>
      </Header>
      <Form>
        <Section>
          <Text color='textBlack' lineHeight='20px' size='14px' weight={600}>
            <FormattedMessage id='copy.allowed_slippage' defaultMessage='Allowed Slippage' />
          </Text>
          <SlippageButtons>
            {[
              { display: '0.5%', value: '0.005' },
              { display: '2%', value: '0.02' },
              { display: '5%', value: '0.05' },
              { display: 'Auto', value: null }
            ].map((option) => (
              <Button
                className={
                  activeSlippage === option.value && !formValues?.customSlippage ? 'active' : ''
                }
                data-e2e={`dexSlippage${option.display}Btn`}
                height='48px'
                key={option.display}
                nature='empty-blue'
                onClick={() => onStandardSlippageSelect(option.value)}
              >
                {option.display}
              </Button>
            ))}
          </SlippageButtons>
        </Section>
        <Section>
          <Text
            color='textBlack'
            lineHeight='20px'
            size='14px'
            weight={600}
            style={{ marginBottom: '8px' }}
          >
            <FormattedMessage id='copy.custom_slippage' defaultMessage='Custom Slippage' />
          </Text>
          <Field
            component={NumberBox}
            data-e2e='customSlippageInput'
            name='customSlippage'
            placeholder='Enter Custom Slippage'
          />
        </Section>
        <Section>
          <Button
            data-e2e='saveSwapSettings'
            fullwidth
            jumbo
            nature='primary'
            onClick={onSaveSettings}
          >
            <FormattedMessage id='buttons.save' defaultMessage='Save' />
          </Button>
        </Section>
      </Form>
    </Modal>
  )
}

const mapStateToProps = (state: RootState) => ({
  formValues: getFormValues(DEX_SWAP_SETTINGS_FORM)(state) as DexSwapSettingsForm
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})
const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector> &
  InjectedFormProps & {
    position: number
    total: number
  }

const enhance = compose<React.ComponentType>(
  ModalEnhancer(ModalName.DEX_SWAP_SETTINGS),
  connector,
  reduxForm({
    destroyOnUnmount: false,
    form: DEX_SWAP_SETTINGS_FORM
  })
)

export default enhance(DexSwapSettings)
