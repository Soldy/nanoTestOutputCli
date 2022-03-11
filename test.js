
const setupBase = (require('setuprc')).base;
const $result = {
   all: 4,
   ok: 1,
   fail: 1,
   error: 1,
   missing: 1
};
const $test_ok ={
            'name'     : 'test ok',
            'test'     : ()=>{},
            'rule'     : "===",
            'sample'   : 0,
            'ready'    : false,
            'startTime': 11111124,
            'endTime'  : 11111125,
            'time'     : 1,
            'result'   : 1,
            'error'    : false,
            'value'    : '',
            'check'    : false,
            'debug'    : '',
            'willfail' : false
};
const $test_failed ={
            'name'     : 'test ok',
            'test'     : ()=>{},
            'rule'     : "===",
            'sample'   : 0,
            'ready'    : false,
            'startTime': 11111124,
            'endTime'  : 11111125,
            'time'     : 1,
            'result'   : 2,
            'error'    : false,
            'value'    : '',
            'check'    : false,
            'debug'    : '',
            'willfail' : false
};
const $test_missing ={
            'name'     : 'test ok',
            'test'     : ()=>{},
            'rule'     : "===",
            'sample'   : 0,
            'ready'    : false,
            'startTime': 11111124,
            'endTime'  : 11111125,
            'time'     : 1,
            'result'   : 3,
            'error'    : false,
            'value'    : '',
            'check'    : false,
            'debug'    : '',
            'willfail' : false
};
const $test_error ={
            'name'     : 'test ok',
            'test'     : ()=>{},
            'rule'     : "===",
            'sample'   : 0,
            'ready'    : false,
            'startTime': 11111124,
            'endTime'  : 11111125,
            'time'     : 1,
            'result'   : 4,
            'error'    : false,
            'value'    : '',
            'check'    : false,
            'debug'    : '',
            'willfail' : false
};

const setupTest = new setupBase({
        'debug_print':{
            'type'    : 'select',
            'list'    : [
                'normal',
                'short'
            ],
            'default' : 'normal'
        },
        'progress_bar':{
            'type'    : 'bool',
            'default' : true
        },
        'exit_code_fail':{
            'type'    : 'bool',
            'default' : true
        },
        'exit_code_error':{
            'type'    : 'bool',
            'default' : true
        },
        'exit_code_missing':{
            'type'    : 'bool',
            'default' : true
        }
});

setupTest.setup({
    'progressBar':false
})
const screen = new (require('./index.js')).base($result, setupTest);
screen.change(
    $result,
    $test_ok
);
screen.change(
    $result,
    $test_failed
);
screen.change(
    $result,
    $test_missing
);
screen.change(
    $result,
    $test_error
);
screen.end();
