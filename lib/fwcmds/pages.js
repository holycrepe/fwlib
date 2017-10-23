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
	The `fwcmds/pages` module includes utility functions for working with
	files.  Where the methods accept a path parameter, you can pass in either
	a path string or an array of strings that make up the path.  The array will 
	be combined into a single string with a single / between each part of the
	path.  This means you don't have to worry about whether the substrings
	end or begin with a / when building up a path.  For example:

		files.readJSON([fw.appJsCommandsDir, "settings.json"]);

	This call works even though `fw.appJsCommandsDir` doesn't end in a /.

	@module fwcmds/pages
 @requires module:fwcmds/enums
 @requires module:fwlib/utils
*/
define([
	"fwcmds/enums",
    "fwlib/utils"
],
    /**
	 *
     * @param enums {module:fwcmds/enums}
     * @param utils {module:fwlib/utils}
     */
	function(
	enums,
	utils)
{
	var PageLocation = enums.PageLocation,
        CanvasColor = enums.CanvasColor;

    function getDom(dom) {
        return dom || fw.getDocumentDOM();
    }

    /**
     *
     * @param dom
     * @returns {PageState}
     */
    function getState(dom) {
        dom = getDom(dom);

        // clone the current page's exportOptions and settings
        var exportOptions  = utils.copyObject(dom.exportOptions),
            exportSettings = utils.copyObject(dom.exportSettings),
            guides         = utils.copyObject(dom.guides),
            state          = {
                background: dom.backgroundColor,
                number:     dom.currentPageNum,
                name:       dom.pageName,
                guides:     guides,
                size:       {
                    width:  dom.width,
                    height: dom.height
                }
            };
		state['export'] = {
            options:  exportOptions,
            settings: exportSettings,
            matte:    dom.matteColor
        };
        //noinspection JSValidateTypes
        return state;
    }

    /**
     *
     * @param {PageExportState} state
     * @param [dom]
     */
    function setExportState(state, dom) {
        dom = getDom(dom);
        // update the new page with properties from the original page and
        // the settings in the dialog
        dom.setExportOptions(state.options);
        dom.setExportSettings(state.settings);
        dom.setMatteColor(true, state.matte);
    }

    /**
     *
     * @param {PageSize} size
     * @param [dom]
     */
    function setSize(size, dom) {
        dom = getDom(dom);
        dom.width = size.width;
        dom.height = size.height;
    }

    /**
     *
     * @param {AddPageOptions} [options]
     */
    function add(options) {
        if (!fw.documents.length) {
            utils.log("Pages: Add Page: Skipping; No Documents Open");
            return;
        }
        if (!options) {
            //noinspection JSValidateTypes
            options = {};
        }
        utils.log("Pages: Add Page");

        var dom = fw.getDocumentDOM(),
            // clone the current page's exportOptions and settings
            original = getState(dom);

        utils.log("Pages: Add Page: Adding New Page");
        // add a new page and point dom at it
        dom.addNewPage();
        utils.log("Pages: Add Page: Added New Page");
        dom = fw.getDocumentDOM();

        // only set the name if it's not blank, so that FW will use the
        // default page name if the user didn't enter one
        if (options.name) {
            dom.pageName = options.name;
        }

        // update the new page with properties from the original page and
        // the settings in the dialog
        setExportState(original['export']);

        if (options.templatePath) {
            importTemplate(options.templatePath, options.name, options.copyGuides);
        } else {
            switch (options.canvas) {
                case CanvasColor.White:
                    dom.backgroundColor = "#ffffff";
                    break;

                case CanvasColor.Transparent:
                    dom.backgroundColor = "#ffffff00";
                    break;

                case CanvasColor.Custom:
                    dom.backgroundColor = options.customColor;
                    break;

                case CanvasColor.Original:
                    dom.backgroundColor = original.background;
                    break;
            }

            if (options.copyGuides) {
                insertGuides(dom, original.guides);
            }

            if (options.insertClipboard) {
                // paste the clipboard and resize the page to whatever is
                // selected, which might be nothing if what's on the clipboard
                // is something that can't be pasted into FW
                dom.clipPaste();
                dom.setDocumentCanvasSizeToSelection();
            } else {
                var newSize = options.size || original.size;
                setSize(newSize, dom);
            }
        }

        // move the page to the desired location
        switch (options.location) {
            case PageLocation.Master:	// master page
                dom.setMasterPage(dom.currentPageNum);
                break;

            case PageLocation.Start:	// start
                dom.reorderPages(dom.currentPageNum, dom.hasMasterPage()
                    ? 1
                    : 0);
                break;

            case PageLocation.Before:	// before
                dom.reorderPages(dom.currentPageNum, original.number);
                break;

            case PageLocation.End:	// end
                dom.reorderPages(dom.currentPageNum, dom.pagesCount);
                break;

            case PageLocation.Default:
            case PageLocation.After:	// after
            default:
                // ignore the after location, which is the default behavior
                break;
        }
        return dom;
    }


    // =======================================================================
    function importTemplate(
        inPath,
        inName,
        inCopyGuides)
    {
        var dom = fw.getDocumentDOM(),
            templateDom;

        // import the first page of the template
        dom.importFile(inPath, { left: 0, top: 0, right: 0, bottom: 0 }, true);

        if (!inName) {
            // use the template's name for the page if the user didn't
            // supply one
            dom.pageName = Files.getFilename(inPath).replace(/(\.fw)?\.png/i, "");
        }

        // open the template file in a hidden state so we can apply its
        // background color and size to the new page, then close the file
        templateDom = fw.openDocument(inPath, false, true);
        dom.backgroundColor = templateDom.backgroundColor;
        dom.width = templateDom.width;
        dom.height = templateDom.height;

        if (inCopyGuides) {
            insertGuides(dom, templateDom.guides);
        }

        if (dom.layers[0].name == "Layer 1" && !dom.layers[0].elems.length) {
            // the new page has a Layer 1 by default.  if the imported
            // template doesn't have a Layer 1, then the page's Layer 1 will
            // be empty.  get rid of this layer so that the dom layers will
            // match up with the template's.
            dom.deleteLayer(0);
        }

        if (dom.layers.length == templateDom.layers.length) {
            // sync the state of each layer in the page with the same layer
            // in the template
            for (var i = 0, len = dom.layers.length; i < len; i++) {
                dom.setLayerDisclosure(i, templateDom.layers[i].disclosure);
                dom.setLayerLocked(i, -1, templateDom.frames[0].layers[i].locked, false);
                dom.setLayerVisible(i, -1, templateDom.frames[0].layers[i].visible, false);
            }
        }

        templateDom.close(false);

        // importing the file seems to leave everything selected
        dom.selectNone();
    }


    // =======================================================================
    function insertGuides(
        inDom,
        inGuides)
    {
        var hGuides = inGuides.hGuides,
            vGuides = inGuides.vGuides;

        for (var i = 0, len = hGuides.length; i < len; i++) {
            inDom.addGuide(hGuides[i], "horizontal");
        }

        for (var i = 0, len = vGuides.length; i < len; i++) {
            inDom.addGuide(vGuides[i], "vertical");
        }
    }

	var pages = /** @lends module:fwcmds/pages */ {
        add: add,
        getState: getState,
        importTemplate: importTemplate,
        setExportState: setExportState,
        setSize: setSize
	};

	return pages;
});
