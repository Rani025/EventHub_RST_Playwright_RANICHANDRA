const {test,expect}=require ('@playwright/test')
import { LoginPage } from '../helper/loginpage';

test("eventHub login",async({page})=>
    {
const loginpage = new LoginPage();
loginpage.openLoginPage(page);
await page.getByPlaceholder("you@email.com").fill("beginner@sample.com");
await page.getByLabel("Password").fill("Rani@1234");
await page.getByRole("button",{name:'Sign In'}).click();
await page.getByRole('link', { name: /browse events/i }).first().click();
await expect(page.locator(".text-3xl")).toHaveText("Upcoming Events");

    });