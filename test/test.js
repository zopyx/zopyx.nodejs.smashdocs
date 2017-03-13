var chai = require('chai');
var SMASHDOCs = require('../api');
chai.use(require('chai-string'));

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
        it('new_document()', function() {
            var result = sd.new_document('doc title', 'doc description', 'editor', 'draft', user_data);
            chai.expect(result).to.have.any.keys('documentId', 'documentAccessLink');            
        });

        it('document_info()', function() {
            var result = sd.new_document('doc title', 'doc description', 'editor', 'draft', user_data);
            var info = sd.document_info(result['documentId']);
            chai.expect(info).to.have.any.keys('title', 'description', 'status');            
        });

        it('delete_document()', function() {
            var result = sd.new_document('doc title', 'doc description', 'editor', 'draft', user_data);
            sd.delete_document(result['documentId']);
            chai.expect(function() {sd.delete_document(result['documentId'])}).to.throw(Error);
        });

        it('archive_document()', function() {
            var result = sd.new_document('doc title', 'doc description', 'editor', 'draft', user_data);
            sd.archive_document(result['documentId']);
            sd.unarchive_document(result['documentId']);
            chai.expect(function() {sd.unarchive_document(result['documentId'])}).to.throw(Error);
        });

        it('review_document()', function() {
            var result = sd.new_document('doc title', 'doc description', 'editor', 'draft', user_data);
            var document_id = result['documentId'];

            var document_info = sd.document_info(document_id);
            chai.expect(document_info['status']).to.equal('draft');

            sd.review_document(document_id);

            var document_info2 = sd.document_info(document_id);
            chai.expect(document_info2['status']).to.equal('review');
        });

        it('export_document_sdxml()', function() {
            this.timeout(10000);
            var result = sd.new_document('doc title', 'doc description', 'editor', 'draft', user_data);
            var document_id = result['documentId'];
            var templates = sd.list_templates();
            var fn = sd.export_document(document_id, user_id='ajung', format='sdxml', template_id=templates[0]['id']);
            chai.expect(fn).to.endsWith('.zip');
        });

        it('export_document_html()', function() {
            this.timeout(10000);
            var result = sd.new_document('doc title', 'doc description', 'editor', 'draft', user_data);
            var document_id = result['documentId'];
            var templates = sd.list_templates();
            var fn = sd.export_document(document_id, user_id='ajung', format='html', template_id=templates[0]['id']);
            chai.expect(fn).to.endsWith('.zip');
        });

        it('export_document_docx()', function(done) {
            this.timeout(10000);
            var result = sd.new_document('doc title', 'doc description', 'editor', 'draft', user_data);
            var document_id = result['documentId'];
            var templates = sd.list_templates();
            var fn = sd.export_document(document_id, user_id='ajung', format='docx', template_id=templates[0]['id']);
            chai.expect(fn).to.endsWith('.docx');
            done();
        });

    });
    
});
