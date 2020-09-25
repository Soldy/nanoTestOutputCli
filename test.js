
const nanoTest  = new (require('nanoTest')).test({
    'debugPrint' : 'short'
});
const screen = new (require('./index.js')).screenBase();
nanoTest.run();
