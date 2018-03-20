/**
 * This service emulates an Authentication Service.
 */
export class AuthService {
  constructor(AppConfig, $q, $timeout) {
    this.AppConfig = AppConfig;
    this.$q = $q;
    this.$timeout = $timeout;
    this.users = [
      {email: 'myself@angular.dev', type:'employee'}, 
      {email: 'devgal@angular.dev', type:'employee'},
      {email: 'devguy@angular.dev', type: 'installer'}
    ];
  }

  /**
   * Returns true if the user is currently authenticated, else false
   */
  isAuthenticated() {
    return !!this.AppConfig.emailAddress;
  }

  /**
   * Fake authentication function that returns a promise that is either resolved or rejected.
   *
   * Given a username and password, checks that the username matches one of the known
   * usernames (this.usernames), and that the password matches 'password'.
   *
   * Delays 800ms to simulate an async REST API delay.
   */
  authenticate(username, password) {
    const { $timeout, $q, AppConfig } = this;

    // checks if the username is one of the known usernames, and the password is 'password'
    const checkCredentials = () => $q((resolve, reject) => {
      const validUsername = this.users.map((user) => user.email).indexOf(username) !== -1;
      const validPassword = password === 'password';
      return (validUsername && validPassword) ? resolve(username) : reject("Invalid username or password");
    });

    return $timeout(checkCredentials, 800)
      .then((authenticatedUser) => {
        AppConfig.emailAddress = authenticatedUser;
        AppConfig.save();
      });
  }

  /** Logs the current user out */
  logout() {
    this.AppConfig.emailAddress = undefined;
    this.AppConfig.save();
  }
}
AuthService.$inject = ['AppConfig', '$q', '$timeout'];
