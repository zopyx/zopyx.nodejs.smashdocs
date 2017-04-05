"use strict";

var jwt = require('json-web-token');
var uuidV4 = require('uuid/v4');
var request = require('request');
var fs = require('fs');
var qs = require('querystring');

class SMASHDOCs {

    constructor(partner_url, client_id, client_key, group_id, verbose=false) {
        this.check_parameter(partner_url);
        this.check_parameter(client_id);
        this.check_parameter(client_key);
        this.check_parameter(group_id);

        this.partner_url = partner_url;
        this.client_id = client_id;
        this.client_key = client_key;
        this.group_id = group_id;
        this.verbose = verbose;
        require('request').debug = verbose;
    }

    check_parameter(s) {
        if (s.length == 0 || s===undefined) {
            throw new Error('Invalid parameter');
        }
    }

    get_token() {
        var iat = Math.round(new Date().getTime() / 1000);
        var payload = {
            'iat': iat,
            'iss': uuidV4(),
            'jti': uuidV4(),
        };
        var token = jwt.encode(this.client_key, payload);
        return token.value;
    }

    headers() {
        return {
            'x-client-id': this.client_id,
            'content-type': 'application/json',
            'authorization': 'Bearer ' + this.get_token()
        }
    }

    list_templates() {

        var url = `${this.partner_url}/partner/templates/word`;
        var options = {
            url: url,
            headers: this.headers(),
        };

        var result;
        request.get(options, function (error, response, body) {
            if (response.statusCode == 200) {
                result = body;
            } else {
                var msg = `HTTP call failed\nURL: ${url}\nHTTP code: ${response.statusCode}\nError: ${error}\nBody: ${body})`;
                throw new Error(msg);
            }
        });
        while (result === undefined) {
            require('deasync').runLoopOnce();
        }
        return JSON.parse(result);
    }

    duplicate_document(document_id, title = '', description = '', creator_id = null) {

        var data = {
            'title': title,
            'description': description,
            'creatorUserId': creator_id
        };

        var url = `${this.partner_url}/partner/documents/${document_id}/duplicate`;
        var options = {
            url: url,
            json: data,
            headers: this.headers(),
        };

        var result;
        request.post(options, function (error, response, body) {
            if (response.statusCode == 200) {
                result = body;
            } else {
                var msg = `HTTP call failed\nURL: ${url}\nHTTP code: ${response.statusCode}\nError: ${error}\nBody: ${body})`;
                throw new Error(msg);
            }
        });
        while (result === undefined) {
            require('deasync').runLoopOnce();
        }
        return result;
    }


    new_document(title = '', description = '', role = 'editor', status = 'draft', user_data = null) {

        var data = {
            'user': user_data,
            'title': title,
            'description': description,
            'groupId': this.group_id,
            'userRole': role,
            'status': status,
            'sectionHistory': true
        };

        var url = `${this.partner_url}/partner/documents/create`;
        var options = {
            url: url,
            json: data,
            headers: this.headers(),
        };

        var result;
        request.post(options, function (error, response, body) {
            if (response.statusCode == 200) {
                result = body;
            } else {
                var msg = `HTTP call failed\nURL: ${url}\nHTTP code: ${response.statusCode}\nError: ${error}\nBody: ${body})`;
                throw new Error(msg);
            }
        });
        while (result === undefined) {
            require('deasync').runLoopOnce();
        }
        return result;
    }

    review_document(document_id) {

        var url = `${this.partner_url}/partner/documents/${document_id}/review`;
        var options = {
            url: url,
            headers: this.headers(),
        };

        var result;
        request.post(options, function (error, response, body) {
            if (response.statusCode == 200) {
                result = body;
            } else {
                var msg = `HTTP call failed (${url}, ${body})`;
                throw new Error(msg);
            }
        });
        while (result === undefined) {
            require('deasync').runLoopOnce();
        }
        return result;
    }

    archive_document(document_id) {

        var url = `${this.partner_url}/partner/documents/${document_id}/archive`;
        var options = {
            url: url,
            headers: this.headers(),
        };

        var result;
        request.post(options, function (error, response, body) {
            if (response.statusCode == 200) {
                result = body;
            } else {
                var msg = `HTTP call failed\nURL: ${url}\nHTTP code: ${response.statusCode}\nError: ${error}\nBody: ${body})`;
                throw new Error(msg);
            }
        });
        while (result === undefined) {
            require('deasync').runLoopOnce();
        }
        return result;
    }

    unarchive_document(document_id) {

        var url = `${this.partner_url}/partner/documents/${document_id}/unarchive`;
        var options = {
            url: url,
            headers: this.headers(),
        };

        var result;
        request.post(options, function (error, response, body) {
            if (response.statusCode == 200) {
                result = body;
            } else {
                var msg = `HTTP call failed\nURL: ${url}\nHTTP code: ${response.statusCode}\nError: ${error}\nBody: ${body})`;
                throw new Error(msg);
            }
        });
        while (result === undefined) {
            require('deasync').runLoopOnce();
        }
        return result;
    }

