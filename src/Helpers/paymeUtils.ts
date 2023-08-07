import * as dotenv from 'dotenv';
const CryptoJS = require('crypto-js');
const { v4: uuid } = require('uuid');
import * as moment from 'moment-timezone';
dotenv.config();

export default class PaymeUtils {
  computeHttpSignature = (config, headerHash) => {
    // compute sig here
    let signingBase = '';
    config.headers.forEach(function (h) {
      if (signingBase !== '') {
        signingBase += '\n';
      }
      signingBase += h.toLowerCase() + ': ' + headerHash[h];
    });

    const hashf = (function () {
      switch (config.algorithm) {
        case 'hmac-sha1':
          return CryptoJS.HmacSHA1;
        case 'hmac-sha256':
          return CryptoJS.HmacSHA256;
        default:
          return null;
      }
    })();

    const hash = hashf(signingBase, config.secretkey);
    const signatureOptions = {
      keyId: config.keyId,
      algorithm: config.algorithm,
      headers: config.headers,
      signature: CryptoJS.enc.Base64.stringify(hash),
    };

    let sig =
      'keyId="${keyId}",algorithm="${algorithm}",headers="${headers}",signature="${signature}"';

    // build sig string here
    Object.keys(signatureOptions).forEach(function (key) {
      const pattern = '${' + key + '}',
        value =
          typeof signatureOptions[key] != 'string'
            ? signatureOptions[key].join(' ')
            : signatureOptions[key];
      sig = sig.replace(pattern, value);
    });

    return sig;
  };

  createHeaderHash = (
    method,
    targetUrl,
    accessToken,
    computedDigest = null,
  ) => {
    const traceId = uuid();

    const PAYME_API_VERSION = '0.12';
    const currentDate = moment().tz('Asia/Hong_Kong').format();
    if (computedDigest === null) {
      return {
        '(request-target)': `${method} ${targetUrl}`,
        'Api-Version': PAYME_API_VERSION,
        'Request-Date-Time': currentDate,
        'Trace-Id': traceId,
        Authorization: `Bearer ${accessToken}`,
      };
    }

    return {
      '(request-target)': `${method} ${targetUrl}`,
      'Api-Version': PAYME_API_VERSION,
      'Request-Date-Time': currentDate,
      'Trace-Id': traceId,
      Authorization: `Bearer ${accessToken}`,
      Digest: computedDigest,
    };
  };

  createComputedDigest = (payload) => {
    const sha256digest = CryptoJS.SHA256(JSON.stringify(payload));
    const base64sha256 = CryptoJS.enc.Base64.stringify(sha256digest);

    return 'SHA-256=' + base64sha256;
  };

  createConfigRequest = (headerHash, keyId, secretKey) => {
    // const PAYME_SIGNING_KEY_ID = '5e0b2df7-7fb1-4969-977c-cc334534b21e';
    // const PAYME_SIGNING_KEY =
    //   'UEdxNHFDQm1kTjhqNGZEdjRqdUNPN1ZMZVhLVE9zb2FQNnZuNS95QTJvVT0=';
    // keyId = PAYME_SIGNING_KEY_ID;
    // secretKey = PAYME_SIGNING_KEY;
    return {
      algorithm: 'hmac-sha256',
      // keyId: PAYME_SIGNING_KEY_ID,
      // secretkey: CryptoJS.enc.Base64.parse(PAYME_SIGNING_KEY),
      keyId: keyId,
      secretkey: CryptoJS.enc.Base64.parse(secretKey),
      headers: Object.keys(headerHash),
    };
  };

  createHeadersRequest = (
    accessToken,
    headerHash,
    signature,
    computedDigest = null,
  ) => {
    if (computedDigest === null) {
      return {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': 'en-US',
        'Trace-Id': headerHash['Trace-Id'],
        'Request-Date-Time': headerHash['Request-Date-Time'],
        'Api-Version': headerHash['Api-Version'],
        Signature: signature,
      };
    }

    return {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': 'en-US',
      'Trace-Id': headerHash['Trace-Id'],
      'Request-Date-Time': headerHash['Request-Date-Time'],
      'Api-Version': headerHash['Api-Version'],
      Signature: signature,
      Digest: computedDigest,
    };
  };

  decryptData = (payload) => {
    const bytes = CryptoJS.AES.decrypt(payload, 'XkhZG4fW2t2W');
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  };
}
