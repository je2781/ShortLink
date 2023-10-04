import mongoose from "mongoose";
import request from "supertest";
import app from "../../functions/api";
import '@testing-library/jest-dom';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import ejs from 'ejs';

const navFile = path.join(__dirname, 'nav.ejs');

ejs.renderFile(navFile, function (err, str) {
    if (str) {
      let dom: JSDOM;
      let container: HTMLElement;
  
      describe('Navbar', () => {
        beforeEach(() => {
          dom = new JSDOM(str, { runScripts: 'dangerously' });
          container = dom.window.document.body;
        })
  
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



