import { Component } from "@angular/core";

@Component({
  selector: 'rde-link-test',
  template: `
    <h1>Hello</h1>
  `,
})
export class RdeLinkTestComponent {
    constructor() {
        console.log('RdeLinkTestComponent');
    }
}