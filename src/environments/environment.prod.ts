export const environment = {
  production: true,
  isMockEnabled: true, // You have to switch this, when your real back-end is done
  authTokenKey: '',
  baseUrl: '',
  /**
   * removed when its a prod build.
   */
  user: { password: null, username: null }
};