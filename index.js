/*
 *  @Soldy\nanoTestOutpitCli\2021.02.04\GPL3
 */
'use strict';
const $styler = new (require('consolestylerc')).base();
const $stdio = new (require('consolestdiorc')).base();
const $error = new (require('errorrc')).base();
const $bar = new (require('consolebarrc')).base();

/*
 * @param {object} resultIn 
 * @param {setuprc} setupIn 
 * @prototype
 */
const screenBase = function(result_in,  setup_in){
    /*
     * @param {object} resultIn
     * @param {object} testrIn // Last test object
     * @public
     * boolean
     */
    this.change = function(result_in,test_in){
        return _change(result_in, test_in);
    };
    /*
     * @public
     */
    this.end = function(result){
        return _end(result);
    };
    /*
     * @private
     * @var {array}
     */
    let _debugs = [];
    /*
     * @private
     * @var {array}
     */
    let _tests = [];
    /*
     * @private
     * @var {integer}
     */
    let _result_serial=0;
    /*
     * @private
     * @var {string}
     */
    let _timeout = '';
    /*
     * @private
     * @var {object}
     */
    let _result = {
        all: 0,
        ok: 0,
        fail: 0,
        error: 0,
        missing: 0
    };
    /*
     * @param {object} resultIn
     * @param {object} testrIn // Last test object
     * @private
     * boolean
     */
    const _change = function(result_in,test_in){
        _result = result_in;
        _processing();
        if(typeof test_in !== 'undefined'){
            _tests.push(test_in);
            if(test_in.error !== false)
                _debugAdd(test_in);
        }
    };
    /*
     * @private
     */
    const _resultSerial = function(){
        if (_setup.get('serialize') !== true)
            return '';
        return (
            ' '+
            _result_serial.toString()+
            '.'
        );
    }
    /*
     * @private
     */
    const _processing = function (){
        let _progress = _result.all-(
            _result.ok+
            _result.fail+
            _result.error
        );
        if (_setup.get('progress_bar') === true){
            $bar.update({
                'name'   : 'progress',
                'update' : {
                    '1' : _progress,
                    '2' : _result.ok,
                    '3' : _result.fail,
                    '4' : _result.error
                }
            });
            $stdio.cursorUp(4);
            $stdio.print(
                $bar.draw('progress')
            );
        }
        if(_timeout !== ''){
            clearTimeout(_timeout);
            _timeout='';
        }
    };
    /*
     * @param {integer}
     * @private
     * @return {string}
     */
    const _time = function(time){
        let color = 'blue';
        if(time > 500){
            color = 'red';
        }else if(time > 300){
            color = 'magenta';
        }else if(time > 100){
            color = 'yellow';
        }else if(time > 50){
            color = 'green';
        }else if(time > 5){
            color = 'cyan';
        }
        return $styler.style(
            (
                ' ( '+
                time.toString()+
                'ms )'
            ),
            {color}
        );
    };
    /*
     * @param {object}
     * @private
     */
    const _ok = function(test){
        $stdio.printLn(
            _resultSerial()+
            $styler.style(
                '  ✓ ', 
                {color: 'green'}
            ) +
            $styler.style(
               test.name,
                {color: 'grey'}
            ) +
            _time(test.time)
        );
    };
    /*
     * @param {object}
     * @private
     */
    const _fail = function (test){
        let out =(
            _resultSerial()+
            $styler.style(
                '  ✗ ',
                {color: 'red'}
            ) +
            $styler.style(
                test.name,
                {color: 'magenta'}
            )
        );
        if(JSON.stringify(test.sample) !== JSON.stringify(test.value))
            out += (
               ' : '+
               test.sample +
               '  --- value --- ' +
               JSON.stringify(test.value)
            );
        $stdio.printLn(out );
    };
    /*
     * @param {object}
     * @private
     */
    const _error = function (test) {
        $stdio.printLn(
            _resultSerial()+
            $styler.style(
                '  ! ',
                {color: 'yellow'}
            ) +
            $styler.style(
                test.name,
                {color: 'yellow'}
            )
        );
    };
    /*
     * @param {object}
     * @private
     */
    const _missing = function (test){
        $stdio.printLn(
            _resultSerial()+
            $styler.style(
                '  ? ',
                {color: 'blue'}
            ) +
            $styler.style(
                test.name,
                {color: 'cyan'}
            )
        );
    };
    /*
     * @param {object}
     * @private
     */
    const _debugAdd = function(test_in){
        if(test_in.error !== false)
             _debugs.push({
                 'serial' : (_tests.length - 1),
                 'name'   : test_in.name,
                 'error'  : test_in.error
             });
    }
    /*
     * @private
    */
    const _finalDebugList = function(){
        $error.setup({
              'format' : _setup.get('debug_print')
        });
        if(_debugs.length >0){
            for(let i of _debugs){
                $stdio.printLn('====');
                $stdio.printLn(
                    ' '+
                    (i.serial+1).toString()+
                    '. '+
                    i.name
                );
                $stdio.printLn(
                    $error.format(i.error)
                );
            }
            $stdio.printLn('============');
        }
    }
    /*
     * @private
    */
    const _finalTestList = function(){
        _result_serial = 0;
        for(let i of _tests){
            _result_serial++;
            if(i.result === 1){
                _ok(i);
            }else if(i.result === 2){
                _fail(i);
            }else if(i.result === 3){
                _error(i);
            }else if(i.result === 4){
                _missing(i);
            }
        }
    };
    /*
     * @private
     *
    */
    const _finalResult = function(){
        $stdio.printLn(
            'all : ' +  
            $styler.style(
                _result.all.toString(), 
                {color: 'gray'}
            )+ ' | ok : ' +  
            $styler.style(
                _result.ok.toString(), 
                {color: 'green'}
            )+ ' | failed : ' + 
            $styler.style(
                _result.fail.toString(),
                {color: 'red'} 
            )+ ' | error : ' + 
            $styler.style(
                _result.error.toString(), 
                {color: 'yellow'} 
            )+ ' | missing : ' + 
            $styler.style(
                _result.missing.toString(),
                {
                    color: 'blue'
                }
            )
        );
    };
    /*
     * @param {boolean}
     * @private
     *
    */
    const _finalReport = function(result){
        if (result === true)
            return $stdio.printLn(
                $styler.style(
                    (
                        ' passed in '+
                         _result.time+
                        ' ms'
                    ),
                    {color: 'green'}
                )
            );
        if (result === false)
            return $stdio.printLn(
                $styler.style(
                    (
                        ' failed in '+
                         _result.time+
                        ' ms'
                    ),
                    {color: 'red'}
                )
            );
        return $stdio.printLn(
            ' test time : '+
            _result.time+
            ' ms'
        );


    }
    /*
     * @private
     */
    const _end = function(result){
         _finalDebugList();
         _finalTestList();
         _finalResult();
         _finalReport(result);
    }
    /*
     * @private
     */
    const _init = function(){
        //        process.stderr.write('\x1B[?25l');
        if (_setup.get('progress_bar') === false)
            return true;
        $stdio.printLn('\n\n\n');
        $bar.setup({
            'max' : _result.all
        });
        $bar.add({
            'id'     : '1',
            'title'  : 'not tested',
            'color'  : 'blue'
        });
        $bar.add({
            'id'     : '2',
            'title'  : 'ok',
            'color'  : 'green'
        });
        $bar.add({
            'id'     : '3',
            'title'  : 'failed',
            'color'  : 'red'
        });
        $bar.add({
            'id'     : '4',
            'title'  : 'error',
            'color'  : 'yellow'
        });
        $stdio.print(
            $bar.draw()
        );
    };
    /*
     * @private
     * @var {setuprc}
     */
    const _setup = setup_in;
    if (typeof result_in !== 'undefined')
        _result = result_in;
    _init();
};

exports.base=screenBase;
