
const setupBase = (require('setuprc')).base;
const nanoTest  = new (require('nanoTest')).test({
    'debugPrint' : 'short'
});
const setupTest = new setupBase({
    'debugPrint':{
        'type'    : 'select',
        'list'    : [
            'normal',
            'short'
        ],
        'default' : 'normal'
    },
    'exitCodeFail':{
        'type'    : 'select',
        'list'    : [
            '1',
            '0',
        ],
        'default' : '1'
    },
    'exitCodeError':{
        'type'    : 'select',
        'list'    : [
            '1',
            '0',
        ],
        'default' : '1'
    },
    'exitCodeMissing':{
        'type'    : 'select',
        'list'    : [
            '1',
            '0',
        ],
        'default' : '1'
    },
    'progressBar':{
        'type'    : 'bool',
        'default' : true
    }
});

setupTest.setup({
    'progressBar':false
})
const screen = new (require('./index.js')).base({},setupTest);
nanoTest.run();
