const { Page } = require('@hmcts/one-per-page');
const paths = require('paths');

class PrivacyPolicy extends Page {
  static get path() {
    return paths.policy.privacy;
  }
}

module.exports = PrivacyPolicy;
