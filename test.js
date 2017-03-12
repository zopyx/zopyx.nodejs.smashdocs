
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


user_data = {
    'firstname': 'Andreas',
    'lastname': 'Jung',
    'email': 'foo@bar.org',
    'company': 'The Foo Company',
    'userId': 'ajung'
}

data = {
    'user': user_data,
    'title': 'My title',
    'description': 'my description',
    'groupId': 'nodejs',
    'userRole': 'editor',
    'status': 'draft',
    'sectionHistory': true
}

url = partner_url + '/partner/documents/create';

data_json = JSON.stringify(data);


var http = require('http');
http.post = require('http-post');
