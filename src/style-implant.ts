const styleImplant = (
  css: string,
  {
    insertAt,
    attributes,
  }: {
    insertAt?: string | null;
    attributes?: Record<string, string>;
  } = {}
): boolean => {
  if (!css || typeof document === 'undefined') return false;

  const head = document.head || document.getElementsByTagName('head')[0];
  const style: HTMLStyleElementExtended = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  style.setAttribute('data-style-implant', '');

  if (attributes) {
    Object.keys(attributes).forEach(qualifiedName => {
      style.setAttribute(qualifiedName, attributes[qualifiedName]);
    });
  }

  return true;
};

interface HTMLStyleElementExtended extends HTMLStyleElement {
  styleSheet?: {
    cssText?: string;
  };
}

export default styleImplant;
