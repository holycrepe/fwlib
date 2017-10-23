/**
 * @module orangecommands/main
 */
define("orangecommands/main",
    [
        "dojo/json",
        "fwlib/files",
        "fwlib/utils",
        "orangecommands/prototype"
    ],
    /**
     *
     * @param JSON
     * @param {module:fwlib/files} fwFiles
     * @param {fwlib.utils} utils
     * @param orange_proto
     */
    function (
        JSON,
        fwFiles,
        utils,
        orange_proto
    ) {
// bs.js Library
// a collection of (hopefully) useful tools for Fireworks

        var _regexPatterns = {
            processPageName: /^([A-Z]+)(?:([@])(\d+))?(?:([;])(\d+.*)?)?$/im,
            processDocName: /^(.*?)([#.])(.*)$/i
        };


        /**
         *
         * @param export_page_name {string}
         * @param [options] {Document.ExportPagesOptions}
         * @returns {Document.ExportPageNamingResult}}
         */
        function processPageName(export_page_name, options) {
            var match = _regexPatterns.processPageName.exec(export_page_name);
            var result = {
                isMain: false,
                type: "",
                separator: "",
                size: "",
                page: export_page_name,
                name: export_page_name,
                main: export_page_name,
                prioritySeparator: "",
                priority: ""
            };
            if (match === null) {
                return result;
            }
            result.type = match[1] || "";
            result.separator = match[2] || "";
            result.size = match[3] || "";
            result.prioritySeparator = match[4] || "";
            result.priority = match[5] || "";
            result.name = result.size + result.prioritySeparator + result.priority;

            var mainTypes = options.naming.mainTypes;
            var mainTypeKey = mainTypes.hasOwnProperty(result.separator)
                ? result.separator
                : 'default';

            var currentType = result.type.toLowerCase();
            var types       = mainTypes[mainTypeKey];
            for (var i = 0, j = types.length; i < j; i++) {
                var type = types[i];
                if (type.toLowerCase() === currentType) {
                    result.isMain = true;
                    break;
                }
            }
            result.main = result.name || result.type;
            return result;
        }


        var Page                = function Page () {
            var info = Pages.info();
            //noinspection JSAnnotator
            this.name = this.originalName = info.name;
            //noinspection JSAnnotator
            this.index = info.index;
            this.isMaster = Document.is_master_page();
            this.getElementCount = Pages.getElementCount;
            this.verticalTrim = Pages.vertical_trim;
            this.setName = function (newName) {
                Pages.setName(newName);
                //noinspection JSAnnotator
                this.name = newName;
            }
        };
        var orangecommands = orangecommands || {
            VERSION: "1.7-dev",
            params:  null,
            run:     function (kind, command, params) {
                // Reset params
                orangecommands.params = null;
                // runs a command with the specified parameters
                try {
                    var f = fw.appJsCommandsDir + "/" + kind + "/" + encodeURIComponent(command) + ".jsf";
                    if (params != undefined) {
                        orangecommands.params = params;
                    }
                    ;
                    fw.runScript(f);
                    orangecommands.params = null;
                } catch (exception) {
                    alert("Error running command " + kind + "/" + command + ".\n" + [
                        exception,
                        exception.lineNumber,
                        exception.fileName,
                    ].join("\n"));
                }
            },
            User: {
                getLanguage: function () {
                    var tmp  = Files.getLanguageDirectory().split("/"),
                        lang = ((tmp[tmp.length - 1]).substr(0, 2)).toLowerCase();
                    return lang;
                },
                getJSDir:    function () {
                    return fw.userJsCommandsDir;
                },
            },
            Document: {


                /**
                 *
                 * @param options {Document.RenamePagesOptions}
                 */
                renamePages: function(options) {
                    if (!options.debug)
                        options.debug = {};
                    var operationState    = {
                        page:      Pages.info(),
                        number:    0,
                        completed: 0
                    };
                    if (!options.pattern)
                        options.pattern = prompt("Enter search pattern", options.defaultPattern);
                    if (!options.pattern)
                        return false;
                    if (!options.replacement)
                        options.replacement = prompt("Enter replacement", options.defaultReplacement);
                    //noinspection JSValidateTypes
                    if (options.replacement === null)
                        return false;
                    //options.debug.options = true;
                    if (options.debug.options) {
                        utils.log("Renaming Pages:\n" +
                            "Pattern:     " + options.pattern + "\n" +
                            "Replacement: " + options.replacement);
                    }
                    var regex = new RegExp(options.pattern, 'gi');
                    //noinspection JSValidateTypes
                    /** @type {Pages.PageEnumerationOptions} **/
                    var pageEnumerationOptions = {
                        currentOnly: options.currentPageOnly,
                        skipMaster: true
                    };
                    Pages.each(
                        /** @param page {PageClass} **/
                        function (page) {
                            operationState.number++;
                            var newName = page.name.replace(regex, options.replacement);
                            options.debug.newName=true;
                            if (options.debug.newName) {
                                utils.log("New Name: " + newName);
                            }
                            page.setName(newName);
                        }, pageEnumerationOptions);
                    return true;
                },


                /**
                 *
                 * @param [options] {Document.ExportPagesOptions}
                 * @returns {Document.ExportPagesOptions}
                 */
                getExportPagesOptions: function(options) {
                    /** @type {Document.ExportPagesOptions} **/
                    options = options || {};
                    if (!options.debug)
                        options.debug = {};
                    if (!options.naming)
                        options.naming = {};
                    if (typeof options.naming.mainTypes === 'undefined') {
                        options.naming.mainTypes = {
                            'default': ['Icon'],
                            '@': ['Icon']
                        };
                    }
                    if (!options.naming.template) {
                        options.naming.template = '*prefix**separator**name*'
                    }
                    if (!options.naming.defaultType)
                        options.naming.defaultType = "Export";
                    return options;
                },
                /**
                 *
                 * @param [options] {Document.ExportPagesOptions}
                 * @returns {Document.ExportPageName}
                 */
                get_export_page_name:     function (options) {
                    options = Document.getExportPagesOptions(options);
                    //alert("get_export_page_name...");
                    if (!options.naming.page)
                        options.naming.page = fw.getDocumentDOM().pageName;
                    //log("Get Export Page Name of " + options.page);
                    return Document.get_export_file_name(options);
                },
                /**
                 *
                 * @param [options] {Document.ExportPagesOptions}
                 * @returns {Document.ExportPageName}
                 */
                get_export_file_name:     function (options) {
                    options                                   = Document.getExportPagesOptions(options);
                    var naming = options.naming;
                    var separator = (naming.separator || "-");
                    /** @type {Document.ExportPageName} **/
                    var results                               = processPageName(naming.page || "", options);
                    //options.debug.processPageName = true;
                    if (options.debug.processPageName) {
                        utils.logify("Processed Page Name", results);
                    }


                    results.document                          = Files.getFilename(fw.getDocumentPath(null)).split('.fw.png')[0].split('.png')[0];
                    var match = _regexPatterns.processDocName.exec(results.document);
                    results.docMain = match ? match[1] : results.document;

                    //options.debug.processDocName = true;
                    if (options.debug.processDocName) {
                        utils.logify("Processed Page Name", {
                            document: results.document,
                            main: results.docMain,
                            regex: match
                        });
                    }

                    //results.file = options.naming.file || results.document;
                    if (results.isMain || !naming.enableSeparator) {
                        separator = "";
                    }
                    if (naming.delimiters && typeof naming.delimiters === "string") {
                        naming.delimiters = new RegExp(naming.delimiters, 'gi');
                    }
                    var delimiters = naming.delimiters;
                    var processDelimiters = function(subject) {
                        var result = subject;
                        if (delimiters) {
                            result = result
                                .replace(delimiters, separator);

                        }
                        return result;
                    };
                    var processPathVariables = function (subject) {
                        var result = subject;
                        result = result
                            .replace(/\*type\*/i, results.type || options.naming.defaultType)
                            .replace(/\*name\*/i, results.name)
                            .replace(/\*main\*/i, results.main)
                            .replace(/\*page\*/i, results.page)
                            .replace(/\*prefix\*/i, results.prefix)
                            .replace(/\*separator\*/i, separator)
                            .replace(/\*(doc|document)\*/i, results.document)
                            .replace(/\*(docMain)\*/i, results.docMain);
                        if (separator && result.startsWith(separator)) {
                            result = result.substring(separator.length);
                        }
                        result = processDelimiters(result);
                        return result;
                    };
                    results.prefix = processPathVariables(naming.prefix);
                    results.file = naming.template
                        ? processPathVariables(naming.template)
                        : processDelimiters(results.document);
                    results.folder = processPathVariables(naming.folder);
                    //results.suffix = separator + results.name + ".png";
                    var file = results.file.replace(/[\\\/]+/g, '/');
                    var fileParts = file.split('/');
                    if (fileParts.length > 0) {
                        results.file = fileParts.pop();
                        results.folder += '/' + fileParts.join('/');
                    }
                    results.path = Files.makePathFromDirAndFile(results.folder, results.file);
                    //if (results.name)
                    //    results.path += results.suffix;
                    //utils.log("Export File Name: \nFolder: " + results.folder + "\nFile:   " + results.file + "\nPath:   " + results.path);
                    results.path = fwFiles.getAbsolutePath(results.path);
                    return results;
                },
                /**
                 *
                 * @param [options] {Document.ExportPagesOptions}
                 */
                exportAllPages: function (options) {
                    options = Document.getExportPagesOptions(options || orangecommands.params);
                    options.format = 'CURRENT';
                    //utils.log("Export Pages All 1");
                    Document.export_pages(options);
                    //utils.log("Export Pages All 2");
                },
                /**
                 *
                 * @param [options] {Document.ExportPagesOptions}
                 */
                exportMainPages: function (options) {
                    //utils.log("Export Pages Main 0");
                    options = Document.getExportPagesOptions(options || orangecommands.params);
                    options.format = 'CURRENT';
                    options.main = true;
                    //utils.log("Export Pages Main 1");
                    Document.export_pages(options);
                    //utils.log("Export Pages Main 2");
                },
                /**
                 *
                 * @param [options] {Document.ExportPagesOptions}
                 */
                exportCurrentPage: function (options) {
                    options = Document.getExportPagesOptions(options || orangecommands.params);
                    options.format = 'CURRENT';
                    options.currentPageOnly = true;
                    options.main = false;
                    Document.export_pages(options);
                },
                /**
                 *
                 * @param [options] {Document.ExportPagesOptions}
                 */
                export_pages_in:          function (options) {
                    options = Document.getExportPagesOptions(options || orangecommands.params);
                    options.naming.promptFolder = true;
                    this.export_pages(options);
                },
                /**
                 *
                 * @param [options] {Document.ExportPagesOptions}
                 */
                export_pages_with_prefix: function (options) {
                    options = Document.getExportPagesOptions(options || orangecommands.params);
                    options.naming.promptPrefix = true;

                    this.export_pages(options);
                },
                /**
                 *
                 * @param [options] {Document.ExportPagesOptions}
                 */
                export_pages:             function (options) {
                    if (!Document.is_saved()) {
                        alert("You need to save the document first!");
                        return;
                    }

                    options = Document.getExportPagesOptions(options);
                    var originalOptions = options;
                    options = utils.clone(options);
                    var naming = options.naming;
                    if (!options.simple) {
                        if (!naming.folder && naming.enableFolder) {
                            if (naming.promptFolder) {
                                naming.folder           = fw.browseForFolderURL("Choose an export folder", null);
                                naming.isAbsoluteFolder = true;
                            } else {
                                naming.autoFolder = true;
                            }
                        }
                        if (!naming.prefix && naming.enablePrefix) {
                            if (naming.promptPrefix) {
                                naming.prefix = prompt("Prefix:", null);
                            }
                        }
                    }


                    if (!naming.folder || !naming.enableFolder) {
                        naming.folder = "";
                    }
                    if (!naming.enablePrefix) {
                        naming.prefix = "";
                    }

                    if (naming.autoFolder) {
                        if (naming.folder) {
                            naming.folder += "/";
                        }
                        naming.folder += get_export_folder_name();
                    }
                    if (naming.folder) {
                        if (!naming.isAbsoluteFolder) {
                            naming.folder = Document.path() + naming.folder;
                        }
                    }

                    if (options.debug.options) {
                        utils.log("Exporting Pages:"
                            + "\r\nOriginal Options:\r\n"
                            + JSON.stringify(originalOptions, null, "\t")
                            + "\r\nFinal Options:\r\n"
                            + JSON.stringify(options, null, "\t")
                        );
                    }

                    var operationState = {
                            number: 0,
                            completed: 0
                        };
                    //noinspection JSValidateTypes
                    /** @type {Pages.PageEnumerationOptions} **/
                    var pageEnumerationOptions = {
                        currentOnly: options.currentPageOnly,
                        skipMaster: true
                    };
                    Pages.each(function () {
                        var pageOptions = JSON.parse(JSON.stringify(options));
                        operationState.page = Pages.info();
                        operationState.number++;

                        //var export_file_path =  Document.get_export_page_name();
                        //var export_file_path = folder + "/" + export_file_name + ".png";
                        //Document.export_in(export_file_path, options.format);
                        Document.export_page(pageOptions, operationState);
                    }, pageEnumerationOptions);
                },
                /**
                 *
                 * @param [options] {Document.ExportPagesOptions}
                 */
                export_pages_auto:        function (options) {
                    if (!Document.is_saved()) {
                        alert("You need to save the document first!");
                        return;
                    }
                    options = Document.getExportPagesOptions(options);
                    options.simple = true;
                    Document.export_pages(options);
                },
                /**
                 *
                 * @param [options] {Document.ExportPagesOptions}
                 * @param [operationState] {Document.OperationState}
                 */
                export_page:       function (options, operationState) {
                    if (!Document.is_saved()) {
                        alert("You need to save the document first!");
                        return;
                    }
                    options = Document.getExportPagesOptions(options);
                    var exportName = Document.get_export_page_name(options);
                    //utils.log("Export Page: Name: " + JSON.stringify(exportName, null, "\t"));
                    if (options.main && !exportName.isMain)
                    {
                        utils.log("Skipping Page: " + fw.getDocumentDOM().pageName);
                    }

                    //utils.log("Exporting Page: \u2192 " + fw.getDocumentDOM().pageName);
                    //utils.log("Exporting Page: " + fwFiles.convertURLToOSPath(exportName.path, true));
                    Document.export_in(exportName.path, options, operationState);
                },
                /**
                 *
                 * @param [options] {Document.ExportPagesOptions}
                 */
                export_page_in:    function (options) {
                    Document.export_in(null, options);
                },
                /**
                 *
                 * @param [path] {string}
                 * @param [options] {Document.ExportPagesOptions}
                 * @param [operationState] {Document.OperationState}
                 */
                export_in:         function (path, options, operationState) {
                    var originalPath = path;
                    options = Document.getExportPagesOptions(options);
                    if (!operationState) {
                        operationState = {
                            completed: 0,
                            number:    1,
                            page:      Pages.info()
                        };
                    }
                    if (!operationState.extension)
                        operationState.extension = ".png";
                    if (!operationState.extension.startsWith("."))
                        operationState.extension = "." + operationState.extension;
                    if (path) {
                        if (!path.endsWith(operationState.extension))
                            path += operationState.extension;
                        var directory          = Files.getDirectory(path);
                        var directoryPath = fwFiles.convertURLToOSPath(directory, true);
                        //utils.log(" > Creating Directory: " + directoryPath);
                        var createdCount = fwFiles.createDirectories(directory);
                        if (createdCount > 0) {
                            //utils.log("Created Directory:  " + " ".repeat(35) + directoryPath);
                        }
                    }
                    var filePath = fwFiles.convertURLToOSPath(path, true);
                    //alert("Exporting Page In: " + options + "\r\n" + path);
                    Document.set_export_format(options.format);
                    //utils.log("Exporting Page \u2192 " + path);
                    utils.log("Exporting Page: " + fw.getDocumentDOM().pageName.padEnd(35) + " \u2192 " + filePath);
                    fw.exportDocumentAs(null, path, null);
                    //utils.log("Exporting Page Complete");
                    operationState.completed++;
                },
                /**
                 *
                 * @param [options] {Document.ExportPageFormat}
                 */
                set_export_format: function (options) {
                    if (options === undefined)
                        options = 'CURRENT';
                    if (typeof options === 'string') {
                        switch (options.toUpperCase()) {
                            case 'PNG24':
                                Document.set_export_as_png_24();
                                break;
                            case 'PNG32':
                                Document.set_export_as_png_32();
                                break;
                            default:
                                break;
                        }
                    } else {
                        fw.getDocumentDOM().setExportOptions(options);
                    }
                },
                set_export_as_png_24:     function () {
                    fw.getDocumentDOM().setExportOptions({
                        animAutoCrop:           true,
                        animAutoDifference:     true,
                        applyScale:             false,
                        colorMode:              "24 bit",
                        crop:                   false,
                        cropBottom:             0,
                        cropLeft:               0,
                        cropRight:              0,
                        cropTop:                0,
                        ditherMode:             "none",
                        ditherPercent:          100,
                        exportFormat:           "PNG",
                        frameInfo:              [],
                        interlacedGIF:          false,
                        jpegQuality:            80,
                        jpegSelPreserveButtons: false,
                        jpegSelPreserveText:    true,
                        jpegSelQuality:         90,
                        jpegSelQualityEnabled:  false,
                        jpegSmoothness:         0,
                        jpegSubsampling:        0,
                        localAdaptive:          true,
                        lossyGifAmount:         0,
                        macCreator:             "",
                        macFileType:            "",
                        name:                   "PNG24",
                        numCustomEntries:       0,
                        numEntriesRequested:    0,
                        numGridEntries:         6,
                        optimized:              true,
                        paletteEntries:         null,
                        paletteInfo:            null,
                        paletteMode:            "adaptive",
                        paletteTransparency:    "none",
                        percentScale:           100,
                        progressiveJPEG:        false,
                        savedAnimationRepeat:   0,
                        sorting:                "none",
                        useScale:               true,
                        webSnapAdaptive:        false,
                        webSnapTolerance:       14,
                        xSize:                  0,
                        ySize:                  0,
                    });
                },
                set_export_as_png_32:     function () {
                    fw.getDocumentDOM().setExportOptions({
                        animAutoCrop:           true,
                        animAutoDifference:     true,
                        applyScale:             false,
                        colorMode:              "32 bit",
                        crop:                   false,
                        cropBottom:             0,
                        cropLeft:               0,
                        cropRight:              0,
                        cropTop:                0,
                        ditherMode:             "none",
                        ditherPercent:          100,
                        exportFormat:           "PNG",
                        frameInfo:              [],
                        interlacedGIF:          false,
                        jpegQuality:            80,
                        jpegSelPreserveButtons: false,
                        jpegSelPreserveText:    true,
                        jpegSelQuality:         90,
                        jpegSelQualityEnabled:  false,
                        jpegSmoothness:         0,
                        jpegSubsampling:        0,
                        localAdaptive:          true,
                        lossyGifAmount:         0,
                        macCreator:             "",
                        macFileType:            "",
                        name:                   "PNG32",
                        numCustomEntries:       0,
                        numEntriesRequested:    0,
                        numGridEntries:         6,
                        optimized:              true,
                        paletteEntries:         null,
                        paletteInfo:            null,
                        paletteMode:            "adaptive",
                        paletteTransparency:    "none",
                        percentScale:           100,
                        progressiveJPEG:        false,
                        savedAnimationRepeat:   0,
                        sorting:                "none",
                        useScale:               true,
                        webSnapAdaptive:        false,
                        webSnapTolerance:       14,
                        xSize:                  0,
                        ySize:                  0,
                    });
                },
                is_master_page:           function () {
                    var dom = fw.getDocumentDOM();
                    if (dom.currentPageNum !== 0)
                        return false;
                    return dom.hasMasterPage() || dom.pageName === 'Master Page';
                },
                is_open:                 function () {
                    return (fw.documents.length > 0);
                },
                is_saved:                 function () {
                    return (Document.is_open() && fw.getDocumentPath(null) != "");
                },
                is_new: function() {
                    return (Document.is_open() && fw.getDocumentPath(null) === "");
                },
                is_empty: function() {
                    var dom = fw.getDocumentDOM();
                    if (Pages.count() > 1 || dom.currentFrameNum > 0)
                        return false;
                    var elementCount = Pages.getElementCount();
                    utils.log("Document has " + elementCount + "elements");
                    return elementCount === 0;
                },
                path:                     function () {
                    if (fw.getDocumentPath(null) == '') {
                        // not saved
                        return null;
                    } else {
                        return Files.getDirectory(fw.getDocumentPath(null)) + "/";
                    }
                },
                dump:                     function () {
                    var filePath = fw.userJsCommandsDir,
                        fileName = fw.getDocumentDOM().docTitleWithoutExtension;

                    if (fileName == "") {
                        fileName = "untitled";
                    }
                    fileName = "/" + fileName + "_dump.txt";
                    Files.createFile(filePath + fileName, ".txt", "FWMX");
                    var my_file = Files.open(filePath + fileName, true); // Open file for writing
                    my_file.write(fw.getDocumentDOM().javascriptString);
                    my_file.close();
                },
            },

            Guides: {
                clear:           function (direction) {
                    var dom = fw.getDocumentDOM();
                    if (!direction) {
                        dom.removeAllGuides('horizontal');
                        dom.removeAllGuides('vertical');
                    } else {
                        dom.removeAllGuides(direction);
                    }
                },
                get:             function () {
                    // We don't return the fw.getDocumentDOM().guides object
                    // Instead, we clone the contents of the vGuides and hGuides arrays,
                    // so we have a 'snapshot' of the guides. Extremely useful for
                    // guide manipulation like that on the Document.guide.remove()
                    // function (where we delete a guide by clearing all guides and
                    // then re-creating all the original guides except the one we
                    // wanted to delete...)
                    var current_v_guides = fw.getDocumentDOM().guides.vGuides,
                        current_h_guides = fw.getDocumentDOM().guides.hGuides,
                        current_guides   = {
                            vGuides: [],
                            hGuides: [],
                        };

                    for (var i = current_v_guides.length - 1; i >= 0; i--) {
                        current_guides.vGuides.push(current_v_guides[i]);
                    }
                    for (var j = current_h_guides.length - 1; j >= 0; j--) {
                        current_guides.hGuides.push(current_h_guides[j]);
                    }
                    return current_guides;
                },
                add:             function (where, direction) {
                    if (direction == "vertical") {
                        Guides.addVertical(where);
                    }
                    if (direction == "horizontal") {
                        Guides.addHorizontal(where);
                    }
                },
                remove:          function (where, direction) {
                    var current_guides = Guides.get();
                    if (direction == "horizontal") {
                        Guides.clear('horizontal');
                        for (var i = current_guides.hGuides.length - 1; i >= 0; i--) {
                            if (current_guides.hGuides[i] != where) {
                                Guides.addHorizontal(current_guides.hGuides[i]);
                            }
                        }
                    } else {
                        Guides.clear('vertical');
                        for (var j = current_guides.vGuides.length - 1; j >= 0; j--) {
                            if (current_guides.vGuides[j] != where) {
                                Guides.addVertical(current_guides.vGuides[j]);
                            }
                        }
                    }
                },
                addVertical:     function (where) {
                    fw.getDocumentDOM().addGuide(where, "vertical");
                },
                addHorizontal:   function (where) {
                    fw.getDocumentDOM().addGuide(where, "horizontal");
                },
                vertical_grid:   function (grid_width, number_of_columns, gutter_width) {

                    var doc = fw.getDocumentDOM(),
                        sel = doc.getSelectionBounds(),
                        start_position;

                    if (sel) {
                        start_position = Math.floor(sel.left);
                    } else {
                        start_position = 0;
                    }

                    var guide_position      = start_position,
                        last_guide_position = 0,
                        column_width        = Math.floor(( grid_width - ( (number_of_columns - 1) * gutter_width ) ) / number_of_columns);

                    // Make sure the guides are visible
                    doc.setShowGuides(true);

                    for (var i = number_of_columns - 1; i >= 0; i--) {
                        Guides.add(guide_position, "vertical");
                        guide_position += column_width;
                        last_guide_position = guide_position;
                        Guides.add(guide_position, "vertical");
                        guide_position += gutter_width;
                    }
                    if (User.getLanguage() == "en") {
                        alert("Column size: " + column_width + "\n" + "Grid width: " + (last_guide_position - start_position));
                    }
                    if (User.getLanguage() == "es") {
                        alert("Ancho de columna: " + column_width + "\n" + "Ancho de la retícula: " + (last_guide_position - start_position));
                    }
                },
                horizontal_grid: function (grid_width, number_of_columns, gutter_width) {
                    var doc = fw.getDocumentDOM(),
                        sel = doc.getSelectionBounds(),
                        start_position;

                    if (sel) {
                        start_position = sel.top;
                    } else {
                        start_position = 0;
                    }
                    var guide_position = start_position,
                        column_width   = Math.floor(( grid_width - ( (number_of_columns - 1) * gutter_width ) ) / number_of_columns);

                    // Make sure the guides are visible
                    doc.setShowGuides(true);

                    for (var i = number_of_columns - 1; i >= 0; i--) {
                        Guides.add(guide_position, "horizontal");
                        guide_position += column_width;
                        Guides.add(guide_position, "horizontal");
                        guide_position += gutter_width;
                    }
                    alert("Column size: " + column_width);
                },
            },

            Selection: {
                stored_selection: [],
                all:              function () {
                    fw.getDocumentDOM().selectAll();
                    return fw.selection;
                },
                clone:             function () {
                    return fw.selection.clone();
                },
                get_bounds:       function () {
                    return fw.getDocumentDOM().getSelectionBounds();
                },
                width:            function () {
                    var sel = Selection.get_bounds();
                    if (sel) {
                        return (sel.right - sel.left);
                    } else {
                        return 0;
                    }
                },
                height:           function () {
                    sel = Selection.get_bounds();
                    if (sel) {
                        return (sel.bottom - sel.top);
                    } else {
                        return 0;
                    }
                },
                left:             function () {
                    return Selection.get_bounds().left;
                },
                right:            function () {
                    return Selection.get_bounds().right;
                },
                top:              function () {
                    return Selection.get_bounds().top;
                },
                bottom:           function () {
                    return Selection.get_bounds().bottom;
                },
                /** @returns {orangecommands.Selection} **/
                each:             function (callback) {
                    [].concat(fw.selection).each(callback);
                    return this;
                },
                /** @returns {orangecommands.Selection} **/
                save:             function () {
                    this.stored_selection = this.clone();
                    return this;
                },
                /** @returns {orangecommands.Selection} **/
                forget:           function () {
                    this.stored_selection = [];
                    return this;
                },
                /** @returns {orangecommands.Selection} **/
                restore:          function () {
                    fw.selection = this.stored_selection;
                    return this;
                },
                /** @returns {orangecommands.Selection} **/
                join:             function (delimiter) {
                    if (fw.selection.length < 2) {
                        return this;
                    }
                    ;
                    if (delimiter == undefined) {
                        delimiter = "\u000D";
                    }
                    ;

                    var text_fields = new Array();

                    Selection.each(function (field) {
                        if (field.is_text()) {
                            text_fields.push(field);
                        }
                    });

                    var merged_text          = {};
                    merged_text.initialAttrs = text_fields[0].textRuns.initialAttrs;
                    merged_text.textRuns     = [];
                    text_fields.sort(Sort.by_x);
                    text_fields.sort(Sort.by_y);
                    text_fields.each(function (t) {
                        for (var i = 0; i < t.textRuns.textRuns.length; i++) {
                            var current_text_run = t.textRuns.textRuns[i];
                            if (i == t.textRuns.textRuns.length - 1) {
                                current_text_run.characters += delimiter;
                            }
                            ;
                            if (i == 0) {
                                current_text_run.changedAttrs = t.textRuns.initialAttrs;
                            }
                            merged_text.textRuns.push(current_text_run);
                        }
                    });
                    fw.getDocumentDOM().addNewText({
                        left:   Selection.left(),
                        top:    Selection.top(),
                        right:  Selection.right(),
                        bottom: Selection.bottom(),
                    }, true);
                    fw.getDocumentDOM().setTextRuns(merged_text);
                    return this;
                },
            },

            FW: {
                getTMP: function () {
                    return Files.getTempFilePath(null);
                },
            },

            File:  {
                create: function (contents, url) {
                    // Delete any existing file with the same name. If
                    // you do not, and then open the file for rewriting,
                    // saved text will be written over the existing file
                    // which could leave remnants of the old file behind
                    if (!url) {
                        fileURL = fw.browseForFileURL("select", "", "");
                    } else {
                        fileURL = url;
                    }

                    //fileURL = "file:///HD/Users/ale/Desktop/fw_cs3_api.jsf";

                    if (Files.deleteFileIfExisting(fileURL)) {
                        // Create a new file to write in. Note:
                        // this is only required for Macs; Windows
                        // will create a file with the call to open()
                        if (Files.createFile(fileURL, ".txt", "TEXT")) {
                            // Open the file for writing. If successful, this
                            // will return a reference to the file so that
                            // text can be added to it using the write()
                            // command.
                            var fileReference = Files.open(fileURL, true);
                            if (fileReference) {
                                // Write the text to the opened file
                                fileReference.write(contents);
                                // When finished, be sure to close the
                                // file using the close() command so other
                                // processes will be able to access it
                                fileReference.close();
                                // Returning true signals a successful save
                                return true;
                            }
                        }
                    }
                    // Returning false signals a failed save
                    return false;
                },
            },
            Page:  Page,
            Pages: {
                count:         function () {
                    try {
                        return fw.getDocumentDOM().pagesCount;
                    } catch (exception) {
                        // Create page at the end of page list...
                        fw.getDocumentDOM().addNewPage();

                        // Move it to the first position
                        last_page_index = fw.getDocumentDOM().currentPageNum;
                        fw.getDocumentDOM().reorderPages(last_page_index, 0);

                        // Change active page to first page
                        fw.getDocumentDOM().changeCurrentPage(0);

                        // Remove it
                        fw.getDocumentDOM().deletePageAt(0);

                        return last_page_index;
                    }
                },
                getElementCount: function() {
                    var count = Selection
                        .save()
                        .all()
                        .length;
                    Selection
                        .restore();
                    return count;
                },
                /** @returns {Pages.PageInfo} **/
                info: function() {
                    var dom = fw.getDocumentDOM();
                    return {
                        name: dom.pageName,
                        index: dom.currentPageNum
                    }
                },

                each:          function (callback, options) {
                    /** @type {Pages.PageEnumerationOptions} **/
                    options = options || {};
                    if (options.currentOnly)
                        return Pages.withPage(callback);
                    var p = Pages.count();
                    for (var i = 0; i < p; i++) {
                        fw.getDocumentDOM().changeCurrentPage(i);
                        var page = new Page();
                        if (options.skipMaster && page.isMaster)
                            continue;
                        callback.call(this, page);
                    }
                },
                withPage:       function (callback) {
                    var page = new Page();
                    callback.call(this, page);
                },
                setName: function (newName) {
                    var dom = fw.getDocumentDOM();
                    dom.setPageName(dom.currentPageNum, newName);
                },
                vertical_trim: function () {
                    var doc = fw.getDocumentDOM(),
                        l   = doc.layers.length - 1;
                    doc.setElementLocked(-1, -1, -1, false, true, false); // unlock everything
                    for (l; l >= 0; l--) {
                        doc.selectAllOnLayer(l, true, false);
                    }
                    var doc_height = Selection.bottom();
                    doc.setDocumentCanvasSize({
                        left:   0,
                        top:    0,
                        right:  doc.width,
                        bottom: doc_height,
                    }, true);
                },
            },

            Sort: {
                by_y: function (a, b) {
                    return a.top - b.top;
                },
                by_x: function (a, b) {
                    return a.left - b.left;
                },
            },

            Color: {
                hex_to_rgba: function (hexstr) {
                    var a, i, r, g, b, alpha;
                    hexstr = hexstr.replace(/[^0-9a-f]+/ig, '');
                    if (hexstr.length == 3) {
                        a = hexstr.split('');
                    } else if (hexstr.length == 6 || hexstr.length == 8) {
                        a = hexstr.match(/(\w{2})/g);
                    }
                    if (a.length == 3) {
                        return '#' + hexstr;
                    }
                    for (i = a.length - 1; i >= 0; i--) {
                        if (a[i].length == 2) {
                            a[i] = parseInt(a[i], 16);
                        } else {
                            a[i] = parseInt(a[i], 16);
                            a[i] = a[i] * 16 + a[i];
                        }
                    }
                    // RGB
                    r = a[0];
                    g = a[1];
                    b = a[2];

                    // Alpha
                    if (a[3] == 0) {
                        alpha = 0;
                    } else {
                        alpha = Math.round((a[3] / parseInt('ff', 16)) * 100) / 100;
                    }
                    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
                },
            },

            UI: {
                prompt: function (txt, default_value) {
                    setTimeout('quit()', 10000);
                    return prompt(txt, default_value);
                },
            }
        };
        fw.modules = fw.modules || {};
        fw.modules.orangecommands = fw.orangecommands = orangecommands;

// Utility methods
        FwArray.prototype.clone = Array.prototype.clone = function () {
            return [].concat(this);
        };
        FwArray.prototype.each_with_index = Array.prototype.each_with_index = function (callback, traverse_groups) {
            Selection.forget();

            var count  = 0,
                groups = 0;

            for (var i = 0; i < this.length; i++) {
                var el       = this[i];
                fw.selection = el;

                switch (el.kind()) {
                    case 'autoshape':
                        traverse_groups = false;
                        break;
                    case 'group':
                        groups++;
                    default:
                        if (traverse_groups == undefined) {
                            traverse_groups = true;
                        }
                        break;
                }

                if (el.is_group() && traverse_groups) {
                    el.each_in_group(callback);
                } else {
                    callback.call(this, el, count);
                    Selection.stored_selection.push(fw.selection[0]);
                }
                count++;
            }
            ;
            Selection.restore();
            if (groups > 0) {
                fw.getDocumentDOM().selectParents();
            }
            ;
        };
        FwArray.prototype.each = Array.prototype.each = FwArray.prototype.each_with_index;

        Number.prototype.times    = function (callback) {
            for (var s = this - 1; s >= 0; s--) {
                callback.call(this, s);
            }
            ;
        };
        Element.each_in_group     = function (callback) {
            for (var e = 0; e < this.elements.length; e++) {
                if (this.elements[e].is_group()) {
                    this.elements[e].each_in_group(callback);
                } else {
                    callback.call(this, this.elements[e]);
                    Selection.stored_selection.push(fw.selection[0]);
                }
            }
        };
        Text.prototype.resize     = function (w, h) {
            fw.selection = this;
            if (w) {
                w               = Math.round(w);
                h               = Math.round(h);
                this.autoExpand = false;

                var offset      = Math.round(h - Math.round(this.height)),
                    leading     = this.textRuns.initialAttrs.leading,
                    leadingMode = this.textRuns.initialAttrs.leadingMode;

                if (leadingMode == 'percentage') {
                    offset = offset / 100;
                }
                ;

                this.rawWidth = w - 4; // amazingly stupid bug in Fireworks...
                if (offset) {
                    fw.getDocumentDOM().setTextLeading(leading + offset, leadingMode);
                }
                ;
            } else {
                this.autoExpand = true;
            }
        };
        Object.prototype.is_group = function () {
            return (this == "[object Group]");
        };
        Element.resize            = function (w, h) {
            //if (this.__proto__ == Instance) {
            // FIXME: Object is a symbol, and they sometimes get destroyed when resized below its minimum size
            //};
            if (isNaN(w) || isNaN(h)) return;
            fw.selection = this;

            // Old method: more precise, but slow & crashy
            //var x_pos = Math.round(this.left);
            //var y_pos = Math.round(this.top);
            //fw.getDocumentDOM().setSelectionBounds({left:x_pos,top:y_pos,right:(x_pos + w),bottom:(y_pos + h)},"autoTrimImages transformAttributes");

            w = Math.round(w);
            h = Math.round(h);
            fw.getDocumentDOM().resizeSelection(w, h);
        };
        Element.set_position      = function (x, y) {
            fw.selection = this;
            x            = Math.round(x);
            y            = Math.round(y);

            switch (this.kind()) {
                case 'text':
                    this.rawLeft = x + 2;
                    this.rawTop  = y + 2;
                    break;
                case 'image':
                case 'group':
                    this.left = x;
                    this.top  = y;
                    break;
                case 'autoshape':
                    fw.getDocumentDOM().moveSelectionBy({
                        x: x - this.left,
                        y: y - this.top,
                    }, false, false);
                    break;
                case 'element':
                    var x_offset = 0,
                        y_offset = 0;

                    if (this.pathAttributes.brush) {
                        if (this.pathAttributes.brushPlacement == 'outside') {
                            y_offset = this.pathAttributes.brush.diameter;
                        }
                        if (this.pathAttributes.brushPlacement == 'center') {
                            y_offset = Math.floor(this.pathAttributes.brush.diameter / 2);
                        }
                        x_offset = y_offset * 2;
                    }
                    ;
                    this.left = x - x_offset;
                    this.top  = y - y_offset;
                    break;
                default:
                    // don't do anything for unknown objects...
                    break;
            }
        };

        Element.is_symbol     = function () {
            return (this.kind() == 'symbol');
        };
        Element.is_text       = function () {
            return (this.kind() == 'text');
        };
        Object.prototype.kind = function () {

            if (this.smartShapeCode != undefined) {
                return 'autoshape';
            }
            ;

            if (this.elements) {
                return 'group';
            }
            ;

            if (this.__proto__ == Text.prototype) {
                return 'text';
            }
            ;

            if (this.__proto__ == Instance) {
                return 'symbol';
            }
            ;

            if (this == "[object Image]") {
                return 'image';
            }
            ;

            return 'element';
        };

// Globals
        fw.version = fw.appName.match(/\d+/);
        fw.copy    = function (txt) {
            fw.getDocumentDOM().clipCopyJsToExecute(txt);
        }

        function dump(obj) {
            var output = "Dumping " + obj + "\n\n";
            for (var i in obj) {
                if (!obj.hasOwnProperty(i))
                    continue;
                output += obj + '.' + i + " (" + typeof(obj[i]) + ") = " + obj[i] + "\n";
            }
            alert(output);
        }

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


        var get_export_folder_name = function () {
            function fix_date(num) {
                num = num.toString();
                if (num.length < 2) {
                    num = "0" + num;
                }
                return num;
            }

            var d           = new Date();
            var year        = d.getFullYear();
            var month       = fix_date((d.getMonth() + 1));
            var day         = fix_date(d.getDate());
            var hour        = fix_date(d.getHours());
            var minute      = fix_date(d.getMinutes());
            var folder_name = year + month + day + hour + minute;
            return folder_name;
        };
        var User = orangecommands.User,
            Document = orangecommands.Document,
            Guides = orangecommands.Guides,
            Selection = orangecommands.Selection,
            FW = orangecommands.FW,
            File = orangecommands.File,
            Pages = orangecommands.Pages,
            Sort = orangecommands.Sort,
            Color = orangecommands.Color,
            UI = orangecommands.UI;
        fw.commands = fw.commands || {};
        fw.commands.orangecommands = fw.commands.orangecommands || {
            api: orangecommands,
            state: {}
        };
        return orangecommands;
    }
);