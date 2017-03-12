
var client_id = process.env.SMASHDOCS_CLIENT_ID;
var client_key = process.env.SMASHDOCS_CLIENT_KEY;
var partner_url = process.env.SMASHDOCS_PARTNER_URL;

console.log('Partner URL: ', partner_url);
console.log('Client Id: ', client_id);
console.log('Client Key: ', client_key);


var jwt = require('json-web-token');

function get_token() {

    const uuidV4 = require('uuid/v4');
    iat = Math.round(new Date().getTime()/1000);
    payload = {
        'iat': iat,
        'iss': uuidV4(),
        'jti': uuidV4(),
    }
    var token = jwt.encode(client_key, payload);
    return token.value;
}

headers = {
    'x-client-id': client_id,
    'content-type': 'application/json',
    'authorization': 'Bearer ' + get_token()
}

console.log(headers);
