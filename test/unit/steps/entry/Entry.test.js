const { expect } = require('test/util/chai');
const paths = require('paths');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const sessionPrimer = require('steps/entry/SessionPrimer');

const mockHandler = sinon.spy();

class RestoreFromDraftStore {
  constructor(params) {
    Object.assign(this, params);
  }
  handler() {
    mockHandler();
  }
}

RestoreFromDraftStore.handler = sinon.spy();

const Entry = proxyquire('steps/entry/Entry', {
  'middleware/draftAppealStoreMiddleware': {
    RestoreFromDraftStore
  }
});

describe('Entry.js', () => {
  let entry = null;

  beforeEach(() => {
    entry = new Entry({
      journey: {
        steps: {
          BenefitType: paths.start.benefitType
        }
      }
    });
  });

  describe('get path()', () => {
    it('returns path /entry', () => {
      expect(Entry.path).to.equal(paths.session.entry);
    });
  });

  describe('next()', () => {
    it('returns the next step path /benefit-type', () => {
      expect(entry.next()).to.eql({ nextStep: paths.start.benefitType });
    });
  });

  describe('When method user data is restored', () => {
    const req = { session: { isUserSessionRestored: true } };
    const redirect = sinon.spy();
    const res = {
      redirect,
      sendStatus: sinon.spy()
    };
    it('should not call `super.handler()`', () => {
      entry.handler(req, res);
      expect(redirect.called).to.eql(true);
      expect(mockHandler.calledOnce).to.eql(false);
    });
  });

  describe('When method user data is not restored', () => {
    const req = { session: { isUserSessionRestored: false } };
    const redirect = sinon.spy();
    const res = {
      redirect,
      sendStatus: sinon.spy()
    };
    it('should not call `super.handler()`', () => {
      entry.handler(req, res);
      expect(redirect.called).to.eql(false);
      expect(mockHandler.calledOnce).to.eql(true);
    });
  });

  describe('When session is not already created', () => {
    const req = { session: { generate: sinon.stub() } };
    const redirect = sinon.spy();
    const res = {
      redirect
    };
    it('should generate session', () => {

      sessionPrimer(req, res, () => {});
      // expect(redirect.called).to.eql(false);
      expect(req.session.generate).calledOnce;
    });
  });

  describe('When session is not already created and cannot create', () => {
    const req = { }
    const redirect = sinon.spy();
    const res = {
      redirect
    };
    it('redirects', () => {
      sessionPrimer(req, res, () => {});
      expect(redirect.called).to.eql(true);
    });
  });


  describe('When session already exists', () => {
    const req = { session: { isUserSessionRestored: false } };
    const redirect = sinon.spy();
    const res = {
      redirect
    };
    it('should not redirect', () => {

      sessionPrimer(req, res, () => {});
      expect(redirect.called).to.eql(false);
    });
  });
});
