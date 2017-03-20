var api = require('../api');

var client_id = process.env.SMASHDOCS_CLIENT_ID;
var client_key = process.env.SMASHDOCS_CLIENT_KEY;
var partner_url = process.env.SMASHDOCS_PARTNER_URL;
var debug = process.env.SMASHDOCS_DEBUG;
var group_id = 'sample-grp';
var sd = new api(partner_url, client_id, client_key, group_id, debug);

console.log(sd.get_documents('', ''));
console.log(sd.get_documents('', 'schlumpf'));

console.log(sd.get_documents('foo', ''));
