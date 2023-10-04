"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@testing-library/jest-dom");
const jsdom_1 = require("jsdom");
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const navFile = path_1.default.join(__dirname, 'nav.ejs');
ejs_1.default.renderFile(navFile, function (err, str) {
    if (str) {
        let dom;
        let container;
        describe('Navbar', () => {
            beforeEach(() => {
                dom = new jsdom_1.JSDOM(str, { runScripts: 'dangerously' });
                container = dom.window.document.body;
            });
            test('should load elements', () => {
                expect(container.querySelector('.brand__nav')).toBeInTheDocument();
                expect(container.querySelector('#side-menu-toggle')).toBeInTheDocument();
                expect(container.querySelector('.main-header__nav')).toBeInTheDocument();
                expect(container.querySelector('.main-header__item-list')).toBeInTheDocument();
                expect(container.querySelector('.main-header__item')).toBeInTheDocument();
                expect(container.querySelector('.mobile-nav')).toBeInTheDocument();
                expect(container.querySelector('.mobile-nav__item-list')).toBeInTheDocument();
                expect(container.querySelector('.mobile-nav__item')).toBeInTheDocument();
            });
        });
    }
});
