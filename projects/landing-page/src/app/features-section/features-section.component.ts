import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features-section.component.html',
  styleUrls: ['./features-section.component.css'],
})
export class FeaturesSectionComponent {
  features = [
    {
      title: 'Zero Lag Editing',
      description: 'Typing feels instant with zero lag. Our editor responds faster than you can blink, handling massive documents with ease while keeping your CPU cool and your battery happy.',
      image: 'assets/img/cat-driving2.png',
      linkText: 'see performance benchmarks',
      linkUrl: '#performance',
      linkIcon: '⚡️'
    },
    {
      title: 'Fully Customizable',
      description: 'Build your perfect workspace with plugins that snap in seamlessly. From markdown to math equations, customize every aspect of your editing experience exactly how you want it.',
      image: 'assets/img/cat-extension2.png',
      linkText: 'explore customization options',
      linkUrl: '#customize',
      linkIcon: '🧩'
    },
    {
      title: 'Truly Open Source',
      description: 'No paywalls, no restrictions, just pure freedom. Fork it, extend it, or contribute back. Join a vibrant community where your ideas shape the future of document editing.',
      image: 'assets/img/cat-opensource2.png',
      linkText: 'view on github and give a star',
      linkUrl: 'https://github.com',
      linkIcon: '🌟'
    },
  ];
}
