import { expect } from "@playwright/test";
class LoginPage
{

async openLoginPage(page)
{
    const BASE_URL="https://eventhub.rahulshettyacademy.com" ;
 await page.goto(`${BASE_URL}/login`);
 }
 getEmailField(page)
 {

  return  page.getByPlaceholder("you@email.com");
 }
 async login(page){

    await page.getByPlaceholder("you@email.com").fill("beginner@sample.com");
    await page.getByLabel("Password").fill("Rani@1234");
    await page.getByRole("button",{name:'Sign In'}).click();
    await expect(page.getByRole('link', { name: /browse events/i }).first()).toBeVisible();
 }
 async getEventCards(page)
 {
const allEvents=page.locator("a[href^='/events/'] h3");
await expect(allEvents.first()).toBeVisible();
const eventCount=await page.locator("a[href^='/events/'] h3").count();
 expect(eventCount).toBeGreaterThanOrEqual(1);
 const selectedEvent=allEvents.filter({
    hasText:"World Tech Summit"
        });
 await expect(selectedEvent).toHaveCount(1);
 await expect(selectedEvent).toBeVisible();
console.log(await selectedEvent.count());
console.log(await page.locator("a[href^='/events/'] h3").count());
console.log(await page.locator("a[href^='/events/'] h3").allTextContents());


 }
}
module.exports = { LoginPage } ;