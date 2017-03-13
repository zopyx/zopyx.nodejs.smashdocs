var expect = require('chai').expect;
var SMASHDOCs = require('../api');


describe('SmashdocsTests', function() {

    var client_id = process.env.SMASHDOCS_CLIENT_ID;
    var client_key = process.env.SMASHDOCS_CLIENT_KEY;
    var partner_url = process.env.SMASHDOCS_PARTNER_URL;
    var debug =  process.env.SMASHDOCS_DEBUG;
    var group_id = 'sample-grp';
    var sd = new SMASHDOCs(partner_url, client_id, client_key, group_id, debug);
        
    var user_data = {
        'firstname': 'Hans',
        'lastname': 'Schlumpf',
        'email': 'foo@bar.org',
        'company': 'The Foo Company',
        'userId': 'schlumpf'
    };

    describe('push', function() {
        it('check document id', function() {
            var result = sd.new_document('doc title', 'doc description', 'editor', 'draft', user_data);
            expect(result).to.have.any.keys('documentId', 'documentAccessLink');            
        });

    });
    
});
