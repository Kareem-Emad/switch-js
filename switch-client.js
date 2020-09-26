const rp = require('request-promise');
var jwt = require('jsonwebtoken');

const SWITCH_BASE_URL = process.env.SWITCH_BASE_URL || 'http://localhost:3000';
const SWITCH_JWT_SECRET = process.env.SWITCH_JWT_SECRET || 'my_little_secret';

/**
 * @function {publish}
 * @summary publishes data on the specified topic to trigger the topic subscribers
 * @param topic (string) topic to be triggered by this message
 * @param author (string) identifying string of this service or author of the request
 * @param options (object) request data including (headers, body, query_params, path_params, http_method) keys
 * @returns {Promise} promise for http request made to switch
 */
const publish = function(topic, author, options) {
  const encodedData = encodePayload(options);
  const generatedToken = generateToken(author);

  const url = `${SWITCH_BASE_URL}/publish`;

  const headers = {Authorization: `bearer ${generatedToken}`};
  const payload = {Payload: encodedData, Topic: topic};

  const requestOptions = {
    method: 'POST',
    uri: url,
    body: JSON.stringify(payload),
    headers: headers,
  };

  return rp(requestOptions);
};

/**
 * @function {encodePayload}
 * @summary encodes the data object into a base64 string
 * @param data (object) request data including (headers, body, query_params, path_params, http_method) keys
 * @returns {string} request data encoded as base64 string
 */
const encodePayload = function(data) {
  return Buffer.from(JSON.stringify(data)).toString('base64');
};

/**
 * @function {generateToken}
 * @summary signs a new token with the switch service key
 * @param author (string) identifying string of this service or author of the request
 * @returns {string} generates signed jwt token to verify identity with switch service
 */
const generateToken = function(author) {
  return jwt.sign({ Author: author }, SWITCH_JWT_SECRET);
};

module.exports = {
  publish,
  encodePayload,
  generateToken,
  SWITCH_BASE_URL,
  SWITCH_JWT_SECRET,
};
