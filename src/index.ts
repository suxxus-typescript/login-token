import jwt_decode from 'jwt-decode';
import _ from 'lodash/fp';
import parseUrl from 'url-parse';

const dummyToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

const dummyUrl = 'http://localhost:8080/signing/';

type TokenNotFound = {
  found: false;
};

type TokenFound = {
  found: true;
  value: string;
};

type MaybeToken = TokenFound | TokenNotFound;

type Model = { token: MaybeToken };

const returnMaybeToken = (exists: boolean, token?: string): MaybeToken => {
  if (exists) {
    return { found: true, value: token };
  } else {
    return { found: false };
  }
};

const extractTok = _.pipe(_.split('/'), _.reverse, _.head);

const obtainTokenFromPathname = (pattern: string, str: string): MaybeToken => {
  if (new RegExp(pattern).test(str)) {
    try {
      const extracted = extractTok(str);
      jwt_decode(extracted);
      return returnMaybeToken(true, extracted);
    } catch (e) {
      return returnMaybeToken(false);
    }
  }
  return returnMaybeToken(false);
};

const init = (url: string): Model => {
  const token: MaybeToken = obtainTokenFromPathname(
    'signin',
    parseUrl(url).pathname,
  );

  return {
    token,
  };
};

const model: Model = init(dummyUrl + dummyToken);

if (model.token.found) {
  console.log('__TOKEN__', model.token.value);
}
