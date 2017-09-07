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
     * @param {module:underscore} _
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
    function update(
        inTarget)
    {
        inTarget = inTarget || {};

        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];

            if (typeof source != "undefined" && source !== null) {
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
        if (typeof inObject == "object" && inObject !== null) {
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
                    c.log.apply(this, logEvent);
                    continue;
                }
                logEvent = logEvent[0];
            }
            try {
                c.log(logEvent);
            } catch (ex) {

            }
        }
        //console.log.call(args);
        return true;
    }

    function proxifyDom(dom) {
        dom = dom || fw.getDocumentDOM();
        return proxyify(dom)
    }
    function proxify(obj) {
        obj = obj || fw.getDocumentDOM();
        if (!obj)
            return;
        var domKeys=[], domBadKeys=[], domProxy = {};
        for (var key in obj) {
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

    function toCamelCase(subject) {
        var result = subject[0].toLowerCase() + subject.slice(1);
        result = result.replace(/[ \-:]/g, '');
        return result;
    }

    function capitalizeFirstLetter(subject) {
        return subject[0].toUpperCase() + subject.slice(1);
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
        update: update,
        copyObject: copyObject,
        clone: clone,
        log: log,
        stringify: stringify,
        logify: logify,
        toCamelCase: toCamelCase,
        capitalizeFirstLetter: capitalizeFirstLetter,
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
