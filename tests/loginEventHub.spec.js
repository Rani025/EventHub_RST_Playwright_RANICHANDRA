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

//await page.getByPlaceholder("Search events, venues…").clear();
//await page.locator("select").first().selectOption("");

//await page.locator("select").last().selectOption("");


//await page.pause();

   /* });
 test.only("working with different locators" ,async({page})=>{
const loginpage1 = new LoginPage();
loginpage1.openLoginPage(page);
await loginpage1.login(page);*/
//await page.getByRole('link', { name: /browse events/i }).first().click();
//await expect(page.locator(".text-3xl")).toBeVisible();

const  allEvents=await loginpage.getEventCards(page);

await expect(allEvents.first()).toBeVisible();
//console.log(await allEvents.count());
const eventCount=await allEvents.count();
 await expect(eventCount).toBeGreaterThanOrEqual(1);
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
const seatCount= await loginpage.parseSeatCount(eventSeats);//Parse eventSeatsText using your parseSeatCount helper
console.log(seatCount);

await expect(seatCount).toBeGreaterThanOrEqual(0);
const tittle=await eventTitle.textContent();
const eventPrice=await eventPriceText.textContent();
console.log("event PRICE")
console.log(eventPrice);
//Open the correct event using a scoped locator
await selectedEvent.locator("#book-now-btn").click();
console.log(await page.url());
await expect(page).toHaveURL(/events/);
await page.waitForURL("**/events/**");
const EventsPageText=await page.locator("h1").textContent();
//console.log(EventsPageText);

await expect(EventsPageText).toContain(tittle);

//.grid .mb-6
const eventGrids= page.locator(".grid .mb-6 div div");
const priceOfTickets = await eventGrids.nth(5).textContent();
console.log(priceOfTickets);
await expect(priceOfTickets).toContain(eventPrice);

//Test 2 — Practice nth, first, and last on the event list
await page.goto("/events");
await page.getByPlaceholder("Search events, venues…").clear();
await page.locator("select").first().selectOption("");
await page.locator("select").last().selectOption("");
//await page.pause();
const  allEvents1=await loginpage.getEventCards(page);
await expect(allEvents1.last()).toBeVisible();
const count2=await allEvents1.count()
await expect(count2).toBeGreaterThanOrEqual(3);
 console.log(count2);
 //a[href^='/events/'] h3
 const eventTittles=allEvents1.locator("h3");
 const firstTittle=await eventTittles.first().textContent();
 console.log(firstTittle);
 const  lastTittle=await eventTittles.last().textContent();
 const secondTittle=await eventTittles.nth(1).textContent();
 console.log(lastTittle);
 console.log(secondTittle);
 const allTittles=await eventTittles.allTextContents();
  await expect(allTittles).not.toBe("");
  await expect(firstTittle).not.toBe(lastTittle);


    });
    
  