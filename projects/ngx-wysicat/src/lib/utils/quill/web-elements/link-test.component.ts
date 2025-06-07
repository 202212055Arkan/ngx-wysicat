import { Component } from "@angular/core";

@Component({
  selector: 'nw-link-test',
  template: `
    <h1>Hello</h1>
  `,
})
export class LinkTestComponent {
    constructor() {
        console.log('RdeLinkTestComponent');
    }
}
