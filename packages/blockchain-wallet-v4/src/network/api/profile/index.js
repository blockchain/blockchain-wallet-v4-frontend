export default ({ nabuUrl, post, patch }) => {
  const createUser = userData =>
    // post({
    //   url: apiUrl,
    //   endPoint: '/users'
    //   data: { ...userData }
    // })
    Promise.resolve({ id: '1234', state: 'CREATED', kycState: 'NONE' })

  const updateUser = (userId, userData) =>
    // patch({
    //   url: apiUrl,
    //   endPoint: '/users/${userId}',
    //   data: { ...userData }
    // })
    Promise.resolve(userData)

  return {
    createUser,
    updateUser
  }
}
