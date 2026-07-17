const {test,expect}=require ('@playwright/test')
import { LoginPage } from '../helper/loginpage';

test("eventHub login",async({page})=>{
const loginpage = new LoginPage();
await loginpage.openLoginPage(page);
await loginpage.login(page);
await page.getByRole('link', { name: /browse events/i }).first().click();
await expect(page.locator(".text-3xl")).toHaveText("Upcoming Events");
await page.getByPlaceholder("Search events, venues…").fill("World");
await page.locator("select").first().selectOption("Conference");
await page.locator("select").last().selectOption("Hyderabad");
const cityDrpodown= page.locator("select").last();
await expect(cityDrpodown).toHaveValue("Hyderabad");

//await page.pause();

    });
 test.only("working with different locators" ,async({page})=>{
const loginpage1 = new LoginPage();
loginpage1.openLoginPage(page);
await loginpage1.login(page);
await page.getByRole('link', { name: /browse events/i }).first().click();
await expect(page.locator(".text-3xl")).toBeVisible();
await loginpage1.getEventCards(page);
//await page.pause();

    });