const LanguagePreference = require('steps/start/language-preference/LanguagePreference');
const { expect } = require('test/util/chai');
const paths = require('paths');
const benefitTypes = require('steps/start/benefit-type/types');
const sections = require('steps/check-your-appeal/sections');
const userAnswer = require('utils/answer');
const config = require('config');

describe('LanguagePreference.js', () => {
  let languagePreference = null;

  beforeEach(() => {
    languagePreference = new LanguagePreference({
      journey: {
        steps: {
          AppealFormDownload: paths.appealFormDownload,
          PostcodeChecker: paths.start.postcodeCheck
        }
      }
    });
    languagePreference.fields = { languagePreference: {} };
  });

  describe('get path()', () => {
    it('returns path /language-preference', () => {
      expect(LanguagePreference.path).to.equal(paths.start.languagePreference);
    });
  });

  describe('answers() and values()', () => {
    const question = 'A Question';

    beforeEach(() => {
      languagePreference.content = {
        cya: {
          languagePreferenceWelsh: question
        }
      };

      languagePreference.fields = {
        languagePreferenceWelsh: {}
      };
    });

    it('should set the question and section', () => {
      const answers = languagePreference.answers();
      expect(answers.question).to.equal(question);
      expect(answers.section).to.equal(sections.benefitType);
    });

    it('should titleise the users selection to \'No\' for CYA', () => {
      languagePreference.fields.languagePreferenceWelsh.value = userAnswer.NO;
      const answers = languagePreference.answers();
      expect(answers.answer).to.equal('No');
    });

    it('should titleise the users selection to \'Yes\' for CYA', () => {
      languagePreference.fields.languagePreferenceWelsh.value = userAnswer.YES;
      const answers = languagePreference.answers();
      expect(answers.answer).to.equal('Yes');
    });

    it('should set hasRepresentative to false', () => {
      languagePreference.fields.languagePreferenceWelsh.value = userAnswer.NO;
      const values = languagePreference.values();
      expect(values).to.eql({ languagePreferenceWelsh: false });
    });

    it('should set hasRepresentative to true', () => {
      languagePreference.fields.languagePreferenceWelsh.value = userAnswer.YES;
      const values = languagePreference.values();
      expect(values).to.eql({ languagePreferenceWelsh: true });
    });

    it('should set hasRepresentative to null', () => {
      languagePreference.fields.languagePreferenceWelsh.value = '';
      const values = languagePreference.values();
      expect(values).to.eql({ languagePreferenceWelsh: null });
    });
  });

  describe('next()', () => {
    it('returns /appeal-form-download when benefit type is not PIP', () => {
      languagePreference.req.session = {
        BenefitType: {
          benefitType: 'not PIP'
        }
      };
      expect(languagePreference.next().step).to.eql(paths.appealFormDownload);
    });

    it('returns /postcode-check with benefit type value is PIP', () => {
      languagePreference.req.session = {
        BenefitType: {
          benefitType: 'Personal Independence Payment (PIP)'
        }
      };
      expect(languagePreference.next().step).to.eql(paths.start.postcodeCheck);
    });

    it('pushes ESA as allowed benefitType if allowESA is enabled', () => {
      expect(Object.keys(benefitTypes).includes('employmentAndSupportAllowance'))
        .to.eql(config.get('features.allowESA.enabled') === 'true');
    });

    it('pushes UC as allowed benefitType if allowUC is enabled', () => {
      expect(Object.keys(benefitTypes).includes('universalCredit'))
        .to.eql(config.get('features.allowUC.enabled') === 'true');
    });
  });
});