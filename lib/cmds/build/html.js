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
var chokidar = require("chokidar");
var execa = require("execa");
var fs = require("fs-extra");
var globby = require("globby");
var log = require("npmlog");
var path = require("path");
var pug = require("pug");
var util = require("../../util");
exports.command = 'html';
exports.describe = 'Compiles PUG files to the dist directory';
exports.builder = util.buildOptions;
function handler(args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, build(args)];
                case 1:
                    _a.sent();
                    if (!args.watch) return [3 /*break*/, 3];
                    return [4 /*yield*/, watch(args)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.handler = handler;
function build(args) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        var glob, srcPaths;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, util.ensureDirs(args)];
                case 1:
                    _a.sent();
                    glob = util.src(args, '**', '*.bundle.pug');
                    return [4 /*yield*/, globby(glob)];
                case 2:
                    srcPaths = _a.sent();
                    if (srcPaths.length === 0) {
                        log.error(exports.command, 'No .pug bundles found with glob:', glob);
                        return [2 /*return*/];
                    }
                    else {
                        log.info(exports.command, "Found " + srcPaths.length + " .pug bundle(s):", srcPaths);
                    }
                    return [4 /*yield*/, Promise.all(srcPaths.map(function (srcPath) { return __awaiter(_this, void 0, void 0, function () {
                            var dirName, fileName, buildPath, distPath, getContents;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        dirName = path.dirname(path.relative(util.src(args), srcPath));
                                        return [4 /*yield*/, Promise.all([
                                                fs.ensureDir(util.build(args, dirName)),
                                                fs.ensureDir(util.dist(args, dirName)),
                                            ])];
                                    case 1:
                                        _a.sent();
                                        fileName = path.basename(srcPath, '.bundle.pug');
                                        buildPath = util.build(args, dirName, fileName + ".html");
                                        distPath = util.dist(args, dirName, fileName + ".html");
                                        getContents = pug.compileFile(srcPath, {
                                            pretty: !args.optimize,
                                        });
                                        fs.writeFileSync(buildPath, getContents());
                                        if (!args.optimize) return [3 /*break*/, 3];
                                        return [4 /*yield*/, execa('html-minifier', ['-c', 'html-minifier.json', '-o', distPath, buildPath])];
                                    case 2:
                                        _a.sent();
                                        _a.label = 3;
                                    case 3: return [4 /*yield*/, fs.copy(buildPath, distPath)];
                                    case 4:
                                        _a.sent();
                                        log.success(exports.command, 'Built pug file', distPath);
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function watch(args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            chokidar
                .watch(util.src(args, '**', '*.pug'))
                .on('change', function () { return build(args); });
            return [2 /*return*/];
        });
    });
}
