"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/index",{

/***/ "./src/components/TokenAnalysis.tsx":
/*!******************************************!*\
  !*** ./src/components/TokenAnalysis.tsx ***!
  \******************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   TokenAnalysis: () => (/* binding */ TokenAnalysis)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _TokenInput__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TokenInput */ \"./src/components/TokenInput.tsx\");\n/* harmony import */ var _TimeframeSelector__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TimeframeSelector */ \"./src/components/TimeframeSelector.tsx\");\n/* harmony import */ var _PriceChart__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./PriceChart */ \"./src/components/PriceChart.tsx\");\n/* harmony import */ var _TechnicalIndicators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./TechnicalIndicators */ \"./src/components/TechnicalIndicators.tsx\");\n/* harmony import */ var _DCAStrategy__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./DCAStrategy */ \"./src/components/DCAStrategy.tsx\");\n/* harmony import */ var _utils_validation__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/validation */ \"./src/utils/validation.ts\");\n/* harmony import */ var _services_api__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../services/api */ \"./src/services/api.ts\");\n\nvar _s = $RefreshSig$();\n\n\n\n\n\n\n\n\nconst TokenAnalysis = ()=>{\n    _s();\n    const [analysisParams, setAnalysisParams] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({\n        contractAddress: '',\n        timeframe: '1h',\n        intervalDays: 30,\n        investmentAmount: 100\n    });\n    const [analysisResult, setAnalysisResult] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [progress, setProgress] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);\n    const [validationErrors, setValidationErrors] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);\n    const handleAnalyze = async ()=>{\n        let ws = null;\n        try {\n            var _result_priceData;\n            setLoading(true);\n            setError(null);\n            setProgress([]);\n            setValidationErrors([]);\n            const errors = (0,_utils_validation__WEBPACK_IMPORTED_MODULE_7__.validateAnalysisParams)(analysisParams);\n            if (errors.length > 0) {\n                setValidationErrors(errors);\n                setError(errors[0].message);\n                return;\n            }\n            // Add detailed logging\n            console.log('Sending analysis request with params:', analysisParams);\n            const result = await (0,_services_api__WEBPACK_IMPORTED_MODULE_8__.analyzeToken)(analysisParams);\n            // Add detailed response logging\n            console.log('Raw API Response:', result);\n            console.log('Price Data Sample:', (_result_priceData = result.priceData) === null || _result_priceData === void 0 ? void 0 : _result_priceData.slice(0, 2));\n            console.log('Technical Analysis:', result.technical_analysis);\n            if (!result.priceData || !result.technical_analysis) {\n                throw new Error('Invalid response format from API');\n            }\n            setAnalysisResult(result);\n        } catch (err) {\n            console.error('Analysis error:', err);\n            if (err instanceof Error) {\n                setError(err.message);\n                setAnalysisResult(null);\n            } else {\n                setError('An unexpected error occurred while analyzing the token');\n            }\n        } finally{\n            setLoading(false);\n            if (ws && ws.readyState === WebSocket.OPEN) {\n                ws.close();\n            }\n        }\n    };\n    const getFieldError = (field)=>{\n        var _validationErrors_find;\n        return (_validationErrors_find = validationErrors.find((error)=>error.field === field)) === null || _validationErrors_find === void 0 ? void 0 : _validationErrors_find.message;\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"space-y-6\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"bg-white rounded-lg shadow p-6\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_TokenInput__WEBPACK_IMPORTED_MODULE_2__.TokenInput, {\n                        value: analysisParams.contractAddress,\n                        onChange: (value)=>setAnalysisParams((prev)=>({\n                                    ...prev,\n                                    contractAddress: value\n                                })),\n                        error: getFieldError('contractAddress')\n                    }, void 0, false, {\n                        fileName: \"D:\\\\Coding\\\\Token-analysis-tool\\\\frontend\\\\src\\\\components\\\\TokenAnalysis.tsx\",\n                        lineNumber: 80,\n                        columnNumber: 9\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_TimeframeSelector__WEBPACK_IMPORTED_MODULE_3__.TimeframeSelector, {\n                        timeframe: analysisParams.timeframe,\n                        intervalDays: analysisParams.intervalDays,\n                        investmentAmount: analysisParams.investmentAmount,\n                        onChange: (updates)=>setAnalysisParams((prev)=>({\n                                    ...prev,\n                                    ...updates\n                                })),\n                        errors: {\n                            timeframe: getFieldError('timeframe'),\n                            intervalDays: getFieldError('intervalDays'),\n                            investmentAmount: getFieldError('investmentAmount')\n                        }\n                    }, void 0, false, {\n                        fileName: \"D:\\\\Coding\\\\Token-analysis-tool\\\\frontend\\\\src\\\\components\\\\TokenAnalysis.tsx\",\n                        lineNumber: 85,\n                        columnNumber: 9\n                    }, undefined),\n                    error && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"mt-4 p-4 bg-red-50 text-red-700 rounded-md\",\n                        children: error\n                    }, void 0, false, {\n                        fileName: \"D:\\\\Coding\\\\Token-analysis-tool\\\\frontend\\\\src\\\\components\\\\TokenAnalysis.tsx\",\n                        lineNumber: 98,\n                        columnNumber: 11\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                        onClick: handleAnalyze,\n                        disabled: loading,\n                        className: \"w-full mt-4 px-4 py-2 rounded-md text-white font-medium \".concat(loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'),\n                        children: loading ? 'Analyzing...' : 'Analyze Token'\n                    }, void 0, false, {\n                        fileName: \"D:\\\\Coding\\\\Token-analysis-tool\\\\frontend\\\\src\\\\components\\\\TokenAnalysis.tsx\",\n                        lineNumber: 103,\n                        columnNumber: 9\n                    }, undefined)\n                ]\n            }, void 0, true, {\n                fileName: \"D:\\\\Coding\\\\Token-analysis-tool\\\\frontend\\\\src\\\\components\\\\TokenAnalysis.tsx\",\n                lineNumber: 79,\n                columnNumber: 7\n            }, undefined),\n            analysisResult && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"space-y-6\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_PriceChart__WEBPACK_IMPORTED_MODULE_4__.PriceChart, {\n                        data: analysisResult.priceData,\n                        loading: loading\n                    }, void 0, false, {\n                        fileName: \"D:\\\\Coding\\\\Token-analysis-tool\\\\frontend\\\\src\\\\components\\\\TokenAnalysis.tsx\",\n                        lineNumber: 116,\n                        columnNumber: 11\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_TechnicalIndicators__WEBPACK_IMPORTED_MODULE_5__.TechnicalIndicators, {\n                        analysis: analysisResult.technical_analysis\n                    }, void 0, false, {\n                        fileName: \"D:\\\\Coding\\\\Token-analysis-tool\\\\frontend\\\\src\\\\components\\\\TokenAnalysis.tsx\",\n                        lineNumber: 120,\n                        columnNumber: 11\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_DCAStrategy__WEBPACK_IMPORTED_MODULE_6__.DCAStrategy, {\n                        strategy: analysisResult.dca_strategy\n                    }, void 0, false, {\n                        fileName: \"D:\\\\Coding\\\\Token-analysis-tool\\\\frontend\\\\src\\\\components\\\\TokenAnalysis.tsx\",\n                        lineNumber: 123,\n                        columnNumber: 11\n                    }, undefined)\n                ]\n            }, void 0, true, {\n                fileName: \"D:\\\\Coding\\\\Token-analysis-tool\\\\frontend\\\\src\\\\components\\\\TokenAnalysis.tsx\",\n                lineNumber: 115,\n                columnNumber: 9\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"D:\\\\Coding\\\\Token-analysis-tool\\\\frontend\\\\src\\\\components\\\\TokenAnalysis.tsx\",\n        lineNumber: 78,\n        columnNumber: 5\n    }, undefined);\n};\n_s(TokenAnalysis, \"gLI0oPHwBqPUw2QYK0m44gsYJF0=\");\n_c = TokenAnalysis;\nvar _c;\n$RefreshReg$(_c, \"TokenAnalysis\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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d0JBQ3pDQyxrQkFBa0JMLGVBQWVLLGdCQUFnQjt3QkFDakRrQyxVQUFVLENBQUNFLFVBQVl4QyxrQkFBa0J1QyxDQUFBQSxPQUFTO29DQUFDLEdBQUdBLElBQUk7b0NBQUUsR0FBR0MsT0FBTztnQ0FBQTt3QkFDdEV0QixRQUFROzRCQUNOaEIsV0FBVzhCLGNBQWM7NEJBQ3pCN0IsY0FBYzZCLGNBQWM7NEJBQzVCNUIsa0JBQWtCNEIsY0FBYzt3QkFDbEM7Ozs7OztvQkFHRHZCLHVCQUNDLDhEQUFDMEI7d0JBQUlDLFdBQVU7a0NBQ1ozQjs7Ozs7O2tDQUlMLDhEQUFDZ0M7d0JBQ0NDLFNBQVMzQjt3QkFDVDRCLFVBQVVwQzt3QkFDVjZCLFdBQVcsMkRBRVYsT0FEQzdCLFVBQVUsbUNBQW1DO2tDQUc5Q0EsVUFBVSxpQkFBaUI7Ozs7Ozs7Ozs7OztZQUkvQkYsZ0NBQ0MsOERBQUM4QjtnQkFBSUMsV0FBVTs7a0NBQ2IsOERBQUMzQyxtREFBVUE7d0JBQ1RtRCxNQUFNdkMsZUFBZWtCLFNBQVM7d0JBQzlCaEIsU0FBU0E7Ozs7OztrQ0FFWCw4REFBQ2IscUVBQW1CQTt3QkFDbEJtRCxVQUFVeEMsZUFBZW9CLGtCQUFrQjs7Ozs7O2tDQUU3Qyw4REFBQzlCLHFEQUFXQTt3QkFDVm1ELFVBQVV6QyxlQUFlMEMsWUFBWTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTWpELEVBQUU7R0F0SFdqRDtLQUFBQSIsInNvdXJjZXMiOlsiRDpcXENvZGluZ1xcVG9rZW4tYW5hbHlzaXMtdG9vbFxcZnJvbnRlbmRcXHNyY1xcY29tcG9uZW50c1xcVG9rZW5BbmFseXNpcy50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBUb2tlbklucHV0IH0gZnJvbSAnLi9Ub2tlbklucHV0JztcclxuaW1wb3J0IHsgVGltZWZyYW1lU2VsZWN0b3IgfSBmcm9tICcuL1RpbWVmcmFtZVNlbGVjdG9yJztcclxuaW1wb3J0IHsgUHJpY2VDaGFydCB9IGZyb20gJy4vUHJpY2VDaGFydCc7XHJcbmltcG9ydCB7IFRlY2huaWNhbEluZGljYXRvcnMgfSBmcm9tICcuL1RlY2huaWNhbEluZGljYXRvcnMnO1xyXG5pbXBvcnQgeyBEQ0FTdHJhdGVneSB9IGZyb20gJy4vRENBU3RyYXRlZ3knO1xyXG5pbXBvcnQgeyB2YWxpZGF0ZUFuYWx5c2lzUGFyYW1zLCBWYWxpZGF0aW9uRXJyb3IgfSBmcm9tICcuLi91dGlscy92YWxpZGF0aW9uJztcclxuaW1wb3J0IHsgQW5hbHlzaXNSZXN1bHQgfSBmcm9tICcuLi90eXBlcy9hbmFseXNpcyc7XHJcbmltcG9ydCB7IGFuYWx5emVUb2tlbiwgQW5hbHlzaXNQYXJhbXMgfSBmcm9tICcuLi9zZXJ2aWNlcy9hcGknO1xyXG5pbXBvcnQgZW52IGZyb20gJy4uL2NvbmZpZy9lbnYnO1xyXG5cclxuZXhwb3J0IGNvbnN0IFRva2VuQW5hbHlzaXM6IFJlYWN0LkZDID0gKCkgPT4ge1xyXG4gIGNvbnN0IFthbmFseXNpc1BhcmFtcywgc2V0QW5hbHlzaXNQYXJhbXNdID0gdXNlU3RhdGU8QW5hbHlzaXNQYXJhbXM+KHtcclxuICAgIGNvbnRyYWN0QWRkcmVzczogJycsXHJcbiAgICB0aW1lZnJhbWU6ICcxaCcsXHJcbiAgICBpbnRlcnZhbERheXM6IDMwLFxyXG4gICAgaW52ZXN0bWVudEFtb3VudDogMTAwLFxyXG4gIH0pO1xyXG4gIGNvbnN0IFthbmFseXNpc1Jlc3VsdCwgc2V0QW5hbHlzaXNSZXN1bHRdID0gdXNlU3RhdGU8QW5hbHlzaXNSZXN1bHQgfCBudWxsPihudWxsKTtcclxuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XHJcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZTxzdHJpbmcgfCBudWxsPihudWxsKTtcclxuICBjb25zdCBbcHJvZ3Jlc3MsIHNldFByb2dyZXNzXSA9IHVzZVN0YXRlPHN0cmluZ1tdPihbXSk7XHJcbiAgY29uc3QgW3ZhbGlkYXRpb25FcnJvcnMsIHNldFZhbGlkYXRpb25FcnJvcnNdID0gdXNlU3RhdGU8VmFsaWRhdGlvbkVycm9yW10+KFtdKTtcclxuXHJcbiAgY29uc3QgaGFuZGxlQW5hbHl6ZSA9IGFzeW5jICgpID0+IHtcclxuICAgIGxldCB3czogV2ViU29ja2V0IHwgbnVsbCA9IG51bGw7XHJcbiAgICBcclxuICAgIHRyeSB7XHJcbiAgICAgIHNldExvYWRpbmcodHJ1ZSk7XHJcbiAgICAgIHNldEVycm9yKG51bGwpO1xyXG4gICAgICBzZXRQcm9ncmVzcyhbXSk7XHJcbiAgICAgIHNldFZhbGlkYXRpb25FcnJvcnMoW10pO1xyXG4gICAgICBcclxuICAgICAgY29uc3QgZXJyb3JzID0gdmFsaWRhdGVBbmFseXNpc1BhcmFtcyhhbmFseXNpc1BhcmFtcyk7XHJcbiAgICAgIGlmIChlcnJvcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHNldFZhbGlkYXRpb25FcnJvcnMoZXJyb3JzKTtcclxuICAgICAgICBzZXRFcnJvcihlcnJvcnNbMF0ubWVzc2FnZSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBBZGQgZGV0YWlsZWQgbG9nZ2luZ1xyXG4gICAgICBjb25zb2xlLmxvZygnU2VuZGluZyBhbmFseXNpcyByZXF1ZXN0IHdpdGggcGFyYW1zOicsIGFuYWx5c2lzUGFyYW1zKTtcclxuXHJcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGFuYWx5emVUb2tlbihhbmFseXNpc1BhcmFtcyk7XHJcbiAgICAgIFxyXG4gICAgICAvLyBBZGQgZGV0YWlsZWQgcmVzcG9uc2UgbG9nZ2luZ1xyXG4gICAgICBjb25zb2xlLmxvZygnUmF3IEFQSSBSZXNwb25zZTonLCByZXN1bHQpO1xyXG4gICAgICBjb25zb2xlLmxvZygnUHJpY2UgRGF0YSBTYW1wbGU6JywgcmVzdWx0LnByaWNlRGF0YT8uc2xpY2UoMCwgMikpO1xyXG4gICAgICBjb25zb2xlLmxvZygnVGVjaG5pY2FsIEFuYWx5c2lzOicsIHJlc3VsdC50ZWNobmljYWxfYW5hbHlzaXMpO1xyXG4gICAgICBcclxuICAgICAgaWYgKCFyZXN1bHQucHJpY2VEYXRhIHx8ICFyZXN1bHQudGVjaG5pY2FsX2FuYWx5c2lzKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHJlc3BvbnNlIGZvcm1hdCBmcm9tIEFQSScpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzZXRBbmFseXNpc1Jlc3VsdChyZXN1bHQpO1xyXG4gICAgICBcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKCdBbmFseXNpcyBlcnJvcjonLCBlcnIpO1xyXG4gICAgICBpZiAoZXJyIGluc3RhbmNlb2YgRXJyb3IpIHtcclxuICAgICAgICBzZXRFcnJvcihlcnIubWVzc2FnZSk7XHJcbiAgICAgICAgc2V0QW5hbHlzaXNSZXN1bHQobnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2V0RXJyb3IoJ0FuIHVuZXhwZWN0ZWQgZXJyb3Igb2NjdXJyZWQgd2hpbGUgYW5hbHl6aW5nIHRoZSB0b2tlbicpO1xyXG4gICAgICB9XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcclxuICAgICAgaWYgKHdzICYmIHdzLnJlYWR5U3RhdGUgPT09IFdlYlNvY2tldC5PUEVOKSB7XHJcbiAgICAgICAgd3MuY2xvc2UoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IGdldEZpZWxkRXJyb3IgPSAoZmllbGQ6IHN0cmluZyk6IHN0cmluZyB8IHVuZGVmaW5lZCA9PiB7XHJcbiAgICByZXR1cm4gdmFsaWRhdGlvbkVycm9ycy5maW5kKGVycm9yID0+IGVycm9yLmZpZWxkID09PSBmaWVsZCk/Lm1lc3NhZ2U7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS02XCI+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmctd2hpdGUgcm91bmRlZC1sZyBzaGFkb3cgcC02XCI+XHJcbiAgICAgICAgPFRva2VuSW5wdXQgXHJcbiAgICAgICAgICB2YWx1ZT17YW5hbHlzaXNQYXJhbXMuY29udHJhY3RBZGRyZXNzfVxyXG4gICAgICAgICAgb25DaGFuZ2U9eyh2YWx1ZSkgPT4gc2V0QW5hbHlzaXNQYXJhbXMocHJldiA9PiAoey4uLnByZXYsIGNvbnRyYWN0QWRkcmVzczogdmFsdWV9KSl9XHJcbiAgICAgICAgICBlcnJvcj17Z2V0RmllbGRFcnJvcignY29udHJhY3RBZGRyZXNzJyl9XHJcbiAgICAgICAgLz5cclxuICAgICAgICA8VGltZWZyYW1lU2VsZWN0b3JcclxuICAgICAgICAgIHRpbWVmcmFtZT17YW5hbHlzaXNQYXJhbXMudGltZWZyYW1lfVxyXG4gICAgICAgICAgaW50ZXJ2YWxEYXlzPXthbmFseXNpc1BhcmFtcy5pbnRlcnZhbERheXN9XHJcbiAgICAgICAgICBpbnZlc3RtZW50QW1vdW50PXthbmFseXNpc1BhcmFtcy5pbnZlc3RtZW50QW1vdW50fVxyXG4gICAgICAgICAgb25DaGFuZ2U9eyh1cGRhdGVzKSA9PiBzZXRBbmFseXNpc1BhcmFtcyhwcmV2ID0+ICh7Li4ucHJldiwgLi4udXBkYXRlc30pKX1cclxuICAgICAgICAgIGVycm9ycz17e1xyXG4gICAgICAgICAgICB0aW1lZnJhbWU6IGdldEZpZWxkRXJyb3IoJ3RpbWVmcmFtZScpLFxyXG4gICAgICAgICAgICBpbnRlcnZhbERheXM6IGdldEZpZWxkRXJyb3IoJ2ludGVydmFsRGF5cycpLFxyXG4gICAgICAgICAgICBpbnZlc3RtZW50QW1vdW50OiBnZXRGaWVsZEVycm9yKCdpbnZlc3RtZW50QW1vdW50JylcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgLz5cclxuICAgICAgICBcclxuICAgICAgICB7ZXJyb3IgJiYgKFxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC00IHAtNCBiZy1yZWQtNTAgdGV4dC1yZWQtNzAwIHJvdW5kZWQtbWRcIj5cclxuICAgICAgICAgICAge2Vycm9yfVxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKX1cclxuICAgICAgICBcclxuICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgb25DbGljaz17aGFuZGxlQW5hbHl6ZX1cclxuICAgICAgICAgIGRpc2FibGVkPXtsb2FkaW5nfVxyXG4gICAgICAgICAgY2xhc3NOYW1lPXtgdy1mdWxsIG10LTQgcHgtNCBweS0yIHJvdW5kZWQtbWQgdGV4dC13aGl0ZSBmb250LW1lZGl1bSAke1xyXG4gICAgICAgICAgICBsb2FkaW5nID8gJ2JnLWJsdWUtNDAwIGN1cnNvci1ub3QtYWxsb3dlZCcgOiAnYmctYmx1ZS01MDAgaG92ZXI6YmctYmx1ZS02MDAnXHJcbiAgICAgICAgICB9YH1cclxuICAgICAgICA+XHJcbiAgICAgICAgICB7bG9hZGluZyA/ICdBbmFseXppbmcuLi4nIDogJ0FuYWx5emUgVG9rZW4nfVxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgXHJcbiAgICAgIHthbmFseXNpc1Jlc3VsdCAmJiAoXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTZcIj5cclxuICAgICAgICAgIDxQcmljZUNoYXJ0IFxyXG4gICAgICAgICAgICBkYXRhPXthbmFseXNpc1Jlc3VsdC5wcmljZURhdGF9IFxyXG4gICAgICAgICAgICBsb2FkaW5nPXtsb2FkaW5nfSBcclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8VGVjaG5pY2FsSW5kaWNhdG9ycyBcclxuICAgICAgICAgICAgYW5hbHlzaXM9e2FuYWx5c2lzUmVzdWx0LnRlY2huaWNhbF9hbmFseXNpc30gXHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgICAgPERDQVN0cmF0ZWd5IFxyXG4gICAgICAgICAgICBzdHJhdGVneT17YW5hbHlzaXNSZXN1bHQuZGNhX3N0cmF0ZWd5fSBcclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICl9XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59OyAiXSwibmFtZXMiOlsiUmVhY3QiLCJ1c2VTdGF0ZSIsIlRva2VuSW5wdXQiLCJUaW1lZnJhbWVTZWxlY3RvciIsIlByaWNlQ2hhcnQiLCJUZWNobmljYWxJbmRpY2F0b3JzIiwiRENBU3RyYXRlZ3kiLCJ2YWxpZGF0ZUFuYWx5c2lzUGFyYW1zIiwiYW5hbHl6ZVRva2VuIiwiVG9rZW5BbmFseXNpcyIsImFuYWx5c2lzUGFyYW1zIiwic2V0QW5hbHlzaXNQYXJhbXMiLCJjb250cmFjdEFkZHJlc3MiLCJ0aW1lZnJhbWUiLCJpbnRlcnZhbERheXMiLCJpbnZlc3RtZW50QW1vdW50IiwiYW5hbHlzaXNSZXN1bHQiLCJzZXRBbmFseXNpc1Jlc3VsdCIsImxvYWRpbmciLCJzZXRMb2FkaW5nIiwiZXJyb3IiLCJzZXRFcnJvciIsInByb2dyZXNzIiwic2V0UHJvZ3Jlc3MiLCJ2YWxpZGF0aW9uRXJyb3JzIiwic2V0VmFsaWRhdGlvbkVycm9ycyIsImhhbmRsZUFuYWx5emUiLCJ3cyIsInJlc3VsdCIsImVycm9ycyIsImxlbmd0aCIsIm1lc3NhZ2UiLCJjb25zb2xlIiwibG9nIiwicHJpY2VEYXRhIiwic2xpY2UiLCJ0ZWNobmljYWxfYW5hbHlzaXMiLCJFcnJvciIsImVyciIsInJlYWR5U3RhdGUiLCJXZWJTb2NrZXQiLCJPUEVOIiwiY2xvc2UiLCJnZXRGaWVsZEVycm9yIiwiZmllbGQiLCJmaW5kIiwiZGl2IiwiY2xhc3NOYW1lIiwidmFsdWUiLCJvbkNoYW5nZSIsInByZXYiLCJ1cGRhdGVzIiwiYnV0dG9uIiwib25DbGljayIsImRpc2FibGVkIiwiZGF0YSIsImFuYWx5c2lzIiwic3RyYXRlZ3kiLCJkY2Ffc3RyYXRlZ3kiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/components/TokenAnalysis.tsx\n"));

/***/ })

});