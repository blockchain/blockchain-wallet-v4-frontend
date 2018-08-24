import React from 'react'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 10px 30px;
  box-sizing: border-box;
  font-size: 24px;
  background-color: ${props => props.theme['white-blue']};
  border-bottom: 1px solid ${props => props.theme['gray-1']};

  @media (min-width: 1200px) {
    flex-direction: row;
    justify-content: space-between;
  }
`
const ColumnLeft = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;

  @media (min-width: 1200px) {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: auto;
  }
`
const ColumnRight = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  @media (min-width: 1200px) {
    width: auto;
  }
`
const SettingsIcon = styled(Icon)`
  &:hover {
    cursor: pointer;
  }
`

const Menu = props => {
  const { deviceName } = props
  const openSettings = () => {
    window.alert('settings')
  }

  return (
    <Wrapper>
      <ColumnLeft>
        <Text size='24px' weight={300}>
          {deviceName}
        </Text>
      </ColumnLeft>
      <ColumnRight>
        <SettingsIcon
          name='settings-filled'
          size={'24px'}
          onClick={openSettings}
        />
      </ColumnRight>
    </Wrapper>
  )
}

export default Menu
