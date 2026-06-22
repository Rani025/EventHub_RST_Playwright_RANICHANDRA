const{test,expect} = require('@playwright/test');
const{LoginPage}=require("../helper/loginpage");
const loginpage=new LoginPage();
const BASE_URL="https://eventhub.rahulshettyacademy.com" ;
test("consfigx-smoke test", async ({page})=>
     {
    await page.goto('/login');
    await expect(page).toHaveTitle(/EventHub/i);
    await expect(page.getByPlaceholder("you@email.com")).toBeVisible();
    await expect(page.getByRole("button",{name:"Sign In"})).toBeVisible();
});

test("new test for browser page", async({page,browser})=>
{
 loginpage.openLoginPage(page);
await page.getByPlaceholder("you@email.com").fill("beginner@sample.com");
await expect(page.getByPlaceholder("you@email.com")).toHaveValue("beginner@sample.com");
const isolatedContext= await browser.newContext();
const isolatedPage=await isolatedContext.newPage();
await isolatedPage.goto(`${BASE_URL}/login`);
await expect(isolatedPage.locator(".text-xl")).toHaveText("Sign in to EventHub");
await expect(isolatedPage.getByPlaceholder("you@email.com")).toHaveValue("");
await isolatedPage.close();
/*page fixture gives you one ready-to-use page for the test
browser context is a separate browser session container that can create its own pages
a fresh browser context starts with isolated state*/
});