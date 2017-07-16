/**
 * @module utils
 */
define("fwlib/utils", [], function()
{
    var pendingLogEvents = [];
	// =======================================================================
    function update(
        inTarget)
    {
        inTarget = inTarget || {};

        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];

            if (typeof source != "undefined" && source !== null) {
                for (var name in source) {
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

    function log() {
        var args = [].slice.call(arguments);
        var c,success=true;
        try {
            //noinspection JSUnusedAssignment
            c = console;
        }
        catch (ex) {
            success=false;
        }
        if (!success || pendingLogEvents.length) {
            if (args.length === 1) {
                args[0] = utils.getDate() + ": " + args[0];
            }
        }
        pendingLogEvents.push(args);
        if (!success) {
            return;
        }
        while (pendingLogEvents.length > 0) {
            var logEvent = pendingLogEvents.splice(0, 1)[0];
            if (utils.isArray(logEvent)) {
                if (logEvent.length === 0) {
                    continue;
                }
                if (logEvent.length > 1) {
                    console.log.apply(this, logEvent);
                    continue;
                }
                logEvent = logEvent[0];
            }
            console.log(logEvent);
        }
        //console.log.call(args);
    }

    /** @lends module:utils */
	var utils =  {
    	update: update,
		copyObject: copyObject,
        log: log,
        isArray: Array.isArray || function(arg) {
            return Object.prototype.toString.call(arg) === '[object Array]';
        },
        Date: Date,
        File: File,
        getDate: function (args) {
            return new utils.Date(args);
        },
        getFile: function (args) {
            return new utils.File(args);
        }
	};

	return utils;
});
