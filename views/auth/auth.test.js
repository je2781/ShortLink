"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@testing-library/jest-dom");
const jsdom_1 = require("jsdom");
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const authFile = path_1.default.join(__dirname, 'auth_form.ejs');
ejs_1.default.renderFile(authFile, function (err, str) {
    if (str) {
        let dom;
        let container;
        describe('Auth Form', () => {
            beforeEach(() => {
                dom = new jsdom_1.JSDOM(str, { runScripts: 'dangerously' });
                container = dom.window.document.body;
            });
            test('should load form elements', () => {
                expect(container.querySelector('#fName')).toBeInTheDocument();
                expect(container.querySelector('#email')).toBeInTheDocument();
                expect(container.querySelector('#password')).toBeInTheDocument();
                expect(container.querySelector('#c_password')).toBeInTheDocument();
                expect(container.querySelector('button')).toBeInTheDocument();
            });
        });
    }
});
