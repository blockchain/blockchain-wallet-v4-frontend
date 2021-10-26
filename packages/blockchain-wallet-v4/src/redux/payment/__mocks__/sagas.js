const createSagas = jest.requireActual('../sagas').default

const mockCreate = ({ create }) => ({
  create: ({ netwotk, payment }) => ({
    amount: jest.fn(),
    build: jest.fn(),
    buildSweep: jest.fn(),
    chain: jest.fn(),
    description: jest.fn(),
    fee: jest.fn(),
    from: jest.fn(),
    init: jest.fn(),
    publish: jest.fn(),
    sign: jest.fn(),
    to: jest.fn(),
    value: jest.fn(() => this)
  })
})

export default ({ api }) => mockCreate(createSagas({ api }))
