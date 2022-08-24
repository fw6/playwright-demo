import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { cwd } from 'node:process';

const imgData = 'data:image/png;base64,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'

// test('homepage has Playwright in title and get started link linking to the intro page', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);

//   // create a locator
//   const getStarted = page.locator('text=Get Started');

//   // Expect an attribute "to be strictly equal" to the value.
//   await expect(getStarted).toHaveAttribute('href', '/docs/intro');

//   // Click the get started link.
//   await getStarted.click();

//   // Expects the URL to contain intro.
//   await expect(page).toHaveURL(/.*intro/);
// });

test('translate html page to pdf', async ({ page }) => {
    await page.goto(`file://${path.resolve(cwd(), 'test.html')}`);
    const print_css = readFileSync(path.resolve(cwd(), 'css/froala_print.min.css')).toString('utf-8');
    const editor_css = readFileSync(path.resolve(cwd(), 'css/froala_editor.pkgd.min.css')).toString('utf-8');
    const editor_style_css = readFileSync(path.resolve(cwd(), 'css/froala_style.min.css')).toString('utf-8');
    const pageCss = `margin-left:11.1800mm;margin-right:11.1800mm;size:A4 portrait;`;

    const headerContent= `<div style="min-height:129.354330708661px;padding-top:45.354330708661px;"><div class="fr-wrapper"><div class="fr-element fr-view"><p id="qys-paragraph-47cc3e">sdbkjgfmk的空间关闭煤矿的美白抗过敏你的空间不能发空间内能克服纪念碑没看见看见你的不痛快就能看你的空间比你高科技看你的空间比你看你的卡不能打开能看见年度报告看过漫画里可能分开不忙了开发机构内部空间2的内部空间2东南部看见你</p></div></div></div>`

    await page.pdf({
        displayHeaderFooter: true,
        headerTemplate: `
        <style type="text/css">${print_css}</style>
        <style type="text/css">${editor_css}</style>
        <style type="text/css">${editor_style_css}</style>
        <style type="text/css">.fr-wrapper{${pageCss}}</style>
        <div style="width:100%;height:100%;border:1px solid;>${headerContent}</div>
        `,
        footerTemplate: 'this is footer',
        path: './test.pdf',
        printBackground: true,
        preferCSSPageSize: true,
    });

//   await expect(page).toHaveURL(/.*intro/);
});
