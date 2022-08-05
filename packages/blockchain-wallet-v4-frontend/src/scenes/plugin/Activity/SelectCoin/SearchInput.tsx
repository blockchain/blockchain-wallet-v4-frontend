import React from 'react'
import styled from 'styled-components'

const StyledSearch = styled.input`
  padding: 12px 16px;
  margin-bottom: 32px;
  background: transparent;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
  border: 2px solid ${(props) => props.theme.grey700};
  color: ${(props) => props.theme.white};
  outline: none;
  width: 100%;
`

type TBaseComponentProps<P> = Omit<P, 'style' | 'className'>

type HTMLInputProps = React.ComponentPropsWithoutRef<'input'>
type HTMLInputPassedProps = TBaseComponentProps<Omit<HTMLInputProps, 'onChange' | 'type'>>

interface ISearchInputProps extends HTMLInputPassedProps {
  onChange(e: React.ChangeEvent<HTMLInputElement>, value: string): void
  type: string
}

const SearchInput: React.FC<ISearchInputProps> = ({ children, ...restProps }) => (
  <StyledSearch
    {...restProps}
    onChange={restProps.onChange as React.ChangeEventHandler<HTMLInputElement>}
  >
    {children}
  </StyledSearch>
)

export default SearchInput
