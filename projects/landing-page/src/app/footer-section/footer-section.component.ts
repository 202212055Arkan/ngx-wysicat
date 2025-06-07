import { NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Contributor {
  name: string;
  avatar: string;
  href: string;
  title: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-footer-section',
  templateUrl: './footer-section.component.html',
  styleUrls: ['./footer-section.component.css'],
  imports: [NgForOf],
})
export class FooterSectionComponent {
  currentYear = new Date().getFullYear();

  contributors: Contributor[] = [
    {
      name: 'Michal Grzegorczyk',
      avatar: './assets/img/mg.jpeg',
      href: 'https://www.linkedin.com/in/michalgrzegorczyk-dev',
      title: 'core contributor',
    },
    {
      name: 'Pierre Nedelec',
      avatar: './assets/img/pn.jpeg',
      href: 'https://www.linkedin.com/in/pierrenedelec-angular',
      title: 'valuable contributor',
    },
    {
      name: 'Filip Hartman',
      avatar: './assets/img/fh.jpeg',
      href: 'https://www.linkedin.com/in/filip-hartman',
      title: 'sunday contributor',
    },
    {
      name: 'Arkan Mansuri',
      avatar: './assets/img/am.jpeg',
      href: 'https://www.linkedin.com/in/arkan-mansuri/',
      title: 'student contributor',
    },
    {
      name: 'You Are Here',
      avatar: './assets/img/18-user.svg',
      href: '',
      title: 'super contributor',
    },
  ];
}
