/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "(pages-dir-node)/./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"(pages-dir-node)/./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/head */ \"next/head\");\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var next_script__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/script */ \"(pages-dir-node)/./node_modules/next/script.js\");\n/* harmony import */ var next_script__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_script__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var react_toastify__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-toastify */ \"react-toastify\");\n/* harmony import */ var react_toastify_dist_ReactToastify_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-toastify/dist/ReactToastify.css */ \"(pages-dir-node)/./node_modules/react-toastify/dist/ReactToastify.css\");\n/* harmony import */ var react_toastify_dist_ReactToastify_css__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_toastify_dist_ReactToastify_css__WEBPACK_IMPORTED_MODULE_6__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([react_toastify__WEBPACK_IMPORTED_MODULE_5__]);\nreact_toastify__WEBPACK_IMPORTED_MODULE_5__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\n\n\n\nfunction MyApp({ Component, pageProps }) {\n    // This script helps prevent dark mode flickering during page load\n    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)({\n        \"MyApp.useEffect\": ()=>{\n            // On page load or when changing themes, best to add inline in `head` to avoid FOUC\n            if (false) {}\n        }\n    }[\"MyApp.useEffect\"], []);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_script__WEBPACK_IMPORTED_MODULE_4___default()), {\n                id: \"dark-mode-script\",\n                strategy: \"beforeInteractive\",\n                children: `\n          (function() {\n            try {\n              var savedTheme = localStorage.getItem('theme');\n              var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;\n              if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {\n                document.documentElement.classList.add('dark');\n              } else {\n                document.documentElement.classList.remove('dark');\n              }\n            } catch (e) {}\n          })();\n        `\n            }, void 0, false, {\n                fileName: \"D:\\\\Projects\\\\Dekhte hai\\\\neuroSync\\\\NeuroSync-AI-Frontend\\\\pages\\\\_app.js\",\n                lineNumber: 26,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps\n            }, void 0, false, {\n                fileName: \"D:\\\\Projects\\\\Dekhte hai\\\\neuroSync\\\\NeuroSync-AI-Frontend\\\\pages\\\\_app.js\",\n                lineNumber: 41,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_toastify__WEBPACK_IMPORTED_MODULE_5__.ToastContainer, {\n                position: \"top-right\",\n                autoClose: 5000,\n                hideProgressBar: false,\n                newestOnTop: true,\n                closeOnClick: true,\n                rtl: false,\n                pauseOnFocusLoss: true,\n                draggable: true,\n                pauseOnHover: true,\n                theme: \"colored\"\n            }, void 0, false, {\n                fileName: \"D:\\\\Projects\\\\Dekhte hai\\\\neuroSync\\\\NeuroSync-AI-Frontend\\\\pages\\\\_app.js\",\n                lineNumber: 42,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3BhZ2VzL19hcHAuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQStCO0FBQ0c7QUFDTDtBQUNJO0FBQ2U7QUFDRDtBQUUvQyxTQUFTSSxNQUFNLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFFO0lBQ3JDLGtFQUFrRTtJQUNsRU4sZ0RBQVNBOzJCQUFDO1lBQ1IsbUZBQW1GO1lBQ25GLElBQUksS0FBNkIsRUFBRSxFQVNsQztRQUNIOzBCQUFHLEVBQUU7SUFFTCxxQkFDRTs7MEJBQ0UsOERBQUNFLG9EQUFNQTtnQkFBQ2lCLElBQUc7Z0JBQW1CQyxVQUFTOzBCQUNwQyxDQUFDOzs7Ozs7Ozs7Ozs7UUFZRixDQUFDOzs7Ozs7MEJBRUgsOERBQUNmO2dCQUFXLEdBQUdDLFNBQVM7Ozs7OzswQkFDeEIsOERBQUNILDBEQUFjQTtnQkFDYmtCLFVBQVM7Z0JBQ1RDLFdBQVc7Z0JBQ1hDLGlCQUFpQjtnQkFDakJDLFdBQVc7Z0JBQ1hDLFlBQVk7Z0JBQ1pDLEtBQUs7Z0JBQ0xDLGdCQUFnQjtnQkFDaEJDLFNBQVM7Z0JBQ1RDLFlBQVk7Z0JBQ1pDLE9BQU07Ozs7Ozs7O0FBSWQ7QUFFQSxpRUFBZTFCLEtBQUtBLEVBQUMiLCJzb3VyY2VzIjpbIkQ6XFxQcm9qZWN0c1xcRGVraHRlIGhhaVxcbmV1cm9TeW5jXFxOZXVyb1N5bmMtQUktRnJvbnRlbmRcXHBhZ2VzXFxfYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi4vc3R5bGVzL2dsb2JhbHMuY3NzJztcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgSGVhZCBmcm9tICduZXh0L2hlYWQnO1xyXG5pbXBvcnQgU2NyaXB0IGZyb20gJ25leHQvc2NyaXB0JztcclxuaW1wb3J0IHsgVG9hc3RDb250YWluZXIgfSBmcm9tICdyZWFjdC10b2FzdGlmeSc7XHJcbmltcG9ydCAncmVhY3QtdG9hc3RpZnkvZGlzdC9SZWFjdFRvYXN0aWZ5LmNzcyc7XHJcblxyXG5mdW5jdGlvbiBNeUFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH0pIHtcclxuICAvLyBUaGlzIHNjcmlwdCBoZWxwcyBwcmV2ZW50IGRhcmsgbW9kZSBmbGlja2VyaW5nIGR1cmluZyBwYWdlIGxvYWRcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgLy8gT24gcGFnZSBsb2FkIG9yIHdoZW4gY2hhbmdpbmcgdGhlbWVzLCBiZXN0IHRvIGFkZCBpbmxpbmUgaW4gYGhlYWRgIHRvIGF2b2lkIEZPVUNcclxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICBjb25zdCBzYXZlZFRoZW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3RoZW1lJyk7XHJcbiAgICAgIGNvbnN0IHByZWZlcnNEYXJrID0gd2luZG93Lm1hdGNoTWVkaWEgJiYgd2luZG93Lm1hdGNoTWVkaWEoJyhwcmVmZXJzLWNvbG9yLXNjaGVtZTogZGFyayknKS5tYXRjaGVzO1xyXG4gICAgICBcclxuICAgICAgaWYgKHNhdmVkVGhlbWUgPT09ICdkYXJrJyB8fCAoIXNhdmVkVGhlbWUgJiYgcHJlZmVyc0RhcmspKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2RhcmsnKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnZGFyaycpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSwgW10pO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPD5cclxuICAgICAgPFNjcmlwdCBpZD1cImRhcmstbW9kZS1zY3JpcHRcIiBzdHJhdGVneT1cImJlZm9yZUludGVyYWN0aXZlXCI+XHJcbiAgICAgICAge2BcclxuICAgICAgICAgIChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICB2YXIgc2F2ZWRUaGVtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0aGVtZScpO1xyXG4gICAgICAgICAgICAgIHZhciBwcmVmZXJzRGFyayA9IHdpbmRvdy5tYXRjaE1lZGlhICYmIHdpbmRvdy5tYXRjaE1lZGlhKCcocHJlZmVycy1jb2xvci1zY2hlbWU6IGRhcmspJykubWF0Y2hlcztcclxuICAgICAgICAgICAgICBpZiAoc2F2ZWRUaGVtZSA9PT0gJ2RhcmsnIHx8ICghc2F2ZWRUaGVtZSAmJiBwcmVmZXJzRGFyaykpIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdkYXJrJyk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdkYXJrJyk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7fVxyXG4gICAgICAgICAgfSkoKTtcclxuICAgICAgICBgfVxyXG4gICAgICA8L1NjcmlwdD5cclxuICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxyXG4gICAgICA8VG9hc3RDb250YWluZXJcclxuICAgICAgICBwb3NpdGlvbj1cInRvcC1yaWdodFwiXHJcbiAgICAgICAgYXV0b0Nsb3NlPXs1MDAwfVxyXG4gICAgICAgIGhpZGVQcm9ncmVzc0Jhcj17ZmFsc2V9XHJcbiAgICAgICAgbmV3ZXN0T25Ub3BcclxuICAgICAgICBjbG9zZU9uQ2xpY2tcclxuICAgICAgICBydGw9e2ZhbHNlfVxyXG4gICAgICAgIHBhdXNlT25Gb2N1c0xvc3NcclxuICAgICAgICBkcmFnZ2FibGVcclxuICAgICAgICBwYXVzZU9uSG92ZXJcclxuICAgICAgICB0aGVtZT1cImNvbG9yZWRcIlxyXG4gICAgICAvPlxyXG4gICAgPC8+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTXlBcHA7Il0sIm5hbWVzIjpbInVzZUVmZmVjdCIsIkhlYWQiLCJTY3JpcHQiLCJUb2FzdENvbnRhaW5lciIsIk15QXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIiwic2F2ZWRUaGVtZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJwcmVmZXJzRGFyayIsIndpbmRvdyIsIm1hdGNoTWVkaWEiLCJtYXRjaGVzIiwiZG9jdW1lbnQiLCJkb2N1bWVudEVsZW1lbnQiLCJjbGFzc0xpc3QiLCJhZGQiLCJyZW1vdmUiLCJpZCIsInN0cmF0ZWd5IiwicG9zaXRpb24iLCJhdXRvQ2xvc2UiLCJoaWRlUHJvZ3Jlc3NCYXIiLCJuZXdlc3RPblRvcCIsImNsb3NlT25DbGljayIsInJ0bCIsInBhdXNlT25Gb2N1c0xvc3MiLCJkcmFnZ2FibGUiLCJwYXVzZU9uSG92ZXIiLCJ0aGVtZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(pages-dir-node)/./pages/_app.js\n");

/***/ }),

/***/ "(pages-dir-node)/./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "next/head":
/*!****************************!*\
  !*** external "next/head" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/head");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");

/***/ }),

/***/ "react-toastify":
/*!*********************************!*\
  !*** external "react-toastify" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = import("react-toastify");;

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc","vendor-chunks/react-toastify"], () => (__webpack_exec__("(pages-dir-node)/./pages/_app.js")));
module.exports = __webpack_exports__;

})();