    update_metadata(document_id, data) {

        var url = `${this.partner_url}/partner/documents/${document_id}/metadata`;
        var options = {
            url: url,
            json: data,
            headers: this.headers(),
        };

        var result;
        request.post(options, function (error, response, body) {
            if (response.statusCode == 200) {
                result = 'dummy'; /* no return code at all */
            } else {
                var msg = `HTTP call failed\nURL: ${url}\nHTTP code: ${response.statusCode}\nError: ${error}\nBody: ${body})`;
                throw new Error(msg);
            }
        });
        while (result === undefined) {
            require('deasync').runLoopOnce();
        }

    }

    delete_document(document_id) {

        var url = `${this.partner_url}/partner/documents/${document_id}`;
        var options = {
            url: url,
            headers: this.headers(),
        };

        var result;
        request.delete(options, function (error, response, body) {
            if (response.statusCode == 200) {
                result = body;
            } else {
                var msg = `HTTP call failed\nURL: ${url}\nHTTP code: ${response.statusCode}\nError: ${error}\nBody: ${body})`;
                throw new Error(msg);
            }
        });
        while (result === undefined) {
            require('deasync').runLoopOnce();
        }
        return result;
    }

    document_info(document_id) {

        var url = `${this.partner_url}/partner/documents/${document_id}`;
        var options = {
            url: url,
            headers: this.headers(),
        };

        var result;
        request.get(options, function (error, response, body) {
            if (response.statusCode == 200) {
                result = body;
            } else {
                var msg = `HTTP call failed\nURL: ${url}\nHTTP code: ${response.statusCode}\nError: ${error}\nBody: ${body})`;
                throw new Error(msg);
            }
        });
        while (result === undefined) {
            require('deasync').runLoopOnce();
        }
        return JSON.parse(result);
    }

    get_documents(group_id='', user_id='') {

        var data = {};
        if (group_id) data['groupId'] = group_id;
        if (user_id) data['userId'] = user_id;

        var url = `${this.partner_url}/partner/documents/list`;
        var options = {
            url: url,
            qs: data,
            headers: this.headers(),
        };

        var result;
        request.get(options, function (error, response, body) {
            if (response.statusCode == 200) {
                result = body;
            } else {
                var msg = `HTTP call failed\nURL: ${url}\nHTTP code: ${response.statusCode}\nError: ${error}\nBody: ${body})`;
                throw new Error(msg);
            }
        });
        while (result === undefined) {
            require('deasync').runLoopOnce();
        }
        return JSON.parse(result);
    }

    export_document(document_id, user_id = '', format = 'docx', template_id = null, settings={}) {

        var data = {userId: user_id};

        if (format == 'docx') {
            var url = `${this.partner_url}/partner/documents/${document_id}/export/word`;
            data['templateId'] = template_id;
            data['settings'] = settings;
        } else if (format == 'sdxml') {
            var url = `${this.partner_url}/partner/documents/${document_id}/export/sdxml`;
        } else {
            var url = `${this.partner_url}/partner/documents/${document_id}/export/html`;
        }

        var options = {
            url: url,
            json: data,
            headers: this.headers(),
        };

        var suffix = (['sdxml', 'html'].indexOf(format) != -1) ? 'zip' : format;
        var fn_out = `${format}_out.${suffix}`;

        var result;
        request.post(options, function (error, response, body) {
            if (response.statusCode == 200) {
                result = body;
            } else {
                var msg = `HTTP call failed\nURL: ${url}\nHTTP code: ${response.statusCode}\nError: ${error}\nBody: ${body})`;
                throw new Error(msg);
            }
        }).pipe(fs.createWriteStream(fn_out));
        while (result === undefined) {
            require('deasync').runLoopOnce();
        }
        return fn_out;
    }

    upload_document(filename, title = '', description = '', role = 'editor', user_data = null, status = 'draft') {

        var headers = {
            'x-client-id': this.client_id,
            'authorization': 'Bearer ' + this.get_token()
        };

        var data = {
            'user': user_data,
            'title': title,
            'description': description,
            'groupId': this.group_id,
            'userRole': role,
            'status': status,
            'sectionHistory': true
        };

        var url = `${this.partner_url}/partner/imports/word/upload`;
        var options = {
            url: url,
            headers: headers,
            multipart: {
                data: {
                    'content-type': 'application/json',
                    body: JSON.stringify(data)
                },
                file: {body: fs.createReadStream(filename), 
                    filename: 'test.docx',
                 'content-type': 'application/octet-stream'}
            },
        };

        var result;
        request.post(options, function (error, response, body) {
            if (response.statusCode == 200) {
                result = body;
            } else {
                var msg = `HTTP call failed\nURL: ${url}\nHTTP code: ${response.statusCode}\nError: ${error}\nBody: ${body})`;
                throw new Error(msg);
            }
        });
        while (result === undefined) {
            require('deasync').runLoopOnce();
        }
        return result;
    }
}

module.exports = SMASHDOCs;
