import { Provider } from 'react-redux'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import GetStarted from './index'
import React from 'react'
import toJson from 'enzyme-to-json'

const mockStore = configureMockStore()
const store = mockStore({})

jest.mock('blockchain-info-components', () => ({
  Image: 'image',
  Text: 'text'
}))

jest.mock('./StatusBar', () => 'StatusBar')

describe('StatusBar', () => {
  it('renders correctly', () => {
    const component = shallow(
      <Provider store={store}>
        <GetStarted />
      </Provider>
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
