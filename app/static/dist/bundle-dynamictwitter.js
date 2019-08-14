(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["dynamictwitter"],{

/***/ "./reactJS/pages/homepages/twitter/twitterapi.jsx":
/*!********************************************************!*\
  !*** ./reactJS/pages/homepages/twitter/twitterapi.jsx ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var reactstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! reactstrap */ \"./node_modules/reactstrap/es/index.js\");\n\n\n\nconst TwitterAPI = () => {\n  const [tweet, setTweet] = Object(react__WEBPACK_IMPORTED_MODULE_0__[\"useState\"])('');\n  const inputRef = Object(react__WEBPACK_IMPORTED_MODULE_0__[\"useRef\"])();\n\n  const handleTwitterAPI = () => {\n    let data = {\n      'tweet': tweet\n    };\n\n    if (tweet !== '') {\n      fetch('/api/twitter/tweet', {\n        method: 'POST',\n        credentials: 'include',\n        headers: {\n          'Content-Type': 'application/json',\n          'Accept': 'application/json'\n        },\n        body: JSON.stringify(data)\n      }).then(res => res.json().then(response => {\n        if (response === 'Tweet successfully posted!') {\n          setTweet('');\n          inputRef.current.value = '';\n          alert(response);\n        } else {\n          setTweet('');\n          inputRef.current.value = '';\n          alert(response);\n        }\n\n        ;\n      }));\n    } else {\n      alert('It\\'s empty! Please type something to tweet it.');\n    }\n\n    ;\n  };\n\n  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    style: {\n      width: '100vw',\n      height: '100vh',\n      display: 'flex',\n      position: 'relative',\n      background: 'linear-gradient(to right top, #555454, #594b4e, #59424e, #543b53, #46365b, #35365c, #21365b, #003658, #00354b, #0f323e, #1c2f32, #252a2a)'\n    }\n  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_1__[\"Container\"], {\n    className: \"align-self-center\"\n  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_1__[\"Row\"], {\n    className: \"justify-content-center my-5\"\n  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_1__[\"Col\"], {\n    md: 10,\n    lg: 8,\n    offset: {\n      md: 2,\n      lg: 4\n    }\n  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"h2\", {\n    style: {\n      color: 'white',\n      textAlign: 'center'\n    }\n  }, \"Tweet through Twitter's API\")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_1__[\"Col\"], {\n    md: 10,\n    lg: 8,\n    offset: {\n      md: 2,\n      lg: 4\n    }\n  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"h4\", {\n    style: {\n      color: 'white',\n      textAlign: 'center'\n    }\n  }, \"(Administrators only but unlocked for everyone to test the feature as pleased)\"))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_1__[\"Row\"], {\n    className: \"justify-content-center my-5\"\n  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_1__[\"Col\"], {\n    md: 10,\n    lg: 6,\n    offset: {\n      md: 2,\n      lg: 6\n    },\n    className: \"my-5\"\n  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_1__[\"InputGroup\"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_1__[\"Input\"], {\n    innerRef: inputRef,\n    onChange: e => setTweet(e.target.value)\n  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_1__[\"Button\"], {\n    color: \"primary\",\n    onClick: handleTwitterAPI\n  }, \"Tweet\"))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_1__[\"Col\"], {\n    md: 10,\n    lg: 8,\n    offset: {\n      md: 2,\n      lg: 4\n    }\n  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"p\", {\n    style: {\n      color: 'white',\n      textAlign: 'center'\n    }\n  }, \"Check out your tweet on our \", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"a\", {\n    href: \"https://twitter.com/smallWo32181120\",\n    target: \"_blank\"\n  }, \"twitter\"))))));\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (TwitterAPI);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9yZWFjdEpTL3BhZ2VzL2hvbWVwYWdlcy90d2l0dGVyL3R3aXR0ZXJhcGkuanN4LmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vcmVhY3RKUy9wYWdlcy9ob21lcGFnZXMvdHdpdHRlci90d2l0dGVyYXBpLmpzeD8xOTc4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSwgdXNlUmVmIH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQge1xyXG4gICAgQ29udGFpbmVyLCBSb3csIENvbCxcclxuICAgIElucHV0R3JvdXAsIElucHV0LCBCdXR0b25cclxufSBmcm9tICdyZWFjdHN0cmFwJztcclxuXHJcblxyXG5cclxuY29uc3QgVHdpdHRlckFQSSA9ICgpID0+IHtcclxuICAgIGNvbnN0IFt0d2VldCwgc2V0VHdlZXRdID0gdXNlU3RhdGUoJycpO1xyXG4gICAgY29uc3QgaW5wdXRSZWYgPSB1c2VSZWYoKTtcclxuXHJcbiAgICBjb25zdCBoYW5kbGVUd2l0dGVyQVBJID0gKCkgPT4ge1xyXG4gICAgICAgIGxldCBkYXRhID0geyd0d2VldCc6IHR3ZWV0fTtcclxuICAgICAgICBpZiAodHdlZXQgIT09ICcnKSB7XHJcbiAgICAgICAgICAgIGZldGNoKCcvYXBpL3R3aXR0ZXIvdHdlZXQnLCB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgICAgICAgICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKClcclxuICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09PSAnVHdlZXQgc3VjY2Vzc2Z1bGx5IHBvc3RlZCEnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VHdlZXQoJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlucHV0UmVmLmN1cnJlbnQudmFsdWUgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFR3ZWV0KCcnKTtcclxuICAgICAgICAgICAgICAgICAgICBpbnB1dFJlZi5jdXJyZW50LnZhbHVlID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KCdJdFxcJ3MgZW1wdHkhIFBsZWFzZSB0eXBlIHNvbWV0aGluZyB0byB0d2VldCBpdC4nKVxyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdiBzdHlsZT17e3dpZHRoOiAnMTAwdncnLCBoZWlnaHQ6ICcxMDB2aCcsIGRpc3BsYXk6ICdmbGV4JywgcG9zaXRpb246ICdyZWxhdGl2ZScsIGJhY2tncm91bmQ6ICdsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQgdG9wLCAjNTU1NDU0LCAjNTk0YjRlLCAjNTk0MjRlLCAjNTQzYjUzLCAjNDYzNjViLCAjMzUzNjVjLCAjMjEzNjViLCAjMDAzNjU4LCAjMDAzNTRiLCAjMGYzMjNlLCAjMWMyZjMyLCAjMjUyYTJhKSd9fT5cclxuICAgICAgICAgICAgPENvbnRhaW5lciBjbGFzc05hbWU9XCJhbGlnbi1zZWxmLWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgPFJvdyBjbGFzc05hbWU9XCJqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIG15LTVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8Q29sIG1kPXsxMH0gbGc9ezh9IG9mZnNldD17eyBtZCA6IDIsIGxnIDogNH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDIgc3R5bGU9e3tjb2xvcjogJ3doaXRlJywgdGV4dEFsaWduOiAnY2VudGVyJ319PlR3ZWV0IHRocm91Z2ggVHdpdHRlcidzIEFQSTwvaDI+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgICAgICAgICAgPENvbCBtZD17MTB9IGxnPXs4fSBvZmZzZXQ9e3sgbWQgOiAyLCBsZyA6IDR9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGg0IHN0eWxlPXt7Y29sb3I6ICd3aGl0ZScsIHRleHRBbGlnbjogJ2NlbnRlcid9fT4oQWRtaW5pc3RyYXRvcnMgb25seSBidXQgdW5sb2NrZWQgZm9yIGV2ZXJ5b25lIHRvIHRlc3QgdGhlIGZlYXR1cmUgYXMgcGxlYXNlZCk8L2g0PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICAgICAgICAgICAgICA8Um93IGNsYXNzTmFtZT1cImp1c3RpZnktY29udGVudC1jZW50ZXIgbXktNVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxDb2wgbWQ9ezEwfSBsZz17Nn0gb2Zmc2V0PXt7IG1kIDogMiwgbGcgOiA2fX0gY2xhc3NOYW1lPVwibXktNVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8SW5wdXRHcm91cD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxJbnB1dCBpbm5lclJlZj17aW5wdXRSZWZ9IG9uQ2hhbmdlPXsoZSkgPT4gc2V0VHdlZXQoZS50YXJnZXQudmFsdWUpfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiBjb2xvcj1cInByaW1hcnlcIiBvbkNsaWNrPXtoYW5kbGVUd2l0dGVyQVBJfT5Ud2VldDwvQnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L0lucHV0R3JvdXA+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgICAgICAgICAgPENvbCBtZD17MTB9IGxnPXs4fSBvZmZzZXQ9e3sgbWQgOiAyLCBsZyA6IDR9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9e3tjb2xvcjogJ3doaXRlJywgdGV4dEFsaWduOiAnY2VudGVyJ319PkNoZWNrIG91dCB5b3VyIHR3ZWV0IG9uIG91ciA8YSBocmVmPVwiaHR0cHM6Ly90d2l0dGVyLmNvbS9zbWFsbFdvMzIxODExMjBcIiB0YXJnZXQ9XCJfYmxhbmtcIj50d2l0dGVyPC9hPjwvcD5cclxuICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgICAgICAgICA8L0NvbnRhaW5lcj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICk7XHJcbn07XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVHdpdHRlckFQSTsiXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBUEE7QUFXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0E7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFHQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFNQTtBQUNBO0FBRUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./reactJS/pages/homepages/twitter/twitterapi.jsx\n");

/***/ })

}]);