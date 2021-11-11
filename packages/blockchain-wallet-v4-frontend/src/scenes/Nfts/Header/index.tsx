import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { compose } from 'redux'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, TabMenu, TabMenuItem } from 'blockchain-info-components'
import { Form, TextBox } from 'components/Form'
import { selectors } from 'data'

import { Props as OwnProps } from '..'

const Wrapper = styled.div`
  width: 100%;
  z-index: 3;
  padding-bottom: 8px;
  background: ${(props) => props.theme.white};
  position: sticky;
  top: 0;
  margin-bottom: 8px;
  display: flex;
  gap: 24px;
`

const TabsContainer = styled.div`
  display: inline-block;
`

const StyledForm = styled(Form)`
  display: flex;
  align-items: center;
  gap: 8px;
  > div {
    max-width: 400px;
  }
`

const NftHeader: React.FC<Props> = ({ activeTab, formState, nftsActions, setActiveTab }) => {
  console.log(formState)

  return (
    <Wrapper>
      <TabsContainer>
        <TabMenu>
          <TabMenuItem onClick={() => setActiveTab('explore')} selected={activeTab === 'explore'}>
            Explore
          </TabMenuItem>
          <TabMenuItem
            onClick={() => setActiveTab('my-collection')}
            selected={activeTab === 'my-collection'}
          >
            My Collection
          </TabMenuItem>
        </TabMenu>
      </TabsContainer>
      <StyledForm
        onSubmit={(e) => {
          e.preventDefault()
          nftsActions.searchNftAssetContract(e.target.elements.search.value)
        }}
      >
        <Field
          placeholder='Search Collection By Contract Address'
          name='search'
          component={TextBox}
        />
        <Button data-e2e='searchNfts' type='submit' nature='primary'>
          <FormattedMessage id='buttons.search' defaultMessage='Search' />
        </Button>
      </StyledForm>
    </Wrapper>
  )
}

const mapStateToProps = (state: any) => ({
  formState: selectors.form.getFormMeta('nftSearch')(state)
})

const connector = connect(mapStateToProps)

type Props = OwnProps &
  ConnectedProps<typeof connector> & {
    activeTab: 'explore' | 'my-collection'
    setActiveTab: React.Dispatch<React.SetStateAction<'explore' | 'my-collection'>>
  }

const enhance = compose<any>(connector, reduxForm<{}, OwnProps>({ form: 'nftSearch' }))

export default enhance(NftHeader)
