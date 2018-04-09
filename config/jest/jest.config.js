import Enzyme from '../../node_modules/enzyme/build/index'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })
