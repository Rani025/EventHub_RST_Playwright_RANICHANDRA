const{test,expect}=require('@playwright/test');
const{LoginPage}=require("../helper/loginpage")
const loginpage= new LoginPage();
test("EventHub login page loads", async({page})=>
{
 console.log("test1 started");
 loginpage.openLoginPage(page);
 await expect(page.getByPlaceholder("you@email.com")).toBeVisible();

await expect(page.getByRole("button",{name:'Sign In'})).toHaveText("Sign In");
console.log("test1 ended");

});
//npm install -D @playwright test install the test library and npx playwright instll, intalled the browsers such as cromium, firfox and webkit.

test("login page second test", async({page})=>
{
 console.log("test2 started");
 loginpage.openLoginPage(page);
  
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(page).toHaveURL(/.*\/login/);
  await expect(page.locator(".text-xl")).toHaveText("Sign in to EventHub");
 
console.log("test2 ended");
});
// Playwright actions return promises and await prevents timing issues and flaky behavior
//if we donot use wait in actions the script might move to next line of code without completing previous one or it might target an element which is not exist or not visible.
