var chai = require('chai');
chai.use(require('chai-string'));
var SMASHDOCs = require('../api');

describe('SmashdocsTests', function() {

    var client_id = process.env.SMASHDOCS_CLIENT_ID;
    var client_key = process.env.SMASHDOCS_CLIENT_KEY;
    var partner_url = process.env.SMASHDOCS_PARTNER_URL;
    var debug = process.env.SMASHDOCS_DEBUG;
    var group_id = 'sample-grp';
    var sd = new SMASHDOCs(partner_url, client_id, client_key, group_id, debug);
        
    var user_data = {
        'firstname': 'Hans',
        'lastname': 'Schlumpf',
        'email': 'foo@bar.org',
        'company': 'The Foo Company',
        'userId': 'schlumpf'
    };

    function new_doc() {
        var result = sd.new_document('doc title', 'doc description', 'editor', 'draft', user_data);
        return result['documentId'];
    }

    describe('SMASHDOCs API tests', function() {
        it('new_document()', function() {
            var result = sd.new_document('doc title', 'doc description', 'editor', 'draft', user_data);
            chai.expect(result).to.have.any.keys('documentId', 'documentAccessLink');            
        });

        it('document_info()', function() {
            var document_id = new_doc();
            var info = sd.document_info(document_id);
            chai.expect(info).to.have.any.keys('title', 'description', 'status');            
        });

        it('delete_document()', function() {
            var document_id = new_doc();
            sd.delete_document(document_id);
            chai.expect(function() {sd.delete_document(document_id)}).to.throw(Error);
        });

        it('archive_document()', function() {
            var document_id = new_doc();
            sd.archive_document(document_id);
            sd.unarchive_document(document_id);
            chai.expect(function() {sd.unarchive_document(document_id)}).to.throw(Error);
        });

        it('review_document()', function() {
            var document_id = new_doc();

            var document_info = sd.document_info(document_id);
            chai.expect(document_info['status']).to.equal('draft');

            sd.review_document(document_id);

            var document_info2 = sd.document_info(document_id);
            chai.expect(document_info2['status']).to.equal('review');
        });

        it('export_document_sdxml()', function() {
            this.timeout(10000);
            var document_id = new_doc();
            var templates = sd.list_templates();
            var fn = sd.export_document(document_id, user_id='ajung', format='sdxml', template_id=templates[0]['id']);
            chai.expect(fn).to.endsWith('.zip');
        });

        it('export_document_html()', function() {
            this.timeout(10000);
            var document_id = new_doc();
            var templates = sd.list_templates();
            var fn = sd.export_document(document_id, user_id='ajung', format='html', template_id=templates[0]['id']);
            chai.expect(fn).to.endsWith('.zip');
        });

        it('export_document_docx()', function(done) {
            this.timeout(10000);
            var document_id = new_doc();
            var templates = sd.list_templates();
            var fn = sd.export_document(document_id, user_id='ajung', format='docx', template_id=templates[0]['id']);
            chai.expect(fn).to.endsWith('.docx');
            done();
        });

        it('update_metadata()', function() {
            var document_id = new_doc();
            sd.update_metadata(document_id, {title: 'bar'});
            var di = sd.document_info(document_id);
            chai.expect(di['title']).equal('bar');
        });

        it('upload_docx()', function() {
            sd.upload_document('test.docx', 'title', 'description', 'editor', user_data);
        });

    });
    
});
