import mongoose from "mongoose";
import request from "supertest";
import app from "../../functions/api";
import '@testing-library/jest-dom';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import ejs from 'ejs';

const authFile = path.join(__dirname, 'auth_form.ejs');

ejs.renderFile(authFile, function (err, str) {
    if (str) {
      let dom: JSDOM;
      let container: HTMLElement;
  
      describe('Auth Form', () => {
        beforeEach(() => {
          dom = new JSDOM(str, { runScripts: 'dangerously' });
          container = dom.window.document.body;
        })
  
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



