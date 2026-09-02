const{test,expect}=require('@playwright/test');
const{LoginPage}= require("../pageobjects/LoginPage");
let loginpage;
test("EventHub login page loads", async({page})=>
{
 console.log("test1 started");
 loginpage= new LoginPage(page);
 await loginpage.openLoginPage();
  await loginpage.assertingLoginPage()

console.log("test1 ended");

});
//npm install -D @playwright test install the test library and npx playwright instll, intalled the browsers such as cromium, firfox and webkit.

test("login page second test", async({page})=>
{
 console.log("test2 started");
 loginpage= new LoginPage(page);
 await loginpage.openLoginPage();
 await loginpage.secondAssertionLogin();  
 
 
console.log("test2 ended");
});
// Playwright actions return promises and await prevents timing issues and flaky behavior
//if we donot use wait in actions the script might move to next line of code without completing previous one or it might target an element which is not exist or not visible.
