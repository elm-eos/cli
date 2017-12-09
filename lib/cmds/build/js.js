"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var browserify = require("browserify");
var chokidar = require("chokidar");
var fs = require("fs-extra");
var execa = require("execa");
var globby = require("globby");
var log = require("npmlog");
var path = require("path");
var swPrecache = require("sw-precache");
var uglifyify = require("uglifyify");
var watchify = require("watchify");
var util = require("../../util");
exports.command = 'js';
exports.describe = 'Builds JS files';
exports.builder = util.buildOptions;
function handler(args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.emptyDir(path.join(args.root, 'node_modules', '~elm'))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, buildElm(args)];
                case 2:
                    _a.sent();
                    if (args.watch) {
                        watchElm(args);
                    }
                    return [4 /*yield*/, buildBundles(args)];
                case 3:
                    _a.sent();
                    if (!args.optimize) return [3 /*break*/, 5];
                    return [4 /*yield*/, buildSwCache(args)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.handler = handler;
function buildElm(args) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        var glob, srcPaths;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    glob = util.src(args, '**', 'Main.elm');
                    return [4 /*yield*/, globby(glob)];
                case 1:
                    srcPaths = _a.sent();
                    if (srcPaths.length === 0) {
                        log.error(exports.command, "No Elm files found with glob: " + glob);
                        return [2 /*return*/];
                    }
                    else {
                        log.info(exports.command, 'Found Elm files:', srcPaths);
                    }
                    return [4 /*yield*/, Promise.all(srcPaths.map(function (srcPath) { return __awaiter(_this, void 0, void 0, function () {
                            var dirName, outPath;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        dirName = path.dirname(path.relative(util.src(args), srcPath));
                                        outPath = path.join(args.root, 'node_modules', '~elm', dirName, 'Main.js');
                                        return [4 /*yield*/, fs.ensureDir(path.dirname(outPath))];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/, execa('elm-make', [srcPath, '--yes', '--warn', '--output', outPath])];
                                }
                            });
                        }); }))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function watchElm(args) {
    chokidar
        .watch(util.src(args, '**', '*.elm'))
        .on('change', function () { return buildElm(args); });
}
function buildSwCache(args) {
    return __awaiter(this, void 0, void 0, function () {
        var outName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    outName = 'service-worker';
                    return [4 /*yield*/, swPrecache.write(util.dist(args, outName + ".js"), {
                            staticFileGlobs: [util.dist(args, '**', "!(" + outName + ").@(html|css|js)")],
                            stripPrefix: util.dist(args) + path.sep,
                        })];
                case 1:
                    _a.sent();
                    log.success(exports.command, 'Built ServiceWorker cache');
                    return [2 /*return*/];
            }
        });
    });
}
function buildBundles(args) {
    return __awaiter(this, void 0, void 0, function () {
        var glob, srcPaths;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    glob = util.src(args, '**', '*.bundle.js');
                    return [4 /*yield*/, globby(glob)];
                case 1:
                    srcPaths = _a.sent();
                    if (srcPaths.length === 0) {
                        log.error(exports.command, "No JS files found with glob: " + glob);
                        return [2 /*return*/];
                    }
                    else {
                        log.info(exports.command, 'Found JS files:', srcPaths);
                    }
                    return [4 /*yield*/, Promise.all(srcPaths.map(function (srcPath) {
                            var bundle = buildBundler(args, srcPath).bundle;
                            return bundle();
                        }))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function buildBundler(args, srcPath) {
    var bundler = browserify({
        entries: [srcPath],
        cache: {},
        packageCache: {},
    });
    if (args.optimize) {
        bundler.transform(uglifyify, { global: true });
    }
    bundler.on('error', function (e) { return log.error(exports.command, 'error bundling js', e.toString()); });
    bundler.on('log', function (msg) { return log.success(exports.command, 'bundle created', msg); });
    var baseName = path.basename(srcPath, '.bundle.js');
    function bundle() {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        var inPath, file;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, util.ensureDirs(args)];
                                case 1:
                                    _a.sent();
                                    inPath = util.build(args, baseName + ".js");
                                    file = fs.createWriteStream(inPath);
                                    bundler.on('error', reject);
                                    file.on('error', reject);
                                    file.on('finish', function () { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, fs.copy(inPath, util.dist(args, baseName + ".js"))];
                                                case 1:
                                                    _a.sent();
                                                    resolve();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                    bundler.bundle().pipe(file);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    }
    if (args.watch) {
        bundler.plugin(watchify);
        bundler.on('update', bundle);
    }
    return {
        bundler: bundler,
        bundle: bundle,
    };
}
