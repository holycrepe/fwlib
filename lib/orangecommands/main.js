"use strict";

//noinspection JSUnusedLocalSymbols,ThisExpressionReferencesGlobalObjectJS
(function (globalContext) {

    var saveModules = function () {
        /**
         *
         * @param modules {FwModules}
         * @param utils {fwlib.utils}
         */
        var inner = function (modules, utils) {
            //_.defaults(globalContext || this, modules);
            //noinspection JSUndefinedPropertyAssignment
            globalContext.__ = globalContext.lodash = modules._;
            Object.assign(globalContext, modules);
            Object.assign(globalContext, {
                modules: modules,
                utils: utils,
                //clone: utils.clone,
                sfy: utils.stringify,
                stringify: utils.stringify,
                logify: utils.logify,
                //log: utils.log
            });
        };
        inner(fw.modules, fw.utils);

        //noinspection JSUndeclaredVariable,JSUnresolvedVariable
        return modules;
    };

    //noinspection JSUnusedLocalSymbols 
    define("orangecommands/main",
        [
            "fwlib/underscore",
            "dojo/json",
            "fwlib/files",
            "fwlib/utils",
            "fwlib/layers",
            "fwcmds/pages",
            "orangecommands/prototype",
        ],
        /**
         *
         * @param {_.LoDashStatic} _
         * @param JSON
         * @param {fwlib.files} fwFiles
         * @param {fwlib.utils} utils
         * @param fwLayers
         * @param fwPages
         * @param orange_proto
         */
        function (_,
                  JSON,
                  fwFiles,
                  utils,
                  fwLayers,
                  fwPages,
                  orange_proto) {
// bs.js Library
// a collection of (hopefully) useful tools for Fireworks

            //noinspection JSUnresolvedVariable
            var OcInternals = OcInternals || {
                /**
                 *
                 * @param obj {Object}
                 * @param propertyNames {OcInternal.PropertyDefinition[]}
                 */
                defineGetters: function (obj, propertyNames) {
                    for (var i = 0, j = propertyNames.length; i < j; i++) {
                        var propertyData = propertyNames[i],
                            propertyName,
                            func;
                        if (typeof propertyData === "string") {
                            propertyName     = propertyNames[i];
                            var funcNameBase = utils.capitalizeFirstLetter(propertyName);
                            func             = obj['get' + funcNameBase];
                        } else {
                            propertyName = propertyData[0];
                            func         = propertyData[1];
                        }
                        obj.__defineGetter__(propertyName, func);
                    }
                },
                /**
                 *
                 * @param obj {Object}
                 * @param propertyNames {OcInternal.PropertyDefinition[]}
                 */
                defineProperties: function (obj, propertyNames) {
                    for (var i = 0, j = propertyNames.length; i < j; i++) {
                        var propertyData = propertyNames[i],
                            propertyName,
                            func,
                            funcSet;
                        if (typeof propertyData === "string") {
                            propertyName     = propertyNames[i];
                            var funcNameBase = utils.capitalizeFirstLetter(propertyName);
                            func             = obj['get' + funcNameBase];
                            funcSet          = obj['set' + funcNameBase];
                        } else {
                            propertyName = propertyData[0];
                            func         = propertyData[1];
                            funcSet      = propertyData[2];
                        }
                        obj.__defineGetter__(propertyName, func);
                        obj.__defineSetter__(propertyName, funcSet);
                    }
                },

                defineElementAccessors: function (module, propertyNames) {
                    _.defaults(module, {
                        /**
                         *
                         * @param {LayerElementDataOptions} [options]
                         * @return {Array|Fw.FwElement[]}
                         */
                        getElements:    function (options) {
                            var data = module.getElementData(options);
                            //alert("Get Elements: " + data);
                            return data.elements;
                        },
                        /**
                         *
                         * @param {OrangeCommands.Elements.SymbolDataOptions} options
                         * @return {OrangeCommands.Elements.SymbolInfo[]}
                         */
                        getSymbolInfo:  function (options) {
                            var layerOptions = options && typeof options === 'object'
                                ? options.layers
                                : undefined;
                            var elements = module.getElements(layerOptions);
                            //alert("Get Symbol Info: Elements: " + elements[0].symbolName);
                            return Elements.getSymbolInfo(elements, options);
                        },
                        /**
                         *
                         * @param {OrangeCommands.Elements.SymbolDataOptions} options
                         * @return {OrangeCommands.Elements.Symbol[]}
                         */
                        getSymbols:     function (options) {
                            var layerOptions = options && typeof options === 'object'
                                ? options.layers
                                : undefined;
                            var elements = module.getElements(layerOptions);
                            return Elements.getSymbols(elements, options);
                        }
                    });

                    propertyNames = (propertyNames || []).concat(['elementData', 'elements', 'symbolInfo', 'symbols']);
                    OcInternals.defineGetters(module, propertyNames);
                },

                /**
                 *
                 * @param options {RenameOptions}
                 * @param [title] {string}
                 * @param [action] {string}
                 * @return {RegexRule|undefined}
                 */
                getRegexRule: function (options, title, action) {
                    title = title || "Regex Rule";
                    action = action || title;
                    if (!options.debug)
                        options.debug = {};
                    options.debug.options = true;
                    var pattern = options.pattern
                        || prompt("Enter " + title + " Search Pattern", options.defaultPattern || '');
                    if (!pattern)
                        return;
                    var replacement = options.replacement
                        || prompt("Enter " + title + " Replacement", options.defaultReplacement || '');
                    //noinspection JSValidateTypes
                    if (replacement === null)
                        return;
                    //options.debug.options = true;
                    if (options.debug.options) {
                        utils.log(action + ":\n" +
                            "Pattern:     " + pattern + "\n" +
                            "Replacement: " + replacement);
                    }
                    var regex                  = new RegExp(pattern, 'gi');
                    //noinspection JSValidateTypes
                    return {
                        search: regex,
                        replacement: replacement
                    };
                }
            };
            //noinspection JSValidateTypes,JSUnresolvedVariable
            var DocumentInternals = DocumentInternals || {
                regexPatterns: {
                    processPageName: /^([A-Z]+)(?:([@])(\d+))?(?:([;])(\d+.*)?)?$/im,
                    processDocName:  /^(.*?)([#.])(.*)$/i,
                },

                /**
                 *
                 * @param [options] {ExportPagesOptions}
                 * @returns {ExportPagesOptions}
                 */
                processExportPagesOptions: function (options) {
                    /** @type {ExportPagesOptions} **/
                    options = Document.getExportOptions(options);
                    var flags            = options.flags || [];
                    var ExportPagesFlags = Document.ExportPagesFlags;
                    if (flags.includes(ExportPagesFlags.CURRENT_FORMAT)) {
                        options.format = 'CURRENT';
                    }
                    if (flags.includes(ExportPagesFlags.PNG32_FORMAT)) {
                        options.format = 'PNG32';
                    }
                    if (flags.includes(ExportPagesFlags.MAIN_PAGES)) {
                        options.currentPageOnly = false;
                        options.main            = true;
                    }
                    if (flags.includes(ExportPagesFlags.CURRENT_PAGE)) {
                        options.currentPageOnly = true;
                        options.main            = false;
                    }
                    if (flags.includes(ExportPagesFlags.PROMPT_FOLDER)) {
                        options.naming.promptFolder = true;
                    }
                    if (flags.includes(ExportPagesFlags.PROMPT_PREFIX)) {
                        options.naming.promptPrefix = true;
                    }
                    options.flags = [];
                    return options;
                },

                /**
                 *
                 * @param [options] {ExportPagesOptions}
                 * @returns {ExportPageName}
                 */
                getExportPageName: function (options) {
                    options = Document.getExportOptions(options);
                    //alert("get_export_page_name...");
                    if (!options.naming.page)
                        options.naming.page = fw.getDocumentDOM().pageName;
                    //log("Get Export Page Name of " + options.page);
                    return DocumentInternals.getExportFileName(options);
                },

                getExportFolderAutoName: function () {
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
                },

                /**
                 *
                 * @param [options] {ExportPagesOptions}
                 * @returns {ExportPageName}
                 */
                getExportFileName: function (options) {
                    options       = Document.getExportOptions(options);
                    var naming    = options.naming;
                    var separator = (naming.separator || "-");
                    //noinspection JSValidateTypes
                    /** @type {ExportPageName} **/
                    var results   = DocumentInternals.processPageName(naming.page || "", options);
                    //options.debug.processPageName = true;
                    if (options.debug.processPageName) {
                        utils.logify("Processed Page Name", results);
                    }


                    results.document = Files.getFilename(fw.getDocumentPath(null)).split('.fw.png')[0].split('.png')[0];
                    var match        = DocumentInternals.regexPatterns.processDocName.exec(results.document);
                    results.docMain  = match
                        ? match[1]
                        : results.document;

                    //options.debug.processDocName = true;
                    if (options.debug.processDocName) {
                        utils.logify("Processed Page Name", {
                            document: results.document,
                            main:     results.docMain,
                            regex:    match,
                        });
                    }
                    /** @type {ExportPageName} **/
                    var suffixResults = utils.clone(results);
                    //results.file = options.naming.file || results.document;
                    if (results.isMain || !naming.enableSeparator) {
                        separator = "";
                    }

                    var suffixResultUpdates;
                    if (results.isMain) {
                        suffixResultUpdates = {
                            type: '',
                            name: '',
                            main: '',
                            page: '',
                        };
                    } else {
                        suffixResultUpdates = {
                            type: suffixResults.type || options.naming.defaultType,
                        };
                    }

                    _.assign(suffixResults, suffixResultUpdates);

                    if (naming.delimiters && typeof naming.delimiters === "string") {
                        naming.delimiters = new RegExp(naming.delimiters, 'gi');
                    }

                    var delimiters           = naming.delimiters;
                    var processDelimiters    = function (subject) {
                        var result = subject;
                        if (delimiters) {
                            result = result
                                .replace(delimiters, separator);

                        }
                        return result;
                    };
                    var processPathVariables = function (subject) {
                        var result = subject;
                        result     = result
                            .replace(/\*typeSuffix\*/i, suffixResults.type)
                            .replace(/\*nameSuffix\*/i, suffixResults.name)
                            .replace(/\*mainSuffix\*/i, suffixResults.main)
                            .replace(/\*pageSuffix\*/i, suffixResults.page)
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
                    results.prefix           = processPathVariables(naming.prefix);
                    results.file             = naming.template
                        ? processPathVariables(naming.template)
                        : processDelimiters(results.document);
                    results.folder           = processPathVariables(naming.folder);
                    //results.suffix = separator + results.name + ".png";
                    var file                 = results.file.replace(/[\\\/]+/g, '/');
                    var fileParts            = file.split('/');
                    if (fileParts.length > 0) {
                        results.file = fileParts.pop();
                        results.folder += '/' + fileParts.join('/');
                    }

                    results.path = Files.makePathFromDirAndFile(results.folder, results.file);
                    var paths = {
                        relative: results.path,
                        absolute: fwFiles.getAbsolutePath(results.path)
                    };
                    //if (results.name)
                    //    results.path += results.suffix;

                    if (options.debug.exportNameTemplates) {
                        utils.logify('Get Export File Name Templates', results);
                    }
                    if (options.debug.exportNameResults) {
                        utils.logify('Get Export File Name Results', results);
                    }

                    if (options.debug.exportNameSummary) {
                        utils.log("Export File Name: " +
                            "\nFolder:   " + results.folder +
                            "\nFile:     " + results.file +
                            "\nSub Path: " + paths.relative +
                            "\nPath:     " + paths.absolute);
                    }
                    results.path = paths.absolute;
                    return results;
                },

                /**
                 *
                 * @param export_page_name {string}
                 * @param [options] {ExportPagesOptions}
                 * @returns {ExportPageNamingResult}}
                 */
                processPageName: function(export_page_name, options) {
                    var match  = DocumentInternals.regexPatterns.processPageName.exec(export_page_name);
                    var result = {
                        isMain:            false,
                        type:              "",
                        separator:         "",
                        size:              "",
                        page:              export_page_name,
                        name:              export_page_name,
                        main:              export_page_name,
                        prioritySeparator: "",
                        priority:          "",
                    };
                    if (match === null) {
                        //noinspection JSValidateTypes
                        return result;
                    }
                    result.type              = match[1] || "";
                    result.separator         = match[2] || "";
                    result.size              = match[3] || "";
                    result.prioritySeparator = match[4] || "";
                    result.priority          = match[5] || "";
                    result.name              = result.size + result.prioritySeparator + result.priority;

                    var mainTypes   = options.naming.mainTypes;
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
                    //noinspection JSValidateTypes
                    return result;
                }
            };

            //noinspection JSValidateTypes
            /** @type {DocumentStatic} **/
            var Document = Document || {


                ExportPagesFlags: {
                    CURRENT_FORMAT: 'currentFormat',
                    PNG32_FORMAT:   'png32Format',
                    MAIN_PAGES:     'mainPages',
                    CURRENT_PAGE:   'currentPage',
                    PROMPT_PREFIX:  'promptPrefix',
                    PROMPT_FOLDER:  'promptFolder',
                },
                ExportFormats: {
                    CURRENT: 'CURRENT',
                    PNG24:   'PNG24',
                    PNG32:   'PNG32'
                },
				


				getBounds: function(container) {
					return this.getPosition(container).bounds;
				},

				getSize: function(container) {
					return _.pick(container || fw.getDocumentDOM(), 'width', 'height')
				},

				getPosition: function(container) {
                    var size = Document.getSize(container),
                        bounds = _.pick(container || fw.getDocumentDOM(), 'top', 'left');
                    bounds.bottom = bounds.top + size.height;
                    bounds.right = bounds.left + size.width;
					return {
						size: size,
						bounds: bounds
					}
				},

                /**
                 *
                 * @param {LayerElementDataOptions} [options]
                 * @return {LayerElementData}
                 */
                getElementData: function (options) {
                    return fwLayers.getElementData(undefined, options);
                },

                /**
                 *
                 * @param options {RenamePagesOptions}
                 */
                renamePages: function (options) {
                    var regex = OcInternals.getRegexRule(options, "Page", "Rename Pages");
                    if (!regex)
                        return false;

                    var operationState = {
                        page:      Pages.info,
                        number:    0,
                        completed: 0,
                    };
                    //noinspection JSValidateTypes
                    /** @type {Pages.PageDataEnumerationOptions} **/
                    var pageEnumerationOptions = {
                        currentOnly: options.currentPageOnly,
                        skipMaster:  true,
                    };
                    Pages.each(
                        /** @param page {PageClass} **/
                        function (page) {
                            operationState.number++;
                            var oldName = page.name;
                            var newName = oldName.replace(regex.search, regex.replacement);
                            options.debug.newName            = true;
                            if (options.debug.newName) {
                                utils.log("New Name: " + newName);
                            }
                            page.setName(newName);
                        }, pageEnumerationOptions);
                    return true;
                },


                /**
                 *
                 * @param path {string}
                 * @param [options] {ImportPagesOptions}
                 */
                importPages:        function (path, options) {
                    //path = path || "file:///J|/\u0024\u0024/Symbols/IO/Containers/Folders.png";										
                    /** @type {ImportPagesOptions} **/
                    /** @type {ImportPagesOptions} **/
                    options = options || {};
                    _.defaults(options, {
                        range: {}
                    });
                    options.range.offset = 1;
                    options.range        = {
                        start: 5,
                        max: 1,
                    };
					
					if (!path && options.prompt !== false) {
						path = fw.browseForFileURL("select", "", "");
					}
					if (!path)
						return;

                    var logger = utils.getLogger('Import Pages', 5),
                        log = logger.log;
                    var range = PagesInternals.getRange(options.range);
                    log("Importing Pages " + range.start + "-" + range.end
                        + " from " + fwFiles.convertURLToOSPath(path, true));

                    for (var pageNumber=range.start; pageNumber<=range.end;pageNumber++) {
                        try {
                            //log("Importing Page #" + pageNumber);
                            var importOptions = options['import'];
                            Document.importPage(path, pageNumber, importOptions);
                            //log("Imported  Page #" + pageNumber);
                        } catch (ex) {
                            alert(ex);
                            //logger.error("Error Importing Page #" + pageNumber + ": " + ex);
                            break;
                        }
                    }
                },


                /**
                 *
                 * @param path {string}
                 * @param [pageNumber] {number}
                 * @param [options] {ImportPageOptions}
                 */
                importPage:        function (path, pageNumber, options) {
                    /** @type {ImportPageOptions} **/
                    options = options || {};
                    _.defaults(options, {
                        boundingRectangle:      {
                            left:   32000,
                            top:    32000,
                            right:  -32000,
                            bottom: -32000
                        },
                        maintainAspectRatio:    true,
                        insertAfterCurrentPage: true,
                        exportFormat: 'PNG32'
                    });
                    pageNumber = pageNumber || 1;
                    var logger = utils.getLogger(['Import Page', '\t\t#' + pageNumber], 5),
                        log = logger.log;
                    var pageIndex = pageNumber - 1;
                    log("Insert New Page");
                    var fileURL     = "file:///J|/\u0024\u0024/Symbols/GENERAL/Women.png";
                    var pageNum = 0;
                    var boundingRectangle = {left: 32000, top: 32000, right: -32000, bottom: -32000};
                    var maintainAspectRatio = false;
                    fileURL = path;
                    //maintainAspectRatio = options.maintainAspectRatio;

                    //fw.getDocumentDOM().InsertPageForImport("file:///J|/\u0024\u0024/Symbols/GENERAL/Women.png", 1);

                    fw.getDocumentDOM().InsertPageForImport(fileURL, pageNum);
                    log("Import File");

                    //fw.getDocumentDOM().importFile("file:///J|/\u0024\u0024/Symbols/GENERAL/Women.png", {left:32000, top:32000, right:-32000, bottom:-32000}, false, 1, true);
                    fw.getDocumentDOM().importFile(fileURL, boundingRectangle, maintainAspectRatio, pageNum, true);
                    return;

                    //logify("Importing Page #" + pageNumber + " from File\nPath: " + path, options);

                    //fw.getDocumentDOM().importFile(fileURL, boundingRectangle, maintainAspectRatio, pageNum, options.insertAfterCurrentPage);
                    //fw.getDocumentDOM().importFile(path, options.boundingRectangle, options.maintainAspectRatio, pageIndex, options.insertAfterCurrentPage);
                    log("Set Export Format");
                    //Page.setExportFormat(options.exportFormat);
                    return;
                    var dom = fw.getDocumentDOM();
                    dom.InsertPageForImport(path, pageIndex);
                    dom = fw.getDocumentDOM();
                    dom.importFile(path, options.boundingRectangle, options.maintainAspectRatio, pageIndex, options.insertAfterCurrentPage);
                    log("Done");
                },


                /**
                 *
                 * @param names {string[]}
                 * @param [options] {InsertSymbolOptions}
                 */
                insertSymbols:        function (names, options) {
                    /** @type {InsertSymbolOptions} **/
                    options = options || {};
                    _.defaults(options, {
                        location:      {
                            x: 0,
                            y: 0
                        },
                        newPage: true,
                        fitToCanvas: true,
                        exportFormat: Document.ExportFormats.PNG32
                    });
                    var logger = utils.getLogger('Insert Symbols', 1),
                        log = logger.log;

                    var exportFormat = options.exportFormat;
                    if (exportFormat === Document.ExportFormats.CURRENT)
                        exportFormat = '';
                    var ignoredNames = options.ignoredNames || [];
                    if (!options.preserveNamePrefix) {
                        var commonPrefix = utils.getCommonPrefix(names);
                        if (commonPrefix) {
                            ignoredNames.push(commonPrefix);
                        }
                    }
                    var hasIgnoredNames = !!ignoredNames;
                    if (hasIgnoredNames) {
                        ignoredNames = _.sortBy(ignoredNames, 'length').reverse();
                    }
                    log("Start");
                    //logger.important('Ignored Names: \n * ' + ignoredNames.join('\n * '));

                    for (var i = 0, j = names.length; i < j; i++) {
                        var name = names[i],
                            pageName = name;
                        if (hasIgnoredNames) {
                            _.each(ignoredNames, function (ignoredName) {
                                if (pageName.length > ignoredName.length && pageName.startsWith(ignoredName))
                                    pageName = pageName.substring(ignoredName.length);
                            });
                        }
                        logger.group('# ' + (i+1) + ": " + name);
                        if (options.newPage) {
                            log("Adding New Page" + (name === pageName ? '' : ': ' + pageName));
                            fwPages.add({
                                name: pageName,
                                canvas: fwPages.CanvasColor.Transparent,
                            });
                        }
                        var dom = fw.getDocumentDOM();
                        log("Inserting Symbol");
                        dom.insertSymbolAt(name, options.location);
                        log("Insert Complete");
                        if (options.fitToCanvas) {
                            log("Fit to Canvas");
                            Elements.fitAndCenter(undefined, dom);
                        }
                        if (exportFormat) {
                            log("Set Export Format");
                            Page.setExportFormat(exportFormat);
                        }
                        log("Add Complete");
                        logger.ungroup();
                    }
                    log("End");
                },


                /**
                 *
                 * @param [options] {ExportPagesOptions}
                 * @returns {ExportPagesOptions}
                 */
                getExportOptions: function (options) {
                    /** @type {ExportPagesOptions} **/
                    options = options || {};
                    if (!options.debug)
                        options.debug = {};
                    if (options.debug.exportName) {
                        options.debug.exportNameResults = options.debug.exportNameSummary = options.debug.exportNameTemplates = true;
                    }

                    if (!options.naming)
                        options.naming = {};
                    if (!options.flags)
                        options.flags = [];
                    if (typeof options.naming.mainTypes === 'undefined') {
                        options.naming.mainTypes = {
                            'default': ['Icon'],
                            '@':       ['Icon'],
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
                 * @param [options] {ExportPagesOptions}
                 */
                exportAllPages:        function (options) {
                    options = Document.getExportOptions(options || orangecommands.params);
                    Document.exportPages(options);
                },
                /**
                 *
                 * @param [options] {ExportPagesOptions}
                 */
                exportMainPages:       function (options) {
                    options = Document.getExportOptions(options || orangecommands.params);
                    options.flags.push(Document.ExportPagesFlags.MAIN_PAGES);
                    Document.exportPages(options);
                },
                /**
                 *
                 * @param [options] {ExportPagesOptions}
                 */
                exportCurrentPage:     function (options) {
                    options = Document.getExportOptions(options || orangecommands.params);
                    options.flags.push(Document.ExportPagesFlags.CURRENT_PAGE);
                    Document.exportPages(options);
                },
                /**
                 *
                 * @param [options] {ExportPagesOptions}
                 */
                exportPagesToFolder:   function (options) {
                    options                     = Document.getExportOptions(options || orangecommands.params);
                    options.naming.promptFolder = true;
                    this.exportPages(options);
                },
                /**
                 *
                 * @param [options] {ExportPagesOptions}
                 */
                exportPagesWithPrefix: function (options) {
                    options                     = Document.getExportOptions(options || orangecommands.params);
                    options.naming.promptPrefix = true;

                    this.exportPages(options);
                },
                /**
                 *
                 * @param [options] {ExportPagesOptions}
                 */
                exportPages:     function (options) {
                    if (!Document.isSaved()) {
                        alert("You need to save the document first!");
                        return;
                    }
                    /** @type {ExportPagesOptions} **/
                    options             = DocumentInternals.processExportPagesOptions(options);
                    var originalOptions = options;
                    /** @type {ExportPagesOptions} **/
                    options             = utils.clone(options);
                    var naming          = options.naming;

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
                        naming.folder += DocumentInternals.getExportFolderAutoName();
                    }

                    if (naming.folder) {
                        if (!naming.isAbsoluteFolder) {
                            var path = Document.path();
                            var folders = {
                                source: path,
                                path: path,
                                template: naming.folder,
                                result: ''
                            };
                            var outputDirRegex = naming.outputDirectory;
                            if (outputDirRegex) {
                                if (typeof outputDirRegex === "string") {
                                    outputDirRegex = naming.outputDirectory = new RegExp(naming.outputDirectory, 'gi');
                                }
                                folders.path = folders.path.replace(outputDirRegex, naming.outputDirectoryReplacement);
                            }
                            folders.result = folders.path + folders.template;
                            if (options.debug.processFolderName) {
                                utils.logify('Output Directry', folders);
                            }
                            naming.folder = folders.result;
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

                    //noinspection JSValidateTypes
                    /** @type {PageOperationState} **/
                    var operationState         = {
                        number:    0,
                        completed: 0,
                    };
                    //noinspection JSValidateTypes
                    /** @type {Pages.PageDataEnumerationOptions} **/
                    var pageEnumerationOptions = {
                        currentOnly: options.currentPageOnly,
                        skipMaster:  true,
                    };
                    Pages.each(function () {
                        var pageOptions     = JSON.parse(JSON.stringify(options));
                        operationState.page = Pages.info;
                        operationState.number++;

                        //var export_file_path =  Document.get_export_page_name();
                        //var export_file_path = folder + "/" + export_file_name + ".png";
                        //Document.export_in(export_file_path, options.format);
                        Document.exportPageAuto(pageOptions, operationState);
                    }, pageEnumerationOptions);
                },
                /**
                 *
                 * @param [options] {ExportPagesOptions}
                 */
                exportPagesAuto: function (options) {
                    if (!Document.isSaved()) {
                        alert("You need to save the document first!");
                        return;
                    }
                    options        = Document.getExportOptions(options);
                    options.simple = true;
                    Document.exportPages(options);
                },
                /**
                 *
                 * @param [options] {ExportPagesOptions}
                 * @param [operationState] {PageOperationState}
                 */
                exportPageAuto:     function (options, operationState) {
                    if (!Document.isSaved()) {
                        alert("You need to save the document first!");
                        return;
                    }
                    options        = DocumentInternals.processExportPagesOptions(options);
                    var exportName = DocumentInternals.getExportPageName(options);
                    //utils.log("Export Page: Name: " + JSON.stringify(exportName, null, "\t"));
                    if (options.main && !exportName.isMain) {
                        utils.log("Skipping Page: " + exportName.page);
                        return;
                    }

                    //utils.log("Exporting Page: \u2192 " + fw.getDocumentDOM().pageName);
                    //utils.log("Exporting Page: " + fwFiles.convertURLToOSPath(exportName.path, true));
                    Document.exportPage(exportName.path, options, operationState);
                },
                /**
                 *
                 * @param [options] {ExportPagesOptions}
                 */
                exportPageToFolder: function (options) {
                    Document.exportPage(null, options);
                },
                /**
                 *
                 * @param [path] {string}
                 * @param [options] {ExportPagesOptions}
                 * @param [operationState] {PageOperationState}
                 */
                exportPage:         function (path, options, operationState) {
                    //noinspection JSUnusedLocalSymbols
                    var originalPath = path;
                    options          = DocumentInternals.processExportPagesOptions(options);
                    if (!operationState) {
                        operationState = {
                            completed: 0,
                            number:    1,
                            page:      Pages.info,
                        };
                    }
                    if (!operationState.extension)
                        operationState.extension = ".png";
                    if (!operationState.extension.startsWith("."))
                        operationState.extension = "." + operationState.extension;
                    if (path) {
                        if (!path.endsWith(operationState.extension))
                            path += operationState.extension;
                        var directory     = Files.getDirectory(path);
                        //var directoryPath = fwFiles.convertURLToOSPath(directory, true);
                        //utils.log(" > Creating Directory: " + directoryPath);
                        var createdCount  = fwFiles.createDirectories(directory);
                        if (createdCount > 0) {
                            //utils.log("Created Directory:  " + " ".repeat(35) + directoryPath);
                        }
                    }
                    var filePath = fwFiles.convertURLToOSPath(path, true);
                    //alert("Exporting Page In: " + options + "\r\n" + path);
                    Page.setExportFormat(options.format);
                    //utils.log("Exporting Page \u2192 " + path);
                    utils.log("Exporting Page: " + fw.getDocumentDOM().pageName.padEnd(35) + " \u2192 " + filePath);
                    fw.exportDocumentAs(null, path, null);
                    //utils.log("Exporting Page Complete");
                    operationState.completed++;
                },
                isMasterPage: function () {
                    var dom = fw.getDocumentDOM();
                    if (dom.currentPageNum !== 0)
                        return false;
                    return dom.hasMasterPage() || dom.pageName === 'Master Page';
                },
                isOpen:       function () {
                    return (fw.documents.length > 0);
                },
                isSaved:      function () {
                    return (Document.isOpen() && fw.getDocumentPath(null) !== "");
                },
                isNew:        function () {
                    return (Document.isOpen() && fw.getDocumentPath(null) === "");
                },
                isEmpty:      function () {
                    var dom = fw.getDocumentDOM();
                    if (Pages.count > 1 || dom.currentFrameNum > 0)
                        return false;
                    var elementCount = Page.getElementCount();
                    utils.log("Document has " + elementCount + "elements");
                    return elementCount === 0;
                },
                path:         function () {
                    if (fw.getDocumentPath(null) === '') {
                        // not saved
                        return null;
                    } else {
                        return Files.getDirectory(fw.getDocumentPath(null)) + "/";
                    }
                },
                dump:                     function () {
                    var filePath = fw.userJsCommandsDir,
                        fileName = fw.getDocumentDOM().docTitleWithoutExtension;

                    if (fileName === "") {
                        fileName = "untitled";
                    }
                    fileName = "/" + fileName + "_dump.txt";
                    Files.createFile(filePath + fileName, ".txt", "FWMX");
                    var my_file = Files.open(filePath + fileName, undefined, true); // Open file for writing
                    my_file.write(fw.getDocumentDOM().javascriptString);
                    my_file.close();
                },
            };

            OcInternals.defineElementAccessors(Document, ['bounds', 'size', 'position']);

            ///** @type {PagesInternal} **/
            //noinspection JSValidateTypes,JSUnresolvedVariable
            var PagesInternals = PagesInternals || {
                /**
                 * @param [options] {OrangeCommands.Pages.PageRangeOptions}
                 * @param [count] {number}
                 **/
                getRange: function (options, count) {
                    /** @type {OrangeCommands.Pages.PageRangeOptions} **/
                    options = options || {};
                    var total = typeof count === 'undefined'
                        ? 10000
                        : count;

                    //noinspection JSValidateTypes
                    var start = options.start || options.offset || 0;
                    var end = options.end;
                    if (!end) {
                        var max     = options.max;
                        end = (max && max > 0)
                            ? Math.min(start + max - 1, total)
                            : total;
                    }

                    return {
                        start: start,
                        end: end
                    };
                },

                /**
                 * @param callback {OrangeCommands.Pages.PageCallbackInterface}
                 * @param [options] {OrangeCommands.Pages.PageDataEnumerationOptions}
                 **/
                each: function (callback, options) {
                    options = options || {};
                    if (options.currentOnly)
                        return PagesInternals.withPage(callback, options.data);
                    var range = PagesInternals.getRange(options, Pages.count);
                    //var start = options.start || 0;
                    //var total = Pages.count;
                    //var max   = options.max && options.max > 0
                    //    ? Math.min(options.max, total)
                    //    : total;
                    for (var i = range.start; i < range.end; i++) {
                        var page = Pages.open(i, options.data);
                        if (options.skipMaster && page.isMaster)
                            continue;
                        callback.call(this, page);
                    }
                },

                /**
                 * @param callback
                 * @param [options] {OrangeCommands.Pages.PageStateOptions}
                 **/
                withPage: function (callback, options) {
                    var page = Page.getInfo(options);
                    //noinspection JSUnresolvedFunction
                    callback.call(this, page);
                },
            };
            //noinspection JSValidateTypes
            /** @type {PagesStatic} **/
            var Pages = Pages || {

                /**
                 * @param [options] {OrangeCommands.Pages.PageDataEnumerationOptions}
                 **/
                synchronizeSymbolNames: function (options) {
                    /** @type {OrangeCommands.Pages.PageDataEnumerationOptions} **/
                    options = options || {};
                    var data = options.data = options.data || {};
                    data.asPageElement = true;
                    var symbolInfo = data.symbolInfo = data.symbolInfo || {};
                    symbolInfo.synchronizeNames = true;

                    var pages = Pages.getPageElements(options);
                    return _.map(pages, 'elementCount');
                },



                /**
                 * @param [options] {OrangeCommands.Pages.PageDataEnumerationOptions}
                 **/
                renameSymbols: function (options) {
                    /** @type {OrangeCommands.Pages.PageDataEnumerationOptions} **/
                    options = options || {};
                    var data = options.data = options.data || {};
                    data.asPageElement = true;
                    var symbolInfo = data.symbolInfo = data.symbolInfo || {};
                    var rename = symbolInfo.rename = symbolInfo.rename || {};
                    rename.enabled = true;
                    /** @type {RenamePagesOptions} **/
                    var renameOptions = rename.options = rename.options || {};
                    if (renameOptions.currentPageOnly) {
                        options.currentOnly = true;
                    }

                    var pages = Pages.getPageElements(options);
                    return _.map(pages, 'elementCount');
                },

                /**
                 * @param [options] {OrangeCommands.Pages.PageDataEnumerationOptions}
                 **/
                getElementData: function (options) {
                    /** @type {OrangeCommands.Pages.PageDataEnumerationOptions} **/
                    options = options || {};
                    var pages   = Pages.getPageElements(options),
                        data = {
                            count: 0,
                            names: [],
                            elements: []
                        };
                    _.each(pages, function (/* PageData */ page) {
                        var pageData = page.elementData;
                        data.count += pageData.count;
                        [].push.call(data.names, pageData.names);
                        [].push.call(data.elements, pageData.elements);
                    });
                    return data;
                },
                summarize: function(pages, /* OrangeCommands.Pages.PageSummaryOptions */ options) {
                    //noinspection JSValidateTypes
                    options = options || {
                        flatten: 'symbols'
                    };
                    if (options.flatten === 'symbols') {
                        options.excludeNames = true;
                    }
                    if (options.distinct && options.sort !== false) {
                        options.sort = options.distinct;
                    }
                    //noinspection JSUnresolvedFunction
                    var chain = _.chain(pages)
                            .map(function (page) {
                                return Pages.summarizePage(page, options);
                            })
                            .filter(function (/* OrangeCommands.Pages.PageSummary */ summary) {
                                return summary.names || summary.symbols
                            });
                    var mapProperty = options.flatten ? options.flatten : options.map;

                    if (mapProperty) {
                        chain = chain
                            .map(function (/* OrangeCommands.Pages.PageSummary */ summary) {
                                return summary[mapProperty];
                            });
                    }
                    if (options.flatten) {
                        chain = chain
                            .flatten();
                    }
                    if (options.distinct) {
                        chain = chain
                            .uniq(options.distinct);
                    }
                    var result = chain
                            .value();
                    if (options.sort) {
                        result = _.sortBy(result, options.sort);
                    }
                    return result;
                },
                summarizePage: function(/** PageData **/ page, /* OrangeCommands.Pages.PageSummaryOptions */ options) {
                    if (!options) {
                        //noinspection JSValidateTypes
                        options = {};
                    }
                    //noinspection JSValidateTypes
                    /** @type {OrangeCommands.Pages.PageSummary} **/
                    var summary = {
                        number:  page.number,
                        name:  page.name,
                        names:   page.elementData.names,
                        symbols: page.symbolInfo
                    };
                    if (options.excludeNames || !summary.names.length)
                        delete summary.names;
                    if (options.excludeSymbols  || !summary.symbols.length)
                        delete summary.symbols;
                    return summary;
                },
                getSummary: function(/** OrangeCommands.Pages.PagesSummaryOptions **/ options) {
                    options = options || {};
                    var pages, summary;
                    pages   = Pages.getPageElements(options.pages);
                    summary = Pages.summarize(pages, options.summary);
                    return summary;
                },
                getCount: function () {
                    try {
                        return fw.getDocumentDOM().pagesCount;
                    } catch (exception) {
                        // Create page at the end of page list...
                        fw.getDocumentDOM().addNewPage();

                        // Move it to the first position
                        //noinspection JSUnresolvedVariable
                        Pages.lastPageIndex = last_page_index = fw.getDocumentDOM().currentPageNum;
                        fw.getDocumentDOM().reorderPages(Pages.lastPageIndex, 0);

                        // Change active page to first page
                        fw.getDocumentDOM().changeCurrentPage(0);

                        // Remove it
                        fw.getDocumentDOM().deletePageAt(0);

                        return Pages.lastPageIndex;
                    }
                },
                /** @returns {OrangeCommands.Pages.PageInfo} **/
                getInfo:  function () {
                    var dom = fw.getDocumentDOM();
                    //noinspection JSValidateTypes
                    return {
                        index: dom.currentPageNum,
                        name:  dom.pageName,
                    }
                },

                /**
                 * @param [options] {OrangeCommands.Pages.PageDataEnumerationOptions}
                 **/
                getPageElements:         function (options) {
                    var pages = {};
                    Pages.eachPageElements(function (page) {
                        pages[page.index] = page;
                    }, options);
                    return pages;
                },

                /**
                 * @param [options] {OrangeCommands.Pages.PageDataEnumerationOptions}
                 **/
                getPageElementsList:         function (options) {
                    var pages = [];
                    Pages.eachPageElements(function (page) {
                        pages.push(page);
                    }, options);
                    return pages;
                },

                /**
                 * @param callback
                 * @param [options] {OrangeCommands.Pages.PageDataEnumerationOptions}
                 **/
                each:         function (callback, options) {
                    PagesInternals.each(callback, options)
                },

                /**
                 * @param callback
                 * @param [options] {OrangeCommands.Pages.PageDataEnumerationOptions}
                 **/
                eachPageElements:         function (callback, options) {
                    options = options || {};
                    options.data = options.data || {};
                    options.data.asPageElement = true;
                    PagesInternals.each(callback, options)
                },

                /**
                 * @param callback
                 * @param [options] {OrangeCommands.Pages.PageStateOptions}
                 **/
                withPage:     function (callback, options) {
                    PagesInternals.withPage(callback, options);
                },

                /**
                 * @param callback
                 * @param [options] {OrangeCommands.Pages.PageStateOptions}
                 **/
                withPageElements:     function (callback, options) {
                    options = options || {};
                    options.data = options.data || {};
                    options.data.asPageElement = true;
                    PagesInternals.withPage(callback, options);
                },
                fitCanvas:      function (dom) {
                    dom = dom || fw.getDocumentDOM();
					dom.setDocumentCanvasSizeToDocumentExtents(true);
					// if (fw.selection.length < 2 && Page.elements.length === 1) {
						// Elements.fitCanvas();
					// } else {
						// dom.setDocumentCanvasSizeToDocumentExtents(true);
					// }
                },
                trimCanvas:      function (dom) {
                    dom = dom || fw.getDocumentDOM();
					dom.setDocumentCanvasSizeToDocumentExtents(false);
					// if (fw.selection.length < 2 && Page.elements.length === 1) {
						// Elements.trimCanvas();
					// } else {
						// dom.setDocumentCanvasSizeToDocumentExtents(false);
					// }
                },
                setName:      function (newName, dom) {
                    dom = dom || fw.getDocumentDOM();
                    dom.setPageName(dom.currentPageNum, newName);
                },
                change:      function (pageNumber) {
                    fw.getDocumentDOM().changeCurrentPage(pageNumber);
                },

                /**
                 * @param pageNumber {number}
                 * @param [options] {OrangeCommands.Pages.PageStateOptions}
                 **/
                open:      function (pageNumber, options) {
                    Pages.change(pageNumber);
                    return Page.getInfo(options);
                },
                verticalTrim: function () {
                    Pages.each(Page.verticalTrim);
                },

                /**
                 *
                 * @param [options] {ExportPageFormat}
                 */
                setExportFormat:        function (options) {
                    Pages.each(function () {
                        Page.setExportFormat(options);
                    });
                },
                setExportFormatAsPNG24: function () {
                    Pages.each(Page.setExportFormatAsPNG24);
                },
                setExportFormatAsPNG32: function () {
                    Pages.each(Page.setExportFormatAsPNG32);
                },
            };

            OcInternals.defineElementAccessors(Pages, ['count', 'info', 'pageElements', 'pageElementsList', 'summary']);

            //noinspection JSUnresolvedVariable
            var PageInternals = PageInternals || {
                formatPresets: {
                    PNG24: {
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
                    },

                    PNG32: {
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
                    },
                }
            };

            /**
             * @class {PageState}
             * @param [options] {OrangeCommands.Pages.PageStateOptions}
             * @constructor
             *
             *  **/
            var PageState = function PageState(options) {
                /** @type {OrangeCommands.Pages.PageStateOptions} **/
                options = options || {};
                var info  = Pages.info;
                //utils.logify('Get Page State #' + (info.index + 1), options);
                //noinspection JSValidateTypes
                var
                    /** @type {PageData} **/
                    data = this,
                    elementData = Document.getElementData(options.layers);
                _.assign(data, {
                    name: info.name,
                    originalName: info.name,
                    index: info.index,
                    number: info.index + 1,
                    isMaster: Document.isMasterPage(),
                    elementData: elementData,
                    elements: elementData.elements,
                    elementCount: elementData.count,
                    symbols: Elements.getSymbols(elementData.elements, options.symbols),
                    symbolInfo: Elements.getSymbolInfo(elementData.elements, options.symbolInfo)
                });
            };



            /** @type {PageClass} **/
            var Page = function Page() {
                var info  = Pages.info;
                //noinspection JSAnnotator
                this.name = this.originalName = info.name;
                //noinspection JSAnnotator
                this.index    = info.index;
                //noinspection JSAnnotator
                this.number    = info.number;
                //noinspection JSAnnotator
                this.isMaster = Document.isMasterPage();
            };

            /**
             * @param options {OrangeCommands.Pages.PageStateOptions}
             **/
            Page.getInfo = function (options) {
                options = options || {};
                return options.asPageElement
                    ? new PageState(options)
                    : new Page();
            };
            Page.prototype.setName = function (newName) {
                Pages.setName(newName);
                //noinspection JSAnnotator
                this.name = newName;
            };

            Page.getElementCount = function () {
                var count = Selection
                    .all
                    .length;
                return count;
            };
            Page.verticalTrim    = function () {
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
            };

            /**
             *
             * @param [options] {ExportPageFormat}
             */
            Page.setExportFormat = function (options) {
                var exportOptions,
                    setMatte = false;
                if (options === undefined) {
                    options = 'CURRENT';
                }
                if (typeof options === 'string') {
                    var formatName    = options.toUpperCase();
                    var formatPresets = PageInternals.formatPresets;
                    if (formatPresets.hasOwnProperty(formatName)) {
                        exportOptions = formatPresets[formatName];
                        setMatte      = true;
                    }
                } else {
                    exportOptions = options;
                }
                if (!exportOptions)
                    return;
                fw.getDocumentDOM().setExportOptions(exportOptions);
                if (setMatte) {
                    //utils.log("Setting Matte Color to Transparent");
                    fw.getDocumentDOM().setMatteColor(true, "#00000000");
                }
            };
            Page.setExportFormatAsPNG24 = function () {
                Page.setExportFormat('PNG24');
            };
            Page.setExportFormatAsPNG32 = function () {
                Page.setExportFormat('PNG32');
            };
            //
            ///** @returns {Element[]} **/
            //Page.getElements = function () {
            //    return Selection.current;
            //};
            /**
             *
             * @param {LayerElementDataOptions} [options]
             * @return {LayerElementData}
             */
            Page.getElementData = function (options) {
                return Document.getElementData(options);
            };

            /**
             * @param [options] {OrangeCommands.Elements.SymbolDataOptions}
             **/
            Page.synchronizeSymbolNames = function (options) {
                /** @type {OrangeCommands.Elements.SymbolDataOptions} **/
                options = options || {};
                options.synchronizeNames = true;

                var symbols = this.getSymbolInfo(options);
                return _.map(symbols, 'name');
            };

            /**
             * @param [options] {OrangeCommands.Elements.SymbolDataOptions}
             **/
            Page.renameSymbols = function (options) {
                /** @type {OrangeCommands.Elements.SymbolDataOptions} **/
                options = options || {};
                /** @type {RenameState} **/
                var rename = options.rename = options.rename || {};
                rename.enabled = true;
                var symbols = this.getSymbolInfo(options);
                return _.map(symbols, 'name');
            };
            /**
             *
             * @param {InsertSymbolOptions} [options]
             */
            Page.copySymbols = function(options) {
                options = options || {};
                /** @type {LayerElementDataOptions} **/
                var layerOptions = {
                    reverseLayers: options.reverseLayers
                };

                var symbols = Page.getSymbolInfo({
                    layers: layerOptions
                });
                var symbolNames = _.map(symbols, 'name');
                if (options.reverse) {
                    symbolNames = symbolNames.reverse();
                }
                symbolNames = _.uniq(symbolNames);
                var message       = "Copying " + symbolNames.length + " Symbols to New Pages"
                    + (options.reverseLayers ? " [Reversed]" : "") + ": "
                    //+ (options.ignoredNames && options.ignoredNames[0])
                ;

                utils.log(message + "\n\t - " + symbolNames.join("\n\t - "));
                Document.insertSymbols(symbolNames, options);
            };
            /**
             *
             * @param {InsertSymbolOptions} [options]
             */
            Page.copySymbolsReversed = function(options) {
                options = options || {};
                options.reverseLayers = true;
                return Page.copySymbols(options);
            };

            OcInternals.defineElementAccessors(Page, ['elementCount']);



            //noinspection JSValidateTypes
            /**
             * @type {OrangeCommands.Color}
             * Color Main
             ***/
            var Color = Color || {
                hex_to_rgba: function (hexstr) {
                    var a, i, r, g, b, alpha;
                    hexstr = hexstr.replace(/[^0-9a-f]+/ig, '');
                    if (hexstr.length === 3) {
                        a = hexstr.split('');
                    } else if (hexstr.length === 6 || hexstr.length === 8) {
                        a = hexstr.match(/(\w{2})/g);
                    }
                    if (a.length === 3) {
                        return '#' + hexstr;
                    }
                    for (i = a.length - 1; i >= 0; i--) {
                        if (a[i].length === 2) {
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
                    if (a[3] === 0) {
                        alpha = 0;
                    } else {
                        alpha = Math.round((a[3] / parseInt('ff', 16)) * 100) / 100;
                    }
                    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
                },
            };
            /**
             * @type {OrangeCommands.UI}
             * UI Main
             ***/
            var UI    = UI || {
                prompt: function (txt, default_value) {
                    setTimeout('quit()', 10000);
                    return prompt(txt, default_value);
                },
            };
            /**
             * @type {OrangeCommands.Sort}
             * Sort Main
             ***/
            var Sort  = Sort || {
                by_y: function (a, b) {
                    return a.top - b.top;
                },
                by_x: function (a, b) {
                    return a.left - b.left;
                },
            };
            /**
             * @type {OrangeCommands.File}
             * File Main
             ***/
            var File  = File || {};

            File.create = function (contents, url) {
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
            };

            //noinspection JSValidateTypes
            /**
             * @type {OrangeCommands.FW}
             * FW Main
             ***/
            var FW        = FW || {
                getTMP: function () {
                    return Files.getTempFilePath(null);
                },
            };

            /**
             * @type {ElementIdentifier}
             * @param {Fw.FwElement} element
             * @constructor
             * **/
            var ElementIdentifier = function ElementIdentifier(element) {
                this.id = element.symbolID;
                this.symbol = element.symbolName;
                this.name = element.name;
                this.value = this.name || "<SYM> " + this.symbol;
            };

            /**
             *
             * @param {Fw.FwElement} element
             * @return {ElementIdentifier}
             */
            ElementIdentifier.fromElement = function (element) {
                return new ElementIdentifier(element);
            };

            /**
             *
             * @param {Fw.FwElement[]} elements
             * @return {ElementIdentifier[]}
             */
            ElementIdentifier.fromElements = function (elements) {
                return _.map(elements, ElementIdentifier.fromElement);
            };

            /**
             *
             * @param {Fw.FwElement[]} elements
             * @param {ElementIdentifier|ElementIdentifier[]} identifiers
             * @return {Fw.FwElement[]}
             */
            ElementIdentifier.filter = function (elements, identifiers) {
                //alert("Filtering Identifiers 1");
                if (!utils.isArray(identifiers))
                    identifiers = [identifiers];
                //alert("Filtering Identifiers 2");
                var matcher = function (identifier) {
                    return identifier.match(elements);
                };
                //alert("Filtering Identifiers 3A");
                //var matches = _.map(identifiers, matcher);
                //alert("Filtering Identifiers 3B");
                //var success = _.filter(matches, 'success');
                //alert("Filtering Identifiers 3C");
                //utils.logify('Filtering ' + elements.length + ' Elements with ' + identifiers[0], matches);
                return _.chain(identifiers)
                 .map(matcher)
                 .filter('success')
                 .map('value')
                 .value();
            };

            /**
             *
             * @param {string|ElementIdentifier|Fw.FwElement} other
             * @return {number}
             */
            ElementIdentifier.prototype.compareTo = function(other) {
                if (typeof other === 'string') {
                    //alert("Checking Identifier Compare To String");
                    if (this.name === other || this.symbol === '<SYM> ' + other || this.symbol === other || this.id === other) {
                        return 0;
                    }
                    return other > this.value ? 1 : -1;
                }
                if (!(other.hasOwnProperty('id') && other.hasOwnProperty('symbol') && other.hasOwnProperty('value'))) {
                    //alert("Checking Identifier Compare To FwElement");
                    other = ElementIdentifier.fromElement(other);
                } else {
                    //alert("Checking Identifier Compare To Object");
                }
                if (other.name === this.name && other.symbol === this.symbol && other.id === this.id) {
                    return 0;
                }
                //alert("Checking Identifier Compare To Object DIFF");
                return other.value > this.value ? 1 : -1;
            };

            /**
             *
             * @param {string|ElementIdentifier} other
             * @return {boolean}
             */
            ElementIdentifier.prototype.equals = function(other) {
                var cmp = this.compareTo(other);
                //alert("Checking Identifier.equals " + (typeof this.compareTo) + " = " + cmp);
                return cmp === 0;
            };

            /**
             *
             * @param {Fw.FwElement[]} elements
             * @return {OrangeCommands.Elements.ElementIdentifierMatch}
             */
            ElementIdentifier.prototype.match = function(elements) {
                var self = this;
                //alert("Checking Identifier.match [] " + (typeof this) + "\n" + _.keys(this));
                /** @type {Fw.FwElement} **/
                var element = _.find(elements, function (element) {
                    return self.equals(element);
                });
                //alert("Matching Identifier Done: " + !!element);

                if (!element) {
                    //noinspection JSValidateTypes
                    return {
                        success: false
                    };
                }

                //noinspection JSValidateTypes
                return {
                    success: true,
                    value: element
                };
            };

            /**
             *
             * @return {string}
             */
            ElementIdentifier.prototype.toString = function() {
                return this.value;
            };

            //noinspection JSValidateTypes
            /** @type {ElementsStatic} **/
            var Elements  = Elements || {
			
                /**
                 *
                 * @param {Fw.FwElement|Fw.FwElement[]} elements
                 * @param {Fw.FwDocument} [dom]
                 * @param {OrangeCommands.Elements.RepositionOptions} [options]
                 * @param {OrangeCommands.Elements.RepositionOptions} [baseOptions]
                 */
                reposition: function (elements, dom, options, baseOptions) {
                    if (!fw.documents.length)
                        return;
                    if (typeof options === 'undefined') {
                        if (dom && !dom.hasOwnProperty('width')) {
                            //noinspection JSValidateTypes
                            options = dom;
                            dom = undefined;
                        } else if (elements && !utils.isArray(elements) && !elements.hasOwnProperty('width')) {
                            //noinspection JSValidateTypes
                            options = elements;
                            elements = undefined;
                        }
                        options = options || {};
                    }
                    options = _.defaults({}, baseOptions, options);
                    //Selection.save();

                    var logger = utils.getLogger('Reposition', 10),
                        log = logger.log;
                    var selection = {
                        original: [].slice.call(fw.selection),
                        names: Selection.names,
                        identifiers: Selection.identifiers,
                        updated: false
                    };
					if (elements) {
						if (!utils.isArray(elements)) {
							elements = [elements];
						}
					} else if (typeof elements === 'undefined') {
						elements = Selection.current;
						if (!elements.length) {
							elements = Selection.all;
						}
                        
                        if (!fw.selection.length) {
                            fw.selection = [].slice.call(elements);
                            selection.updated = true;
                        }
                    }

                    if (!elements.length) {
                        return;
                    }

                    fw.selection = [];
                    
					dom = dom || fw.getDocumentDOM();
                    if (options.fitToCanvas) {
                        var extents = getExtents();
                        runFitToCanvas(extents);
                    }

                    if (options.align) {
                        logger.section = 'Align';
                        _.each(elements, runAlign);
                        //log('Alignment Complete')
                    }

                    restoreSelection();

                    function getExtents() {
                        var extents = {
                            width:  0,
                            height: 0
                        };
                        _.each(elements, function (element) {
                            _.forIn(extents, function (value, dimension) {
                                extents[dimension] = Math.max(value, element[dimension]);
                            });
                        });
                        return extents;
                    }

                    function runFitToCanvas(extents) {
                        var fitMode = options.fitToCanvasMode || 'both';
                        var fitModes = {
                            grow: fitMode !== 'shrink',
                            shrink: fitMode !== 'grow'
                        };

                        var bounds = Document.getBounds(dom);
                        var size = Document.getSize(dom);

                        var deltas = {
                            width: size.width - extents.width,
                            height: size.height - extents.height
                        };
                        var updated;
                        for (var dimension in deltas) {
                            if (!deltas.hasOwnProperty(dimension))
                                continue;
                            var delta = deltas[dimension];
                            if (delta === 0)
                                continue;
                            if (delta > 0) {
                                if (!fitModes.shrink)
                                    continue;
                            } else if (!fitModes.grow)
                                continue;

                            delta = size[dimension] = extents[dimension];
                            if (dimension === 'width') {
                                bounds.right = bounds.left + delta;
                            } else {
                                bounds.bottom = bounds.top + delta;
                            }
                            //size[dimension] = element[dimension];
                            updated = true;
                        }
                        if (updated) {
                            var message = "Fit To Canvas: Resizing Canvas to " + size.width + "x" + size.height;
                            if (logger.active)
                                utils.logify(message + " to fit extents " + extents.width + "x" + extents.height, bounds);
                            else
                                logger.info(message);
                            dom.setDocumentCanvasSize(bounds, true);
                        }
                    }

                    function runAlign(element) {

                        var alignment = options.alignment || 'center';
                        var isCenter = alignment.startsWith('center');
                        if (!isCenter) {
                            //noinspection JSCheckFunctionSignatures
                            dom.align(alignment);
                            return;
                        }
                        var items = {
                            container: dom,
                            element: element
                        };
                        var info = _.mapValues(items, Document.getPosition);
                        info.name = element.name || "[SYM] " + element.symbolName;

                        logger.info("Centering Element: " + info.name + " [" + element.width + "x" + element.height + "]");
                        var delta = {
                            x: alignment === 'center vertical'
                                   ? 0
                                   : Math.round((dom.width - element.width) / 2) - element.left,
                            y: alignment === 'center horizontal'
                                   ? 0
                                   : Math.round((dom.height - element.height) / 2) - element.top,
                        };
                        if (delta.x === 0 && delta.y === 0) {
                            return;
                        }

                        var identifier = ElementIdentifier.fromElement(element);
                        logger.debug("Selecting Element");
                        try {
                            Selection.setIdentifiers(ElementIdentifier.fromElement(element));
                            //fw.selection = [element];
                        } catch (ex) {

                        }

                        log(10, "Moving by " + (delta.x + "x" + delta.y).padEnd(12) + " [Selection x " + (fw.selection && fw.selection.length) + "]");
                        // use moveSelectionBy and moveFillVectorHandleBy to center
                        // the SVG element in the document, since dom.align doesn't
                        // move the fill handles
                        dom.moveSelectionBy(delta, false, false);

                        logger.trace("Moving Fill Vector");
                        //utils.log("Centering Element: Moving Fill Vector Handle")
                        dom.moveFillVectorHandleBy(delta, "start", false, false);
                        logger.debug(1, "Complete");
                    }

                    function restoreSelection() {
                        log('Restoring Selection: ' + selection.identifiers.length + ' Elements: \n - ' + _.map(selection.identifiers, 'value')
                                                                                                           .join(',\n - '));
                        //utils.logify('Restoring Selection', selection.original.length);
                        var selectedElements = selection.original;
                        try {
                            fw.selection = selectedElements.slice();
                        } catch (ex) {
                            //logger.error('WARN: Unable to Restore Selection; try to restore Selection via names');
                            try {
                                Selection.identifiers = selection.identifiers;
                                //Selection.names = selection.names;
                            } catch (ex) {
                                if (selectedElements.length > 1)
                                    logger.error('ERROR: Unable to Restore Selection: ' + selectedElements.length);
                            }
                        }
                        return selectedElements;
                    };
                },

                /**
                 *
                 * @param {Fw.FwElement} element
                 * @param {Fw.FwDocument} [dom]
                 * @param {OrangeCommands.Elements.RepositionOptions} [options]
                 */
                fitCanvas: function (element, dom, options) {
                    return this.reposition(element, dom, options, {
                        fitToCanvas: true,
                        fitToCanvasMode: 'both'
                    });
                },

                /**
                 *
                 * @param {Fw.FwElement} element
                 * @param {Fw.FwDocument} [dom]
                 * @param {OrangeCommands.Elements.RepositionOptions} [options]
                 */
                trimCanvas: function (element, dom, options) {
                    return this.reposition(element, dom, options, {
                        fitToCanvas: true,
                        fitToCanvasMode: 'shrink'
                    });
                },

                /**
                 *
                 * @param {Fw.FwElement} element
                 * @param {Fw.FwDocument} [dom]
                 * @param {OrangeCommands.Elements.RepositionOptions} [options]
                 */
                fitAndCenter: function (element, dom, options) {
                    return this.reposition(element, dom, options, {
                        align: true,
                        alignment: 'center',
                        fitToCanvas: true,
                        fitToCanvasMode: 'both',
                    });
                },
				
                /**
                 *
                 * @param {Fw.FwElement} element
                 * @param {Fw.FwDocument} [dom]
                 * @param {OrangeCommands.Elements.RepositionOptions} [options]
                 */
                center: function (element, dom, options) {
                    return this.reposition(element, dom, options, {
                        align: true,
                        alignment: 'center'
                    });
                    return;
                    if (!fw.documents.length)
                        return;
                    if (typeof element === 'undefined')
                        element = Selection.first;
                    if (!element)
                        return;
                    dom = dom || fw.getDocumentDOM();
                    var delta = {
                        x: Math.round((dom.width - element.width) / 2) - element.left,
                        y: Math.round((dom.height - element.height) / 2) - element.top
                    };
					
					utils.log("Centering Element: Moving by " + delta.x + "x" + delta.y)

                    // use moveSelectionBy and moveFillVectorHandleBy to center
                    // the SVG element in the document, since dom.align doesn't
                    // move the fill handles
                    dom.moveSelectionBy(delta, false, false);
					
					
					utils.log("Centering Element: Moving Fill Vector Handle")
                    dom.moveFillVectorHandleBy(delta, "start", false, false);
					utils.log("Centering Element: Complete")
                },

                /**
                 *
                 * @param symbol {OrangeCommands.Elements.SymbolInfo}
                 * @param {RenameState} [renamer]
                 * @return {boolean}
                 */
                renameSymbol: function (symbol, renamer) {
                    if (!renamer || renamer.enabled === false) {
                        return false;
                    }
                    var options = renamer.options = renamer.options || {};
                    if (!renamer.hasOwnProperty('rule')) {
                        renamer.rule = OcInternals.getRegexRule(options, 'Symbol', 'Rename Symbols');
                    }
                    var regex = renamer.rule;
                    if (!regex) {
                        renamer.enabled = false;
                        return false;
                    }
                    var oldName                   = symbol.name;
                    var newName                   = oldName.replace(regex.search, regex.replacement);
                    options.debug.newName = true;
                    if (options.debug.newName) {
                        //utils.log("Old Name: " + oldName);
                        utils.log("New Name: " + newName);
                    }
                    symbol.originalName = symbol.name;
                    symbol.name         = newName;
                    fw.getDocumentDOM().setSymbolProperties(oldName, symbol.type, newName, false);
                    return true;
                },

                /**
                 *
                 * @param element {Fw.FwElement}
                 * @param {OrangeCommands.Elements.SymbolDataOptions} [options]
                 * @return {OrangeCommands.Elements.SymbolInfo|OrangeCommands.Elements.Symbol}
                 */
                getIdentifier:    function (element, options) {
                    if (!options || typeof options !== 'object') {
                        //noinspection JSValidateTypes
                        /** @type {OrangeCommands.Elements.SymbolDataOptions} **/
                        options = {};
                    }

                    //noinspection JSValidateTypes
                    /** @type {OrangeCommands.Elements.SymbolInfo|OrangeCommands.Elements.Symbol} **/
                    var symbol = {
                        id: element.symbolID,
                    };
                    if (!symbol.id)
                        return undefined;

                    symbol.name        = element.symbolName;
                    symbol.elementName = element.name;
                    symbol.type = element.instanceType;

                    this.renameSymbol(symbol, options.rename);

                    //noinspection JSValidateTypes
                    var hasSameName = symbol.elementName === symbol.name && symbol.elementName !== null;

                    if (!options.full) {
                        if (hasSameName) {
                            delete symbol.elementName;
                        }
                    }
                    if (options.includeElementReference) {
                        symbol.element = element;
                    } else {
                        delete symbol.type;
                    }
                    if (options.synchronizeNames) {
                        if (hasSameName) {
                            //utils.log("No need to synchronize element " + element.name);
                        } else {
                            utils.log((symbol.elementName === null ? 'Setting Initial Name' : "Renaming " + symbol.elementName) + " to " + symbol.name);
                            fw.selection = element;
                            var dom      = fw.getDocumentDOM();
                            dom.setElementName(symbol.name);
                        }
                    }
                    return symbol;
                },

                /**
                 *
                 * @param element {Fw.FwElement}
                 * @param {OrangeCommands.Elements.SymbolDataOptions} [options]
                 * @return {OrangeCommands.Elements.SymbolInfo|OrangeCommands.Elements.Symbol}
                 */
                getSymbol:    function (element, options) {
                    if (!options || typeof options !== 'object') {
                        //noinspection JSValidateTypes
                        /** @type {OrangeCommands.Elements.SymbolDataOptions} **/
                        options = {};
                    }

                    //noinspection JSValidateTypes
                    /** @type {OrangeCommands.Elements.SymbolInfo|OrangeCommands.Elements.Symbol} **/
                    var symbol = {
                        id: element.symbolID,
                    };
                    if (!symbol.id)
                        return undefined;

                    symbol.name        = element.symbolName;
                    symbol.elementName = element.name;
                    symbol.type = element.instanceType;

                    this.renameSymbol(symbol, options.rename);

                    //noinspection JSValidateTypes
                    var hasSameName = symbol.elementName === symbol.name && symbol.elementName !== null;

                    if (!options.full) {
                        if (hasSameName) {
                            delete symbol.elementName;
                        }
                    }
                    if (options.includeElementReference) {
                        symbol.element = element;
                    } else {
                        delete symbol.type;
                    }
                    if (options.synchronizeNames) {
                        if (hasSameName) {
                            //utils.log("No need to synchronize element " + element.name);
                        } else {
                            utils.log((symbol.elementName === null ? 'Setting Initial Name' : "Renaming " + symbol.elementName) + " to " + symbol.name);
                            fw.selection = element;
                            var dom      = fw.getDocumentDOM();
                            dom.setElementName(symbol.name);
                        }
                    }
                    return symbol;
                },
                getSymbolInfo: function (elements, options) {
                    options = options || {};
                    return _.filter(_.map(elements, function (element) {
                        return Elements.getSymbol(element, options);
                    }));
                },
                /**
                 *
                 * @param elements {Fw.FwElement[]}
                 * @param {OrangeCommands.Elements.SymbolDataOptions} [options]
                 * @return {OrangeCommands.Elements.Symbol[]}
                 */
                getSymbols: function (elements, options) {
                    if (!options) {
                        //noinspection JSValidateTypes
                        /** @type {OrangeCommands.Elements.SymbolDataOptions} **/
                        options = {};
                    }
                    options.includeElementReference = true;
                    //noinspection JSValidateTypes
                    return Elements.getSymbolInfo(elements, options);
                },
            };


            //noinspection JSValidateTypes
            /** @type {Selection} **/
            var Selection = Selection || {
                stored_selection: [],
                selectAll:        function () {
                    fw.getDocumentDOM().selectAll();
                    return fw.selection;
                },
                clone:            function () {
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
                /** @returns {Selection} **/
                each:             function (callback) {
                    [].concat(fw.selection).each(callback);
                    return this;
                },
                /** @returns {Fw.FwElement[]} **/
                getAll:           function (persist) {
                    if (!persist) {
                        Selection.save();
                    }
                    var elements = Selection
                        .selectAll()
                        .clone();
                    if (!persist) {
                        Selection.restore();
                    }
                    return elements;
                },
                /** @returns {Fw.FwElement[]} **/
                getActive:       function () {
                    var elements = Selection.clone();
                    if (!elements.length) {
                        elements = Selection.getAll();
                    }
                    return elements;
                },
                /** @returns {Fw.FwElement[]} **/
                getCurrent:       function () {
                    var elements = Selection.clone();
                    if (!elements.length) {
                        elements = Selection.getAll();
                    }
                    return elements;
                },
                /** @returns {Fw.FwElement} **/
                getFirst:       function () {
                    var elements = Selection.getCurrent();
                    if (elements.length)
                        return elements[0];
                },
                /** @returns {string[]} **/
                getNames:       function () {
                    return _.map(fw.selection || [], 'name');
                },
                /** @param names {string[]} **/
                setNames:       function (names) {
                    var newSelection = _.filter(Page.elements, function (element) {
                        return _.indexOf(names, element.name) > -1;
                    });
                    //utils.log("Setting Selection to " + newSelection.length + " Elements");
                    try {
                        fw.selection = newSelection;
                    } catch (ex) {

                    }
                },
                /** @returns {ElementIdentifier[]} **/
                getIdentifiers:       function () {
                    return ElementIdentifier.fromElements(fw.selection || []);
                },
                /** @param identifiers {ElementIdentifier|ElementIdentifier[]} **/
                setIdentifiers:       function (identifiers) {
                    var newSelection = ElementIdentifier.filter(Page.elements, identifiers);

                    try {
                        fw.selection = newSelection;
                    } catch (ex) {

                    }
                },
                /** @returns {Selection} **/
                save:             function () {
                    this.stored_selection = this.clone();
                    return this;
                },
                /** @returns {Selection} **/
                forget:           function () {
                    this.stored_selection = [];
                    return this;
                },
                /** @returns {Selection} **/
                restore:          function () {
                    fw.selection = this.stored_selection;
                    return this;
                },
                /** @returns {Selection} **/
                join:             function (delimiter) {
                    if (fw.selection.length < 2) {
                        return this;
                    }
                    if (delimiter === undefined) {
                        delimiter = "\u000D";
                    }
                    var text_fields = [];

                    Selection.each(function (/** Fw.FwElement **/ field) {
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
                            if (i === t.textRuns.textRuns.length - 1) {
                                current_text_run.characters += delimiter;
                            }
                            if (i === 0) {
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
                /**
                 *
                 * @return {LayerElementData}
                 */
                getElementData: function () {
                    return fwLayers.getElementData(Selection.getElements());
                },

                getElements: function () {
                    return fw.selection;
                }
            };

            OcInternals.defineElementAccessors(Selection, ['all', 'current', 'first']);
            OcInternals.defineProperties(Selection, ['names', 'identifiers']);

            //noinspection JSValidateTypes
            /** @type {Guides} **/
            var Guides         = Guides || {
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
                    if (direction === "vertical") {
                        Guides.addVertical(where);
                    }
                    if (direction === "horizontal") {
                        Guides.addHorizontal(where);
                    }
                },
                remove:          function (where, direction) {
                    var current_guides = Guides.get();
                    if (direction === "horizontal") {
                        Guides.clear('horizontal');
                        for (var i = current_guides.hGuides.length - 1; i >= 0; i--) {
                            if (current_guides.hGuides[i] !== where) {
                                Guides.addHorizontal(current_guides.hGuides[i]);
                            }
                        }
                    } else {
                        Guides.clear('vertical');
                        for (var j = current_guides.vGuides.length - 1; j >= 0; j--) {
                            if (current_guides.vGuides[j] !== where) {
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
                    if (User.getLanguage() === "en") {
                        alert("Column size: " + column_width + "\n" + "Grid width: " + (last_guide_position - start_position));
                    }
                    if (User.getLanguage() === "es") {
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
            };
            /**
             * @type {OrangeCommands.User}
             * User Main
             ***/
            var User           = User || {
                getLanguage: function () {
                    var tmp  = Files.getLanguageDirectory().split("/"),
                        lang = ((tmp[tmp.length - 1]).substr(0, 2)).toLowerCase();
                    return lang;
                },
                getJSDir:    function () {
                    return fw.userJsCommandsDir;
                },
            };

            var modules        = {
                Document:  Document,
                Elements:  Elements,
                ElementIdentifier: ElementIdentifier,
                Page:      Page,
                Pages:     Pages,
                Selection: Selection,
                Color:     Color,
                Guides:    Guides,
                Sort:      Sort,
                UI:        UI,
                User:      User,
                FW:        FW,
            };

            //noinspection JSValidateTypes
            /** @type {OrangeCommands.OrangeCommandsStatic} **/
            var orangecommands = orangecommands || {
                VERSION: "1.7-dev",
                params:  null,
                run:     function (kind, command, params) {
                    // Reset params
                    orangecommands.params = null;
                    // runs a command with the specified parameters
                    try {
                        var f = fw.appJsCommandsDir + "/" + kind + "/" + encodeURIComponent(command) + ".jsf";
                        if (params !== undefined) {
                            orangecommands.params = params;
                        }
                        fw.runScript(f);
                        orangecommands.params = null;
                    }

                    catch (/** @type {Exception} **/ exception) {
                        alert("Error running command " + kind + "/" + command + ".\n" + [
                            exception,
                            exception.lineNumber,
                            exception.fileName,
                        ].join("\n"));
                    }
                },
            };
            _.assign(orangecommands, modules);

            fw.modules                = fw.modules || {};
            fw.modules.orangecommands = fw.orangecommands = orangecommands;
            _.assign(fw.modules, modules);

// Utility methods
            FwArray.prototype.clone = Array.prototype.clone = function () {
                return [].concat(this);
            };
            FwArray.prototype.each_with_index = Array.prototype.each_with_index = function (callback, traverse_groups) {
                Selection.forget();

                var count  = 0,
                    groups = 0;

                for (var i = 0; i < this.length; i++) {
                    /** @type {Fw.FwElement} **/
                    var el       = this[i];
                    fw.selection = el;

                    //noinspection FallThroughInSwitchStatementJS
                    switch (el.kind()) {
                        case 'autoshape':
                            traverse_groups = false;
                            break;
                        case 'group':
                            groups++;
                        default:
                            if (traverse_groups === undefined) {
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
                Selection.restore();
                if (groups > 0) {
                    fw.getDocumentDOM().selectParents();
                }
            };
            FwArray.prototype.each = Array.prototype.each = FwArray.prototype.each_with_index;
            Element.each_in_group  = function (callback) {
                for (var e = 0; e < this.elements.length; e++) {
                    var element = this.elements[e];
                    if (element.is_group()) {
                        element.each_in_group(callback);
                    } else {
                        //noinspection JSUnresolvedFunction
                        callback.call(this, element);
                        Selection.stored_selection.push(fw.selection[0]);
                    }
                }
            };
            Text.prototype.resize  = function (width, height) {
                fw.selection = this;
                if (width) {
                    width               = Math.round(width);
                    height               = Math.round(height);
                    this.autoExpand = false;

                    var offset      = Math.round(height - Math.round(this.height)),
                        leading     = this.textRuns.initialAttrs.leading,
                        leadingMode = this.textRuns.initialAttrs.leadingMode;

                    if (leadingMode === 'percentage') {
                        offset = offset / 100;
                    }

                    this.rawWidth = width - 4; // amazingly stupid bug in Fireworks...
                    if (offset) {
                        fw.getDocumentDOM().setTextLeading(leading + offset, leadingMode);
                    }
                } else {
                    this.autoExpand = true;
                }
            };
            Element.resize         = function (width, height) {
                //if (this.__proto__ == Instance) {
                // FIXME: Object is a symbol, and they sometimes get destroyed when resized below its minimum size
                //};
                if (isNaN(width) || isNaN(height)) return;
                fw.selection = this;

                // Old method: more precise, but slow & crashy
                //var x_pos = Math.round(this.left);
                //var y_pos = Math.round(this.top);
                //fw.getDocumentDOM().setSelectionBounds({left:x_pos,top:y_pos,right:(x_pos + width),bottom:(y_pos + height)},"autoTrimImages transformAttributes");

                width = Math.round(width);
                height = Math.round(height);
                fw.getDocumentDOM().resizeSelection(width, height);
            };
            Element.set_position   = function (x, y) {
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
                            if (this.pathAttributes.brushPlacement === 'outside') {
                                y_offset = this.pathAttributes.brush.diameter;
                            }
                            if (this.pathAttributes.brushPlacement === 'center') {
                                y_offset = Math.floor(this.pathAttributes.brush.diameter / 2);
                            }
                            x_offset = y_offset * 2;
                        }
                        this.left = x - x_offset;
                        this.top  = y - y_offset;
                        break;
                    default:
                        // don't do anything for unknown objects...
                        break;
                }
            };
            (function (target) {

                target.is_group= function () {
                    //noinspection EqualityComparisonWithCoercionJS
                    return (this == "[object Group]");
                };
                target.is_symbol = function () {
                    return (this.kind() === 'symbol');
                };
                target.is_text = function () {
                    return (this.kind() === 'text');
                };
                target.kind = function () {
                    var element = this;
                    if (element.smartShapeCode !== undefined) {
                        return 'autoshape';
                    }

                    if (element.elements) {
                        return 'group';
                    }

                    if (element.__proto__ === Text.prototype) {
                        return 'text';
                    }

                    if (element.__proto__ === Instance) {
                        return 'symbol';
                    }

                    //noinspection EqualityComparisonWithCoercionJS
                    if (element == "[object Image]") {
                        return 'image';
                    }

                    return 'element';
                };
            })(Element);

// Globals
            //noinspection JSValidateTypes
            fw.version = fw.appName.match(/\d+/);
            fw.copy    = function (txt) {
                fw.getDocumentDOM().clipCopyJsToExecute(txt);
            };


            fw.commands                = fw.commands || {};
            fw.commands.orangecommands = fw.commands.orangecommands || {
                api:   orangecommands,
                state: {},
            };

            saveModules();

            return orangecommands;
        }
    );

})(this);