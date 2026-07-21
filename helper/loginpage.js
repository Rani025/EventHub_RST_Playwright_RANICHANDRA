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
 async login(page,emailId,password){

    await page.getByPlaceholder("you@email.com").fill(emailId);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button",{name:'Sign In'}).click();
    await expect(page.getByRole('link', { name: /browse events/i }).first()).toBeVisible();
 }
 async getEventCards(page)
 {
    //Step 3 — Work with multiple matching event cards
const allEvents=page.locator("article");
//a[href^='/events/'] h3
return allEvents;
 }
 async parseSeatCount(eventSeats)
 {
    
  const seat= parseInt(eventSeats);
    
return seat;

 }
}
module.exports = { LoginPage } ;