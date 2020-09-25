const assert = require('assert');
var jwt = require('jsonwebtoken');
const nock = require('nock');

const { describe, it} = require('mocha');
const switchPublisher = require('../switch-client');

describe('basic publish scenarioi', () => {

  it('encode payload to the corresponding base64 string', async() => {
    const encoded = switchPublisher.encodePayload({hello: 'world'});
    assert.equal(encoded, 'eyJoZWxsbyI6IndvcmxkIn0=');
  });

  it('should sign the token with the appropiate secret to have valid signature', async() => {
    const token = switchPublisher.generateToken('me');
    assert.equal(jwt.verify(token, 'my_little_secret').Author, 'me');
  });

  it('should send request with the token in header and the base64 data in the payload', async() => {
    nock('http://localhost:3000')
      .post('/publish', function(body) {
        const expectedBody = '{"Payload":"eyJib2R5Ijp7ImhlbGxvIjoid29ybGQifX0=","Topic":"topic"}';
        assert.equal(JSON.stringify(body), expectedBody);
        return true;
      })
      .reply(200, 'thank you');

    await switchPublisher.publish('topic', 'me', {body: {hello: 'world'}});
  });
});
