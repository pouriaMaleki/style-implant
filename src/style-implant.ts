const styleImplant = (
  css: string,
  {
    attributes,
    insertAt,
    preserveOrder,
  }: {
    attributes?: Record<string, string>;
    insertAt?: 'top' | 'bottom';
    preserveOrder?: boolean;
  } = {}
): boolean => {
  if (!css || typeof document === 'undefined') return false;

  const head = document.head || document.getElementsByTagName('head')[0];
  const style: HTMLStyleElementExtended = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      if (preserveOrder) {
        // Find the first child that isn't an implanted style tag
        const firstNonImplant = Array.from(head.children).find(child => {
          return child.getAttribute('data-style-implant') === null;
        });
        if (firstNonImplant) {
          head.insertBefore(style, firstNonImplant as Node);
        } else {
          head.appendChild(style);
        }
      } else {
        head.insertBefore(style, head.firstChild);
      }
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

  // This attribute is used to check if a style tag is implanted
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
