import { PaletteColors, Text } from '@blockchain-com/constellation'
import styled from 'styled-components'

import Form from 'components/Form/Form'

export const Label = styled.label`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  display: block;
  color: ${PaletteColors['grey-900']};
`
export const ContentWrapper = styled.div`
  margin: 40px;
`
export const CustomForm = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
`
export const ErrorText = styled(Text)`
  display: inline-flex;
  font-weight: 500;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 32px;
  background-color: ${PaletteColors['red-000']};
  color: ${PaletteColors['red-800']};
  margin-bottom: 16px;
`
export const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`

export const LinkButton = styled(Text)`
  cursor: pointer;
`
