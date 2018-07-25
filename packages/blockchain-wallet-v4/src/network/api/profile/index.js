export default ({ apiUrl, post, put }) => {
  const createUser = userData =>
    // post({
    //   url: apiUrl,
    //   endPoint: '/users'
    //   data: { ...userData }
    // })
    Promise.resolve({ id: '1234', state: 'CREATED', kycState: 'NONE' })

  const updateUser = (userId, userData) =>
    // put({
    //   url: apiUrl,
    //   endPoint: '/users/${userId}',
    //   data: { applicantId }
    // })
    Promise.resolve(userData)

  return {
    createUser,
    updateUser
  }
}
