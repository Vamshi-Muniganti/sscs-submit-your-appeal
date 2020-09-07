const { goTo } = require('@hmcts/one-per-page');
const { RestoreFromDraftStore } = require('middleware/draftAppealStoreMiddleware');
const paths = require('paths');
const sessionPrimer = require('steps/entry/SessionPrimer');

class Entry extends RestoreFromDraftStore {
  static get path() {
    return paths.session.entry;
  }

  get middleware() {
    return [sessionPrimer, super.middleware];
  }

  handler(req, res, next) {
    if (req.session.isUserSessionRestored) {
      res.redirect(paths.checkYourAppeal);
    } else {
      super.handler(req, res, next);
    }
  }

  next() {
    return goTo(this.journey.steps.BenefitType);
  }
}

module.exports = Entry;
