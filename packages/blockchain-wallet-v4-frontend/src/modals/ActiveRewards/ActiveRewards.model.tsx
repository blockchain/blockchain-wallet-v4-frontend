import React from 'react'
import { PaletteColors, SemanticColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

export const EDDMessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background-color: ${PaletteColors['grey-000']};
  border: 1px solid ${SemanticColors.warning};
  border-radius: 16px;
  margin-top: 16px;

  & > button {
    margin-top: 8px;
  }
`
