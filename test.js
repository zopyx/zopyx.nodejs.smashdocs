var jwt = require('json-web-token');

var client_id = process.env.SMASHDOCS_CLIENT_ID;
var client_key = process.env.SMASHDOCS_CLIENT_KEY;
var partner_url = process.env.SMASHDOCS_PARTNER_URL;

console.log('Partner URL: ', partner_url);
console.log('Client Id: ', client_id);
console.log('Client Key: ', client_key);


class SMASHDOCs {

    constructor(partner_url, client_id, client_key, verbose=false) {
        this.partner_url = partner_url;
        this.client_id = client_id;
        this.client_key = client_key;
        this.verbose = verbose;
    }

    get_token() {
        const uuidV4 = require('uuid/v4');
        var iat = Math.round(new Date().getTime()/1000);
        var payload = {
            'iat': iat,
            'iss': uuidV4(),
            'jti': uuidV4(),
        }
        var token = jwt.encode(client_key, payload);
        return token.value;
    }

    headers() {
        return {
            'x-client-id': client_id,
            'content-type': 'application/json',
            'authorization': 'Bearer ' + this.get_token()
        }
    }

    user_data() {
        return  {
            'firstname': 'Andreas',
            'lastname': 'Jung',
            'email': 'foo@bar.org',
            'company': 'The Foo Company',
            'userId': 'ajung'
        }
    }


    new_document(title='', description='', role='editor', status='draft') {

        var data = {
            'user': this.user_data(),
            'title': 'My title',
            'description': 'my description',
            'groupId': 'nodejs',
            'userRole': 'editor',
            'status': 'draft',
            'sectionHistory': true
        }

        var url = partner_url + '/partner/documents/create';
        var options = {
          url: url,
          json: data,
          headers: this.headers(),
        };

        var result;
        var request = require('request');
        request.post(options, function (error, response, body) {
            if (response.statusCode == 200) {
                console.log(response.statusCode);
                result = body;
            } else {
                throw new Error(error);
            }
        });
        while(result === undefined) {
            require('deasync').runLoopOnce();
        }
        return result;
    }
}


SD = new SMASHDOCs(partner_url, client_id, client_key);
var result = SD.new_document();
console.log(result);
console.log(result['documentAccessLink']);
