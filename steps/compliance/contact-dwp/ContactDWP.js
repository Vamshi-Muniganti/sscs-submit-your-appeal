const { ExitPoint } = require('@hmcts/one-per-page');
const { getBenefitCode } = require('utils/stringUtils');
const paths = require('paths');
const config = require('config');

const allowUC = config.get('features.allowUC.enabled') === 'true';

class ContactDWP extends ExitPoint {
  static get path() {
    return paths.compliance.contactDWP;
  }

  get allowUC() {
    return allowUC;
  }

  get benefitType() {
    if (this.req.session.BenefitType) {
      return getBenefitCode(this.req.session.BenefitType.benefitType);
    }
    return '';
  }
}

module.exports = ContactDWP;
