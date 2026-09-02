const{test,expect} = require('@playwright/test');
const{LoginPage}=require("../pageobjects/LoginPage");
let loginpage;
//const BASE_URL="https://eventhub.rahulshettyacademy.com" ;
test("consfigx-smoke test", async ({page})=>
     {
   loginpage=new LoginPage(page);
   await loginpage.opneLoginByConfiguredURL();
   await page.pause();
   await  loginpage.assertingLoginPage();
   });

test("new test for browser page", async({page,browser})=>{
    loginpage=new LoginPage(page);
    loginpage.openLoginPage();
await loginpage.getEmailField();

const isolatedContext= await browser.newContext();
const isolatedPage=await isolatedContext.newPage();
const loginpage2=new LoginPage(isolatedPage);
await loginpage2.openLoginPage();
await loginpage2.isolatedPageChecking();
//await isolatedPage.goto(`${BASE_URL}/login`);

await isolatedPage.close();
/*page fixture gives you one ready-to-use page for the test
browser context is a separate browser session container that can create its own pages
a fresh browser context starts with isolated state*/
});