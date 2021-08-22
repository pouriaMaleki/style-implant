import { expect } from 'chai';
import * as fs from 'fs';
import * as http from 'http';
import * as puppeteer from 'puppeteer';

let page: puppeteer.Page;
let server: http.Server;
const url = `http://localhost:8080/test.html`;

const addImplant = async (css?: string, options?: unknown): void => {
  const implantInputs = options ? `"${css}",${JSON.stringify(options)}` : `"${css}"`;
  await page.evaluate(implantInputs => {
    const head = document.head;
    const script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = `import styleImplant from "/style-implant.js"; styleImplant(${implantInputs})`;
    head.appendChild(script);
    return;
  }, implantInputs);
};

const addImplants = async (implants: [{ css?: string; options?: unknown }]): void => {
  let implantFunctions = '';
  implants.forEach(implant => {
    const input = implant.options
      ? `"${implant.css}",${JSON.stringify(implant.options)}`
      : `"${implant.css}"`;
    implantFunctions += ` styleImplant(${input});`;
  });
  await page.evaluate(implantFunctions => {
    const head = document.head;
    const script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = `import styleImplant from "/style-implant.js";${implantFunctions}`;
    head.appendChild(script);
    return;
  }, implantFunctions);
};

const getTestColor = async (): string => {
  const color: string = await new Promise(resolve => {
    setTimeout(async () => {
      const colorProperty = await page.evaluate(() => {
        const testElement = document.getElementById('test');
        return window.getComputedStyle(testElement, null).getPropertyValue('color');
      });
      resolve(colorProperty);
    }, 10);
  });
  return color;
};

const getStyleAttribute = async (attribute: string): string => {
  const color: string = await new Promise(resolve => {
    setTimeout(async () => {
      const elementAttribute = await page.evaluate(attribute => {
        const styleElement = document.getElementsByTagName('style')[0];
        return styleElement.getAttribute(attribute);
      }, attribute);
      resolve(elementAttribute);
    }, 10);
  });
  return color;
};

const reloadPage = async (): void => {
  await page.reload({ waitUntil: 'domcontentloaded' });
};

describe('style-implant unit tests', async (): void => {
  before(async function () {
    server = http.createServer((req, res) => {
      if (req.url === '/style-implant.js') {
        res.writeHead(200, { 'content-type': 'text/javascript' });
        fs.createReadStream('./dist/es/style-implant.js').pipe(res);
      } else {
        res.writeHead(200, { 'content-type': 'text/html' });
        fs.createReadStream('./tests/test.html').pipe(res);
      }
    });
    server.listen(8080);
    global.expect = expect;
    global.browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  });

  it('page loaded', async (): void => {
    await Promise.all([page.goto(url, { timeout: 0 }), page.waitForNavigation({ timeout: 0 })]);
    // Page title should be as expected to confirm the test page loaded
    expect(await page.title()).to.eql('style-implant');
  });

  it('undefined css', async (): void => {
    await addImplant(null, {});
    const testElementColor = await getTestColor();
    // Color should be unchanged because no css was passed
    expect(testElementColor).is.equal('rgb(0, 0, 0)');
  });

  it('no options', async (): void => {
    await reloadPage();
    await addImplant('.test{color: red;}', {});
    const defaultAttribute = await getStyleAttribute('data-style-implant');
    const testElementColor = await getTestColor();
    // Default attribute should have the value ''
    expect(defaultAttribute).is.equal('');
    // Color should be red because css was passed with no options
    expect(testElementColor).is.equal('rgb(255, 0, 0)');
  });

  it('custom attributes', async (): void => {
    await reloadPage();
    await addImplant('.test{color: red;}', { attributes: { 'data-test': 'success' } });
    const testAttribute = await getStyleAttribute('data-test');
    // Test attribute should have the value 'success'
    expect(testAttribute).is.equal('success');
  });

  it('insert at top', async (): void => {
    await reloadPage();
    await addImplants([
      { css: '.test{color: blue;}', options: {} },
      { css: '.test{color: red;}', options: { insertAt: 'top' } },
    ]);
    const testElementColor = await getTestColor();
    // Color should be blue because the second implant is added to the top so it gets overridden
    expect(testElementColor).is.equal('rgb(0, 0, 255)');
  });

  // eslint-disable-next-line quotes
  it("don't preserve order", async (): void => {
    await reloadPage();
    await addImplants([
      { css: '.test{color: red;}', options: { insertAt: 'top' } },
      { css: '.test{color: blue;}', options: { insertAt: 'top' } },
    ]);
    const testElementColor = await getTestColor();
    // Color should be red because the second implant is added before the first
    expect(testElementColor).is.equal('rgb(255, 0, 0)');
  });

  it('preserve order', async (): void => {
    await reloadPage();
    await addImplants([
      { css: '.test{color: red;}', options: { insertAt: 'top', preserveOrder: true } },
      { css: '.test{color: blue;}', options: { insertAt: 'top', preserveOrder: true } },
    ]);
    const testElementColor = await getTestColor();
    // Color should be blue because the second implant is added after the first as preserveOrder is enabled
    expect(testElementColor).is.equal('rgb(0, 0, 255)');
  });

  after(async (): void => {
    await page.close();
    await browser.close();
    await server.close();
  });
});
