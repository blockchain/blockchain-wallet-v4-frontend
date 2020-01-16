import { Container } from 'components/Box'
import { FormattedMessage } from 'react-intl'
import { Text } from 'blockchain-info-components'
import BorrowPax from './BorrowPax'
import InitBorrowForm from './InitBorrowForm'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

interface Props {

}
interface State {

}

export const Wrapper = styled.div`
  width: 100%;
  margin: 0px 30px;
  padding-top: 24px;
  border-top: 1px solid ${(props) => props.theme.grey000};
`
export const Header = styled.div`
  margin-bottom: 40px;
`
export const MainTitle = styled(Text)`
  margin-bottom: 8px;
`

class Borrow extends PureComponent<Props, State> {
	state = {}

	render () {
		return (
			<Wrapper>
				<Header>
					<MainTitle size='32px' color='grey800' weight={600}>
						<FormattedMessage
							id='scenes.borrow.blockchain'
							defaultMessage='Borrow'
						/>
					</MainTitle>
					<Text size='16px' color='grey400' weight={500}>
						<FormattedMessage
							id='scenes.borrow.subheader'
							defaultMessage='Blockchain.com now lets you borrow USD Pax directly from your Blockchain Wallet with crypto as collateral.'
						/>
					</Text>
				</Header>
				<Container>
					<BorrowPax />
					<InitBorrowForm />
				</Container>
			</Wrapper>
		)
	}
}

export default Borrow
