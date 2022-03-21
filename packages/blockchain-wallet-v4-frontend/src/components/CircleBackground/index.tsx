import styled from 'styled-components'

const CircleBackground = styled.div<{ color?: string; size?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({ size = '40px' }) => size};
  height: ${({ size = '40px' }) => size};
  min-width: ${({ size = '40px' }) => size};
  background-color: ${({ color, theme }) => (color ? theme[color] : theme.blue000)};
  border-radius: ${({ size = '40px' }) => size};
  margin: 8px;
`

export default CircleBackground
