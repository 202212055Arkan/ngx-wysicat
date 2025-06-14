export interface ImageResizorOptions {
  modules?: string[];
  overlayStyles?: Record<string, string | number>;
  handleStyles?: Record<string, string | number>;
  displayStyles?: Record<string, string | number>;
  toolbarStyles?: Record<string, string | number>;
  toolbarButtonStyles?: Record<string, string | number>;
  toolbarButtonSvgStyles?: Record<string, string | number>;
}

export const DEFAULT_IMAGE_RESIZOR_CONFIG: ImageResizorOptions = {
  modules: ['DisplaySize', 'Toolbar', 'Resize'],
  overlayStyles: {
    position: 'absolute',
    boxSizing: 'border-box',
    border: '1px solid var(--nw-color-red-500)',
  },
  handleStyles: {
    position: 'absolute',
    height: '10px',
    width: '10px',
    backgroundColor: 'var(--nw-color-white)',
    border: '1px solid var(--nw-color-primary-400)',
    boxSizing: 'border-box',
    opacity: '0.90',
    borderRadius: '50%',
    boxShadow: 'var(--shadow-xs)',
  },
  displayStyles: {
    position: 'absolute',
    font: '12px/1.0 var(--nw-font-family)',
    padding: '4px 8px',
    textAlign: 'center',
    backgroundColor: 'var(--nw-color-white)',
    color: 'var(--nw-color-primary-800)',
    border: '1px solid var(--nw-color-primary-300)',
    boxSizing: 'border-box',
    opacity: '0.95',
    cursor: 'default',
    borderRadius: '4px',
    boxShadow: 'var(--shadow-xs)',
  },
  toolbarStyles: {
    position: 'absolute',
    top: '-12px',
    right: '0',
    left: '0',
    height: '0',
    minWidth: '100px',
    font: '12px/1.0 var(--nw-font-family)',
    textAlign: 'center',
    color: 'var(--nw-color-primary-800)',
    boxSizing: 'border-box',
    cursor: 'default',
  },
  toolbarButtonStyles: {
    display: 'inline-block',
    width: '24px',
    height: '24px',
    background: 'var(--nw-color-white)',
    border: '1px solid var(--nw-color-primary-300)',
    verticalAlign: 'middle',
    borderRadius: '4px',
    boxShadow: 'var(--shadow-2xs)',
  },
  toolbarButtonSvgStyles: {
    fill: 'var(--nw-color-primary-600)',
    stroke: 'var(--nw-color-primary-600)',
    strokeWidth: '2',
  },
};
