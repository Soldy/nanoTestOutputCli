/*
 *  @Soldy\nanoTestOutpitCli\2021.02.04\GPL3
 */
'use strict';
const $styler = new (require('consolestylerc')).base();
const $stdio = new (require('consolestdiorc')).base();
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
     * @param {any} sample
     * @public
     * boolean
     */
    this.change = function(result_in,test_in){
        _result = result_in;
        _processing();
        if(typeof test_in !== 'undefined'){
            _tests.push(test_in);
            if(test_in.error !== false)
                _debugs.push(test_in.error);
        }
    };
    /*
     * @public
     */
    this.end = function(){
        if(_debugs.length >0){
            for(let i of _debugs)
                _debug(i);
            $stdio.printLn('============');
        }
        for(let i of _tests)
            if(i.result === 1){
                _ok(i);
            }else if(i.result === 2){
                _fail(i);
            }else if(i.result === 3){
                _error(i);
            }else if(i.result === 4){
                _missing(i);
            }

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
        $stdio.printLn(
            'test time : '+
            _result.time+
            'ms'
        );
        //        process.stderr.write('\x1B[?25h');
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
     */
    const _processing = function (){
        let _progress = _result.all-(
            _result.ok+
            _result.fail+
            _result.error
        );
        if (_setup.get('progressBar') === true){
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
        $stdio.printLn(
            $styler.style(
                '  ✗ ',
                {color: 'red'}
            ) +
            $styler.style(
                test.name,
                {color: 'magenta'}
            ) +
            ' : ' +
            test.sample +
            '  --- value --- ' +
            JSON.stringify(test.value)
        );
    };
    /*
     * @param {object}
     * @private
     */
    const _error = function (test) {
        $stdio.printLn(
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
    const _debug = function(debug_in){
        $stdio.printLn('====');
        let lines = debug_in.stack.split('\n');
        let first = lines[0].split(':');
        $stdio.printLn(
            $styler.style(
                first[0],
                {
                    color: 'yellow'
                }
            )+' : '+
            first[1]
        );
        let tree = '┣━ ';
        if (_setup.get('debugPrint') === 'short'){
            let pieces = lines[1].split(':');
            tree = '┗━ ';
            $stdio.printLn(
                pieces[0]
                    .replace('   at ', tree)
                    .replace(process.cwd()+'/', ' ')+' | '+
                $styler.style(
                    parseInt(pieces[1]).toString(),
                    {
                        color : 'cyan'
                    }
                )+':'+
                $styler.style(
                    parseInt(pieces[2]).toString(),
                    {
                        color : 'cyan'
                    }
                )+' )'
            );
        }else 
            for(let i = 1; lines.length > i ; i++){
                let pieces = lines[i].split(':');
                if(i === lines.length-1)
                    tree = '┗━ ';
                $stdio.printLn(
                    pieces[0]
                        .replace('   at ', tree)
                        .replace(process.cwd()+'/', ' ')+' | '+
                    $styler.style(
                        parseInt(pieces[1]).toString(),
                        {
                            color : 'cyan'
                        }
                    )+':'+
                    $styler.style(
                        parseInt(pieces[2]).toString(),
                        {
                            color : 'cyan'
                        }
                    )+' )'
                );
            }
    };

    /*
     * @private
     */
    const _init = function(){
        //        process.stderr.write('\x1B[?25l');
        $stdio.printLn('\n\n\n');
        if (_setup.get('progressBar') !== true)
            return true;
        $bar.setup({
            'max' : _result.all
        });
        $bar.add({
            'id'          : '1',
            'title'       : 'not tested',
            'color'       : 'blue'
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
     * @private
     * @var {setuprc}
     */
    const _setup = setup_in;
    if (typeof result_in !== 'undefined')
        _result = result_in;
    _init();
};

exports.base=screenBase;
