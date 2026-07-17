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

await page.getByPlaceholder("Search events, venues…").clear();
await page.locator("select").first().selectOption("");

await page.locator("select").last().selectOption("");


//await page.pause();

   /* });
 test.only("working with different locators" ,async({page})=>{
const loginpage1 = new LoginPage();
loginpage1.openLoginPage(page);
await loginpage1.login(page);
await page.getByRole('link', { name: /browse events/i }).first().click();
await expect(page.locator(".text-3xl")).toBeVisible();
*/
const  allEvents=await loginpage.getEventCards(page);

await expect(allEvents.first()).toBeVisible();
//console.log(await allEvents.count());
const eventCount=await allEvents.count();
 expect(eventCount).toBeGreaterThanOrEqual(1);
 const selectedEvent=allEvents.filter({
    hasText:"World Tech Summit"
        });
 await expect(selectedEvent).toHaveCount(1);
 await expect(selectedEvent).toBeVisible();
console.log(await selectedEvent.count());

//Step 4 — Extract text and reuse it in assertions
const eventPriceText = selectedEvent.locator(".pt-3 p");
console.log(await eventPriceText.textContent());
const eventSeatsText  = selectedEvent.locator(".pt-3 span");
console.log(await eventSeatsText .textContent());
const eventTitle=selectedEvent.locator("a[href^='/events/'] h3");
console.log(await eventTitle.textContent());
await expect(eventTitle).toHaveText("World Tech Summit");
await expect(eventPriceText).toContainText("$");
//await page.pause();
const eventSeats=await eventSeatsText.textContent();
const seatCount= await loginpage.parseSeatCount(eventSeats);
console.log(seatCount);
expect(seatCount).toBeGreaterThanOrEqual(0);

await selectedEvent.locator("#book-now-btn").click();


    });