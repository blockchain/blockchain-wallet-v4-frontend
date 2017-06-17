// import chai from 'chai'
// import chaiImmutable from 'chai-immutable'
// import { AddressLabel, serializer } from '../../src/types'
// const { expect } = chai
// chai.use(chaiImmutable)
// // import { Map, List } from 'immutable-ext'

// describe('AddressLabel', () => {
//   const addressLabelFixture = require('../_fixtures/AddressLabel/address-label')
//   const addressLabel = AddressLabel.fromJS(addressLabelFixture)

//   describe('toJS', () => {
//     it('should return the correct object', () => {
//       expect(AddressLabel.toJS(addressLabel)).to.deep.equal(addressLabelFixture)
//     })
//   })

//   describe('properties', () => {
//     it('should have index', () => {
//       expect(addressLabel.index).to.equal(addressLabelFixture.index)
//     })

//     it('should have label', () => {
//       expect(addressLabel.label).to.equal(addressLabelFixture.label)
//     })
//   })

//   describe('setLabel', () => {
//     it('should set the label of an addressLabel object', () => {
//       let withNewLabel = AddressLabel.setLabel('new_label', addressLabel)
//       expect(withNewLabel.label).to.equal('new_label')
//     })
//   })

//   describe('serializer: ', () => {
//     it('compose(reviver, replacer) should be identity', () => {
//       const ser = JSON.stringify(addressLabel, serializer.replacer)
//       const unser = JSON.parse(ser, serializer.reviver)
//       expect(unser).to.deep.equal(addressLabel)
//     })
//     it('compose(replacer, reviver) should be identity', () => {
//       const ser = JSON.stringify(addressLabel, serializer.replacer)
//       const unser = JSON.parse(ser, serializer.reviver)
//       const ser2 = JSON.stringify(unser, serializer.replacer)
//       expect(ser).to.equal(ser2)
//     })
//   })
// })
