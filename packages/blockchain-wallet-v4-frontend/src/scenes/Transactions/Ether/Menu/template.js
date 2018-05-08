import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { ComponentDropdown, Icon, Link, Text } from 'blockchain-info-components'
import { TextBox, TabMenuTransactionStatus } from 'components/Form'

const Wrapper = styled.div`
  width: 100%;
  padding: 8px 30px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white-blue']};
  border-bottom: 1px solid ${props => props.theme['gray-1']};
`
const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  @media(min-width: 1200px) {
    flex-direction: row;
    justify-content: space-between;
  }
`
const Status = styled.div`
  width: 100%;
  > div > span:first-child {
    padding-left: 0px;
  }
  @media(min-width: 1200px) { width: 360px; }
`
const PrivateKeysWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  margin-right: 15px;
`
const Search = styled.div`
  position: relative;
  width: 60%;
  @media(min-width: 1200px) { width: auto; }
`
const SearchIcon = styled(Icon)`
  position: absolute;
  top: 10px;
  right: 10px;
`
const MenuRight = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 40%;
`
const ClickableText = styled(Text)`
  cursor: pointer;
`

const OptionItem = ({ id, defaultMessage, onClick }) => (
  <ClickableText size='small' onClick={onClick}>
    <FormattedMessage id={id} defaultMessage={defaultMessage} />
  </ClickableText>
)

const PrivateKeys = () => (
  <Link weight={300} size='12px'>
    <FormattedMessage id='scenes.transactions.ether.privatekeys' defaultMessage='Private Keys' />
  </Link>
)

const Menu = (props) => {
  const { hasLegacyAccount, onShowPrivateKey } = props
  return (
    <Wrapper>
      <Container>
        <Status>
          <Field name='status' statuses={['', 'sent', 'received']} component={TabMenuTransactionStatus} />
        </Status>
        <MenuRight>
          <PrivateKeysWrapper>
            {
              hasLegacyAccount ? <ComponentDropdown
                down
                forceSelected
                color={'gray-5'}
                selectedComponent={<PrivateKeys />}
                components={[
                  <OptionItem id='scenes.transactions.ether.export.privatekey' defaultMessage='Export Private Key' onClick={() => onShowPrivateKey(false)} />,
                  <OptionItem id='scenes.transactions.ether.export.archived' defaultMessage='Export Archived Private Key' onClick={() => onShowPrivateKey(true)} />
                ].filter(x => x)} /> : <Link size={'12px'} weight={300} onClick={() => onShowPrivateKey(false)}><FormattedMessage id='scenes.transactions.ether.export.privatekey' defaultMessage='Export Private Key' /></Link>
            }
          </PrivateKeysWrapper>
          <Search>
            <Field name='search' component={TextBox} />
            <SearchIcon name='search' size='20px' />
          </Search>
        </MenuRight>
      </Container>
    </Wrapper>
  )
}

export default reduxForm({ form: 'ethTransactions' })(Menu)
