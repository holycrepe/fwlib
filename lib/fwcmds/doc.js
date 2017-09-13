/* ===========================================================================
	
	files.js

	Copyright 2012 John Dunning.  All rights reserved.
	fw@johndunning.com
	http://johndunning.com/fireworks

	Released under the MIT license.  See the LICENSE file for details.
	Documentation is available at https://github.com/fwextensions/fwlib

   ======================================================================== */


// ===========================================================================
/**
 The `fwcmds/doc` module includes utility functions for working with
 files.  Where the methods accept a path parameter, you can pass in either
 a path string or an array of strings that make up the path.  The array will
 be combined into a single string with a single / between each part of the
 path.  This means you don't have to worry about whether the substrings
 end or begin with a / when building up a path.  For example:

 files.readJSON([fw.appJsCommandsDir, "settings.json"]);

 This call works even though `fw.appJsCommandsDir` doesn't end in a /.

 @module doc
 @requires module:fwcmds/enums
 @requires module:fwlib/utils
 @requires module:layers
 */
define([
        "fwcmds/enums",
        "fwlib/utils",
        "fwlib/layers",
        "orangecommands/main"
    ],
    /**
     *
     * @param enums {module:fwcmds/enums}
     * @param utils {module:fwlib/utils}
     * @param fwlayers {module:layers}
     * @param {OrangeCommands.OrangeCommandsStatic} orangecommands/main
     */
    function(
        enums,
        utils,
        fwlayers,
        orangecommands)
    {
        var PageLocation = enums.PageLocation,
            CanvasColor = enums.CanvasColor;

        function getDom(dom) {
            return dom || fw.getDocumentDOM();
        }

        function isEmpty() {
            if (!Document.isNew())
                return false;
            var tree = new fwlayers.LayerTree();
            var elements = tree.elements;
            return elements.length === 0;
        }

        var fwdoc = {
            getDom: getDom,
            isEmpty: isEmpty
        };

        return /** @lends module:doc */{
            getDom: getDom,
            isEmpty: isEmpty
        };
    });
