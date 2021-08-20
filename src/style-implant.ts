const styleImplant = (
  css: string,
  {
    insertAt,
  }: {
    insertAt?: string | null;
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

  return true;
};

interface HTMLStyleElementExtended extends HTMLStyleElement {
  styleSheet?: {
    cssText?: string;
  };
}

export default styleImplant;
