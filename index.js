/*
 *  @Soldy\nanoTestOutpitCli\2021.02.04\GPL3
 */
'use strict';
const styler = new (require('consolestylerc')).base();
const stdio = new (require('consolestdiorc')).base();
const bar = new (require('consolebarrc')).base();

/*
 * @param {object} resultIn 
 * @param {setuprc} setupIn 
 * @prototype
 */
const screenBase = function(resultIn, setupIn){
    /*
     * @param {object} resultIn
     * @param {object} testrIn // Last test object
     * @param {any} sample
     * @public
     * boolean
     */
    this.change = function(resultIn,testIn){
        result = resultIn;
        processing();
        if(typeof testIn !== 'undefined'){
            tests.push(testIn);
            if(testIn.error !== false)
                debugs.push(testIn.error);
        }
    };
    /*
     * @public
     */
    this.end = function(){
        if(debugs.length >0){
            for(let i in debugs)
                debug(debugs[i]);
            stdio.printLn('============');
        }
        for(let i in tests)
            if(tests[i].result === 1){
                ok(tests[i]);
            }else if(tests[i].result === 2){
                fail(tests[i]);
            }else if(tests[i].result === 3){
                error(tests[i]);
            }else if(tests[i].result === 4){
                missing(tests[i]);
            }

        stdio.printLn(
            'all : ' +  
            styler.style(
                result.all.toString(), 
                {color: 'gray'}
            )+ ' | ok : ' +  
            styler.style(
                result.ok.toString(), 
                {color: 'green'}
            )+ ' | failed : ' + 
            styler.style(
                result.fail.toString(),
                {color: 'red'} 
            )+ ' | error : ' + 
            styler.style(
                result.error.toString(), 
                {color: 'yellow'} 
            )+ ' | missing : ' + 
            styler.style(
                result.missing.toString(),
                {
                    color: 'blue'
                }
            )
        );
        stdio.printLn('test time : '+result.time+'ms');
        process.stderr.write('\x1B[?25h');
    };
    /*
     * @private
     * @var {array}
     */
    let debugs = [];
    /*
     * @private
     * @var {array}
     */
    let tests = [];
    /*
     * @private
     */
    const processing = function (){
        let progress = result.all-(
            result.ok+
            result.fail+
            result.error
        );
        if (setup.get('progressBar') !== false){
            bar.update({
                'name'   : 'progress',
                'update' : {
                    '1' : progress,
                    '2' : result.ok,
                    '3' : result.fail,
                    '4' : result.error
                }
            });
            stdio.cursorUp(4);
            bar.draw('progress');
        }
        if(timeout !== ''){
            clearTimeout(timeout);
            timeout='';
        }
    };
    /*
     * @param {object}
     * @private
     */
    const ok = function(test){
        stdio.printLn(
            styler.style(
                '✓ ', 
                {color: 'green'}
            ) + test.name + ' : ok -- '  + test.time + ' ms '
        );
    };
    /*
     * @param {object}
     * @private
     */
    const fail = function (test){
        stdio.printLn(
            styler.style(
                '✗ ', 
                {color: 'red'}
            ) + test.name + 
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
    const error = function (test) {
        stdio.printLn(
            styler.style(
                '! ', 
                {color: 'yellow'}
            ) + test.name + ' : --- error'
        );
    };
    /*
     * @param {object}
     * @private
     */
    const missing = function (test){
        stdio.printLn(
            styler.style(
                '! ', 
                {color: 'blue'}
            ) + test.name + ' : --- missing'
        );
    };
    /*
     * @param {object}
     * @private
     */
    const debug = function(debugIn){
        stdio.printLn('====');
        let lines = debugIn.stack.split('\n');
        let first = lines[0].split(':');
        stdio.printLn(
            styler.style(
                first[0],
                {
                    color: 'yellow'
                }
            )+' : '+
            first[1]
        );
        let tree = '┣━ ';
        if (setup.get('debugPrint') === 'short'){
            let pieces = lines[1].split(':');
            tree = '┗━ ';
            stdio.printLn(
                pieces[0]
                    .replace('   at ', tree)
                    .replace(process.cwd()+'/', ' ')+' | '+
                styler.style(
                    parseInt(pieces[1]).toString(),
                    {
                        color : 'cyan'
                    }
                )+':'+
                styler.style(
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
                stdio.printLn(
                    pieces[0]
                        .replace('   at ', tree)
                        .replace(process.cwd()+'/', ' ')+' | '+
                    styler.style(
                        parseInt(pieces[1]).toString(),
                        {
                            color : 'cyan'
                        }
                    )+':'+
                    styler.style(
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
    const init = function(){
        process.stderr.write('\x1B[?25l');
        stdio.printLn('\n\n\n');
        if (setup.get('progressBar') === false)
            return true;
        bar.init({
            'name':'progress',
            'max' : result.all 
        });
        bar.addLine({
            'bar'         : 'progress',
            'id'          : '1',
            'title'       : 'not tested',
            'color'       : 'blue'
        });
        bar.addLine({
            'bar'    : 'progress',
            'id'     : '2',
            'title'  : 'ok',
            'color'  : 'green'
        });
        bar.addLine({
            'bar'    : 'progress',
            'id'     : '3',
            'title'  : 'failed',
            'color'  : 'red'
        });
        bar.addLine({
            'bar'    : 'progress',
            'id'     : '4',
            'title'  : 'error',
            'color'  : 'yellow'
        });
    };
    /*
     * @private
     * @var {string}
     */
    let timeout = '';
    /*
     * @private
     * @var {object}
     */
    let result = {
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
    const setup = setupIn;
    if (typeof resultIn !== 'undefined')
        result = resultIn;
    init();
};

exports.base=screenBase;
