import Link from 'quill/formats/link.js';

export class CustomLink extends Link {
  static override create(value: string) {
    const node = super.create(value) as HTMLElement;
    node.setAttribute('href', value);
    node.setAttribute('rel', 'noopener noreferrer');
    node.setAttribute('target', '_blank');

    const element = document.createElement('span');
    element.classList.add('google-docs-icon');

    const img = document.createElement('img');
    img.setAttribute('src', 'https://cdn-icons-png.flaticon.com/512/281/281760.png');
    img.style.width = '14px';
    img.style.height = '14px';
    img.style.display = 'inline-block';
    img.style.verticalAlign = 'middle';

    element.appendChild(img);
    node.classList.add('google-docs-link');
    node.prepend(element);

    node.addEventListener('mouseenter', (e) => {
      const target = e.currentTarget as HTMLElement;
      const url = target.getAttribute('href') || '';

      const existingPreviewId = target.getAttribute('data-preview-id');
      if (existingPreviewId && document.getElementById(existingPreviewId)) {
        return;
      }

      let domainName = '';
      let iconUrl = 'https://cdn-icons-png.flaticon.com/512/281/281760.png';

      try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;

        if (hostname.includes('docs.google')) {
          domainName = 'Google Docs';
        } else if (hostname.includes('youtube') || hostname.includes('youtu.be')) {
          domainName = 'YouTube';
          iconUrl = 'https://cdn-icons-png.flaticon.com/512/174/174883.png';
        } else {
          domainName = hostname.replace('www.', '');
          const domainParts = domainName.split('.');
          if (domainParts.length > 0) {
            const mainDomain = domainParts[0];
            domainName = mainDomain.charAt(0).toUpperCase() + mainDomain.slice(1);
          }
        }
      } catch (e) {
        domainName = 'Web Link';
      }

      const preview = document.createElement('div');
      preview.classList.add('link-preview-popup');

      // @ts-ignore
      const styleActionButton = (button, color = '#333333') => {
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.cursor = 'pointer';
        button.style.width = '24px';
        button.style.height = '24px';
        button.style.borderRadius = '4px';
        button.style.transition = 'background-color 0.2s ease';
        button.style.color = color;

        button.addEventListener('mouseover', () => {
          button.style.backgroundColor = '#f0f0f0';
        });

        button.addEventListener('mouseout', () => {
          button.style.backgroundColor = 'transparent';
        });
      };

      const copyButton = document.createElement('div');
      styleActionButton(copyButton);
      copyButton.title = 'Copy link';

      copyButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      `;

      copyButton.addEventListener('click', (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(url).then(() => {
          const originalContent = copyButton.innerHTML;
          copyButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          `;
          copyButton.style.color = '#10B981';

          setTimeout(() => {
            copyButton.innerHTML = originalContent;
            copyButton.style.color = '#333333';
          }, 1500);
        });
      });

      const openButton = document.createElement('div');
      styleActionButton(openButton, 'var(--nw-color-primary-600, #2563eb)');
      openButton.title = 'Open link';

      openButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      `;

      openButton.addEventListener('click', (e) => {
        e.stopPropagation();
        window.open(url, '_blank');
      });

      const removeButton = document.createElement('div');
      styleActionButton(removeButton, '#DC2626');
      removeButton.title = 'Remove link';

      removeButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6L6 18M6 6l12 12"></path>
        </svg>
      `;

      removeButton.addEventListener('click', (e) => {
        e.stopPropagation();

        const event = new CustomEvent('quill-link-action', { detail: { node: target } });
        document.dispatchEvent(event);

        preview.remove();
        target.removeAttribute('data-preview-id');
      });

      const actionsContainer = document.createElement('div');
      actionsContainer.style.display = 'flex';
      actionsContainer.style.gap = '4px';
      actionsContainer.style.position = 'absolute';
      actionsContainer.style.top = '8px';
      actionsContainer.style.right = '8px';

      actionsContainer.appendChild(copyButton);
      actionsContainer.appendChild(openButton);
      actionsContainer.appendChild(removeButton);

      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.alignItems = 'center';
      header.style.marginBottom = '8px';
      header.style.paddingRight = '80px';

      const linkIcon = document.createElement('img');
      linkIcon.src = iconUrl;
      linkIcon.style.width = '16px';
      linkIcon.style.height = '16px';
      linkIcon.style.marginRight = '8px';
      linkIcon.style.flexShrink = '0';

      const headerText = document.createElement('span');
      headerText.textContent = domainName;
      headerText.style.fontWeight = '500';
      headerText.style.fontSize = '13px';

      header.appendChild(linkIcon);
      header.appendChild(headerText);


      // add web elements to the header
      const a = document.createElement('link-test');
      header.appendChild(a);

      const content = document.createElement('div');
      content.style.fontSize = '13px';
      content.style.overflow = 'hidden';
      content.style.textOverflow = 'ellipsis';
      content.style.whiteSpace = 'nowrap';

      const linkElement = document.createElement('a');
      linkElement.href = url;
      linkElement.textContent = url;
      linkElement.style.color = 'var(--nw-color-primary-600, #2563eb)';
      linkElement.style.textDecoration = 'underline';
      linkElement.style.cursor = 'pointer';

      linkElement.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(url, '_blank');
      });

      content.appendChild(linkElement);

      preview.appendChild(actionsContainer);
      preview.appendChild(header);
      preview.appendChild(content);

      preview.style.backgroundColor = '#ffffff';
      preview.style.color = '#333333';
      preview.style.border = 'none';
      preview.style.borderRadius = '8px';
      preview.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
      preview.style.fontSize = '13px';
      preview.style.maxWidth = '280px';
      preview.style.width = '260px';
      preview.style.overflow = 'hidden';
      preview.style.padding = '14px 14px';
      preview.style.position = 'fixed';
      preview.style.zIndex = '2147483647';
      preview.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
      preview.style.position = 'fixed';

      const rect = target.getBoundingClientRect();
      preview.style.top = `${rect.bottom + 6}px`;
      preview.style.left = `${rect.left}px`;

      const previewId = `preview-${Date.now()}`;
      preview.id = previewId;
      target.setAttribute('data-preview-id', previewId);

      preview.addEventListener('mouseenter', () => {
        preview.setAttribute('data-mouse-over', 'true');
      });

      preview.addEventListener('mouseleave', () => {
        preview.removeAttribute('data-mouse-over');

        if (!target.matches(':hover')) {
          preview.remove();
          target.removeAttribute('data-preview-id');
        }
      });

      preview.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      document.body.appendChild(preview);
    });

    node.addEventListener('mouseleave', (e) => {
      const target = e.currentTarget as HTMLElement;
      const previewId = target.getAttribute('data-preview-id');

      if (previewId) {
        const preview = document.getElementById(previewId);

        if (preview) {
          if (!preview.hasAttribute('data-mouse-over')) {
            setTimeout(() => {
              if (preview && !preview.hasAttribute('data-mouse-over')) {
                preview.remove();
                target.removeAttribute('data-preview-id');
              }
            }, 100);
          }
        }
      }
    });

    return node;
  }
}
