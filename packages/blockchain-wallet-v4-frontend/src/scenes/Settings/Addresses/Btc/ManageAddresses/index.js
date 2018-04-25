import React from 'react'
import styled from 'styled-components'
import { LinkContainer } from 'react-router-bootstrap'
import { Field, reduxForm } from 'redux-form'

import { TextBox } from 'components/Form'
import { Icon, TabMenu, TabMenuItem } from 'blockchain-info-components'
import UnusedAddresses from './UnusedAddresses'
import UsedAddresses from './UsedAddresses'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`
const MenuWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  padding: 8px 30px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white-blue']};
  border-bottom: 1px solid ${props => props.theme['gray-1']};

  @media(min-width: 1200px) {
    flex-direction: row;
    justify-content: space-between;
  }
`
const ContentWrapper = styled.div`
  padding: 40px 30px;
`
const Search = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  @media(min-width: 1200px) { width: auto; }
`
const SearchIcon = styled(Icon)`
  position: absolute;
  top: 10px;
  right: 10px;
`
const BackButton = styled(Icon)`
  margin-left: 2px;
  &:hover {
    cursor: pointer;
  }
`

class ManageAddressesContainer extends React.PureComponent {
  render () {
    const walletIndex = this.props.computedMatch.params.index

    return (
      <Wrapper>
        <MenuWrapper>
          <LinkContainer to='/settings/addresses'>
            <BackButton size='20px' weight={300} name='left-arrow' />
          </LinkContainer>
          <Search>
            <Field name='search' component={TextBox} />
            <SearchIcon name='search' size='20px' />
          </Search>
        </MenuWrapper>
        <ContentWrapper>
          <UnusedAddresses walletIndex={walletIndex} />
          <UsedAddresses />
        </ContentWrapper>
      </Wrapper>
    )
  }
}

export default reduxForm({ form: 'todo' })(ManageAddressesContainer)
