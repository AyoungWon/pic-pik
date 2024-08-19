/// <reference types="cypress" />

import "cypress-file-upload";
import { mount } from "cypress/react18";

Cypress.Commands.add("mount", (component) => {
  return mount(component);
});
