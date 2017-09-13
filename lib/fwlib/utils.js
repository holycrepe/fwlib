"use strict";

/**
 * @module utils
 */
define("fwlib/utils",
    [
        "dojo/json",
        "fwlib/underscore"
    ],
    /**
     *
     * @param JSON
     * @param {_.LoDashStatic} _
     */
    function(JSON,_)
{

    var _types = {
        Date: Date,
        File: File,
        JSON: JSON
    };
    try {
        _types.console = console;
    } catch (ex) {

    }

    var pendingLogEvents = [];

    var isArray = this.isArray = (Array.isArray || function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    });


    // =======================================================================
    /**
     *
     * @param section {string|string[]}
     * @param [verbosity] {number|boolean}
     * @param [defaultLogLevel] {number|boolean}
     * @lends fwlib.utils.Logger
     * @constructor
     * @memberOf module:utils
     */
    function Logger(section, verbosity, defaultLogLevel) {
        if (typeof verbosity === 'undefined')
            verbosity = -1;

        if (typeof defaultLogLevel === 'undefined')
            defaultLogLevel = 4;

        /** @type {string[]} **/
        var sections = typeof section === 'string' ? [section] : section.concat();
        var groups = [];
        var prefixes = sections.slice();
        var self = this;
        var createLogger = function (defaultLevel) {
            return function(level, message) {
                var messages = [].slice.call(arguments, 0);
                loggerImpl.call(self, prefixes, verbosity, defaultLevel, messages);
            };
        };
        var updatePrefixes = function() {
            prefixes = sections.concat(groups);
        };
        this.group = function(name) {
            groups.push(name);
            updatePrefixes();
        };
        this.ungroup = function() {
            groups.pop();
            updatePrefixes();
        };
        this.noop = noop;
        this.important = createLogger(-1);
        this.error = createLogger(1);
        this.warn = createLogger(2);
        this.debug = createLogger(10);
        this.info = createLogger(3);
        if (verbosity === 0 || verbosity === false)
        {
            this.log = noop;
            return;
        }
        this.log = createLogger(defaultLogLevel);
    }


// =======================================================================
        /**
         *
         * @param extension {fwlib.ExtensionInfo}
         * @param [cmdName] {string}
         * @param cmdTitle
         * @return {fwlib.ExtensionCommand}
         */
        function getCommand(extension, cmdName, cmdTitle) {
            var api = extension.api,
                title = extension.title,
                methods = extension.methods,
                logger = new Logger([title, cmdName], 1),
                log = logger.log;
            var command,
                methodNames;
            if (methods.hasOwnProperty(cmdTitle)) {
                command = methods[cmdTitle];
                if (typeof command === 'function') {
                    log("Explicitly Mapped Command Method: " + cmdTitle);
                    return {
                        name:   cmdTitle,
                        method: command
                    };
                }
            }

            if (command) {
                log("Explicitly Mapped Command Name: " + cmdTitle + " == [" + (typeof command) +"] " + command);
                methodNames = [command];
            } else {
                command = cmdTitle.replace(/[ ]+/g, '');
                log("Unmapped Command: " + cmdTitle + " == " + command);
                methodNames = [
                    cmdTitle,
                    command,
                    toCamelCase(cmdTitle),
                    toCamelCase(capitalizeWords(cmdTitle))
                ];
            }

            if (typeof api !== "object") {
                return {
                    name:  cmdTitle,
                    error: "Error loading Command Library API for '" + title
                };
            }

            //logify("Command Method Names for " + cmdTitle, methodNames);
            for (var i = 0, j = methodNames.length; i < j; i++) {
                var methodName = methodNames[i];
                if (api.hasOwnProperty(methodName)) {
                    return {
                        action: command,
                        name: methodName,
                        method: api[methodName]
                    };
                }
            }
            return {
                name: command,
                error: 'No command method found'
            }
        }

    // =======================================================================
    /**
     *
     * @param extension {fwlib.ExtensionInfo}
     * @param [cmdName] {string}
     * @return {*}
     */
    function runCommandImpl(extension, cmdName) {
        cmdName = cmdName || extension.state.command.name;
        if (!cmdName)
            return "No command specified";
        var match = cmdName.match(/(.+)\.jsf$/);
        if (!match)
            return "Could not parse filename of command script";
        var title = extension.title,
            cmdTitle = match[1],
            logger = new Logger([title, cmdTitle]),
            log = logger.log;

        log("Running Command");

        var command = getCommand(extension, cmdName, cmdTitle);
        if (command.error) {
            return command.error;
        }
        var func = command.method;
        if (typeof func !== "function")
            return "Specified command '" + command.name + "' was not found on " + title;
        func();
        return true;
    }

    // =======================================================================
    /**
     *
     * @param extension {fwlib.ExtensionInfo}
     * @param [cmdName] {string}
     * @return {*}
     */
    function runCommand(extension, cmdName) {
        var state = extension.state = extension.state || {};
        var command = state.command = state.command || {};
        if (cmdName)
            command.name = cmdName;
        var result = runCommandImpl(extension, cmdName);
        if (result !== true) {
            alert("Error running " + extension.title + " Command `" + command.name + "`: " + result);
        }
        return result;
    }

	// =======================================================================
    function update(
        inTarget)
    {
        inTarget = inTarget || {};

        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];

            if (typeof source !== "undefined" && source !== null) {
                for (var name in source) {
                    if (!source.hasOwnProperty(name))
                        continue;
                    inTarget[name] = source[name];
                }
            }
        }

        return inTarget;
    }


    // =======================================================================
    function copyObject(
        inObject)
    {
        if (typeof inObject === "object" && inObject !== null) {
            return eval("(" + inObject.toSource() + ")");
        } else {
            return inObject;
        }
    }

    function stringify(data) {
        var JSON = _types.JSON;
        return JSON.stringify(data, null, "\t");
    }

    function clone(obj) {
        var JSON = _types.JSON;
        return JSON.parse(JSON.stringify(obj));
    }

    function logify(header, data) {
        if (typeof header !== "string") {
            data = header;
            header = null;
        }
        var message = (header ? header + ": \n" : "") + stringify(data);
        return log(message);
    }

    function log(message) {
        //return;
        var c,
            timestamp=false,
            success=true;
        if (!_types.hasOwnProperty('console')) {
            try {
                //noinspection JSUnusedAssignment
                c = _types.console = console;
            }
            catch (ex) {
                success = false;
            }
        } else {
            c = _types.console;
            if (typeof c !== "object")
                success = false;
        }
        if (!success)
            return;
        var args = [].slice.call(arguments);
        if (args.length) {
            if (!success || pendingLogEvents.length) {
                timestamp = true;
            }
            if (timestamp && false) {
                if (typeof message === "string") {
                    message = "[" + this.getTimestamp() + "] " + message;
                }
            }
            args[0] = message;
            pendingLogEvents.push(args);
        }
        if (!success) {
            return false;
        }
        while (pendingLogEvents.length > 0) {
            var logEvent = pendingLogEvents.splice(0, 1)[0];
            var isLogArray    = isArray(logEvent);
            if (isLogArray) {
                if (logEvent.length === 0) {
                    continue;
                }
                if (logEvent.length > 1) {
                    //alert('Logger Impl - Log - Ev 1');
                    try {
                        c.log.apply(this, logEvent);
                    } catch (ex) {

                    }
                    continue;
                    //var oldLogEvent = logEvent;
                    //try {
                    //    logEvent = [logEvent.join(" ")];
                    //} catch (ex) {
                    //    //alert("LogArray Event [" + typeof oldLogEvent + "]\n\n" + oldLogEvent);
                    //}
                }
                logEvent = logEvent[0];
            }
            try {
                c.log("  " + logEvent);
            } catch (ex) {
                //alert("Log Event\n\n" + logEvent);
            }
        }
        //console.log.call(args);
        //alert('Logger Impl - Log - 2');
        return true;
    }

    /**
     *
     * @param prefixes {string[]}
     * @param [verbosity] {number}
     * @param [defaultLogLevel] {number|boolean}
     * @param [args] {string[]}
     * @return {boolean}
     */
    function loggerImpl(prefixes, verbosity, defaultLogLevel, args) {
        if (verbosity === 0 || verbosity === false)
            return false;
        var level = defaultLogLevel;
        /** @type {any[]} **/
        var messages = args || [];

        if (messages.length && typeof messages[0] === 'number') {
            level = messages.splice(0,1)[0];
        }

        if (verbosity >= 0 && level >= 0 && level > verbosity) {
            return false;
        }
        var prefix = prefixes.join(': ');
        if (messages.length)
            prefix += ': ';
        return log.apply(this, [prefix].concat(messages));
    }

    /**
     *
     * @param section {string|string[]}
     * @param [verbosity] {number|boolean}
     * @param [defaultLogLevel] {number|boolean}
     * @return {module:utils.Logger}
     */
    function getLogger(section, verbosity, defaultLogLevel) {
        return new Logger(section, verbosity, defaultLogLevel);
    }

    function noop(message, returnValue) {
        return returnValue !== false;
    }

    function proxify(obj) {
        obj = obj || fw.getDocumentDOM();
        if (!obj)
            return;
        var domKeys=[], domBadKeys=[], domProxy = {};
        for (var key in obj) {
            if (!obj.hasOwnProperty(key))
                continue;
            domKeys.push(key);
            //var value = obj[key];
            try {
                domProxy[key] = obj[key];
            }
             catch (ex) {
                 domBadKeys.push(key);
             }
            //alert(key + ": " )
        }
        //alert(domBadKeys.join("\n"));
        log(stringify(domProxy));
        return domProxy;
    }

    function proxifyDom(dom) {
        dom = dom || fw.getDocumentDOM();
        return proxify(dom)
    }
    function toCamelCase(subject) {
        var result = subject[0].toLowerCase() + subject.slice(1);
        result = result.replace(/[ \-:]/g, '');
        return result;
    }

    function capitalizeFirstLetter(subject) {
        return subject[0].toUpperCase() + subject.slice(1);
    }
    function capitalize(subject) {
        return subject[0].toUpperCase() + subject.slice(1).toLowerCase();
    }

    function capitalizeWords(subject) {
        return _.map(subject.split(' '), capitalize)
                .join(' ');
    }


    //noinspection JSUnusedLocalSymbols
    function dump(obj) {
        var output = "Dumping " + obj + "\n\n";
        for (var i in obj) {
            if (!obj.hasOwnProperty(i))
                continue;
            output += obj + '.' + i + " (" + typeof(obj[i]) + ") = " + obj[i] + "\n";
        }
        alert(output);
    }

    //noinspection JSUnusedLocalSymbols
    function benchmark(func) {
        // CS3: 1000x1000 canvas, transparent bg
        // object is a simple rectangle with plain fill
        // objects are not grouped
        //
        // resize v2: inverse loop
        // resize v3: don't remember selections
        // resize v4: remember selections, traverse groups
        // resize v5: remember selections, traverse groups, resizeSelection
        //
        // Objects      Operation       Time (ms), CS3      Time (ms), CS5
        // ===============================================================
        //   1          resize                 2
        //   2          resize                 3
        //   4          resize                 8
        //   8          resize                21
        //  16          resize                65
        //  32          resize               245
        // 100          resize              3644                  4075
        // 200          resize             16633                 23910
        // 400          resize             94193                146241 (crash)
        //              resize v2          80439
        //              resize v3           1402
        //              resize v4           1856
        //              resize v5           1473                  1652

        var start = new Date();
        func.call();
        var end = new Date();
        alert(end - start);
    }

    fw.modules = fw.modules || {};
    fw.modules.JSON = JSON;
    fw.modules._ = _;

	return fw.modules.utils = fw.utils = {
	    Logger: Logger,
        runCommand: runCommand,
        update: update,
        copyObject: copyObject,
        clone: clone,
        log: log,
        noop: noop,
        getLogger: getLogger,
        stringify: stringify,
        logify: logify,
        toCamelCase: toCamelCase,
        capitalizeFirstLetter: capitalizeFirstLetter,
        capitalize: capitalize,
        capitalizeWords: capitalizeWords,
        proxifyDom: proxifyDom,
        proxify: proxify,
        dump: dump,
        benchmark: benchmark,
        isArray: isArray,
        /**
         *
         * @returns {string}
         */
        getTimestamp: function() {
            var date = this.getDate();
            return date
                ? date.toTimeString().split(" ")[0]
                : "?????";
        },
        getDate: function (arg) {
            var Date = _types.Date;
            if (typeof Date !== "function") {
                log("Invalid Date object: " + Date + ": " + typeof Date);
                return;
            }
            if (!arguments.length)
                return new Date();
            var date;
            try {
                date = new Date(arg);
                return date;
            } catch (ex) {
                log("Error creating date from " + arg + ": " + ex);
            }
        },
        getFile: function (path) {
            return new _types.File(path);
        }
    };
});
