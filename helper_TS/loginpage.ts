import { expect, Page } from "@playwright/test";
export class LoginPage
{


async openLoginPage(page:Page)
{
    const BASE_URL="https://eventhub.rahulshettyacademy.com" ;
 await page.goto(`${BASE_URL}/login`);
 }
 getEmailField(page:Page)
 {

  return  page.getByPlaceholder("you@email.com");
 }
 async login1(page:Page){

    await page.getByPlaceholder("you@email.com").fill("beginner@sample.com");
    await page.getByLabel("Password").fill("Rani@1234");
    await page.getByRole("button",{name:'Sign In'}).click();
    await expect(page.getByRole('link', { name: /browse events/i }).first()).toBeVisible();
 }
 async login(page:Page,emailId: string,password:string){

    await page.getByPlaceholder("you@email.com").fill(emailId);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button",{name:'Sign In'}).click();
    await expect(page.getByRole('link', { name: /browse events/i }).first()).toBeVisible();
 }
 async getEventCards(page:Page)
 {
    //Step 3 — Work with multiple matching event cards
const allEvents=page.locator("article");
//a[href^='/events/'] h3
return allEvents;
 }
 async parseSeatCount(eventSeats:any)
 {
    
  const seat= parseInt(eventSeats);
    
return seat;

 }
}
//module.exports = { LoginPage } ;