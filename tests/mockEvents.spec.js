const {test,expect,request}=require ('@playwright/test')
import { LoginPage } from '../helper/loginpage';
import mockData from'../test data/mockEventData.json';
import {BookingHelper} from '../helper/booking'

test("api mock test",async({page})=>{
  const loginpage = new LoginPage();
   await page.route("**/api/events**",
     async route=>{

     const response=await page.request.fetch(route.request());
     // const body=JSON.stringify(mockData);
      const url = new URL(route.request().url());
      const pathParts = url.pathname.split("/");
    const lastPart = pathParts[pathParts.length - 1];


    // 1. Handle single event detail API
    if (!isNaN(lastPart) && lastPart !== "") {

        const eventId = lastPart;

        const event = mockData.data.find(
            event => event.id.toString() === eventId
        );

        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
                success: true,
                data: event
            })
        });

        return; // very important
    }

    const search =await url.searchParams.get("search");
    const category =await  url.searchParams.get("category");
    const city =await url.searchParams.get("city");
     let body;
     let filteredEvents = mockData.data;


if (search) {
    const searchWords = search
      .toLowerCase()
      .split(" ");

 filteredEvents = filteredEvents.filter(event => {

    const eventText = Object.values(event)
        .join(" ")
        .toLowerCase();

    return searchWords.every(word =>
        eventText.includes(word)
    );

 });
    
}


if (category) {
    filteredEvents =  filteredEvents.filter(event =>
        event.category === category
    );
}


if (city) {
    filteredEvents = filteredEvents.filter(event =>
        event.city === city
    );
}
      await route.fulfill({
         response,
         
        body:JSON.stringify({
          ...mockData,
          data:filteredEvents})
     });
    }
  );
     
  //operations after mocked events   
  await loginpage.openLoginPage(page);
  await loginpage.login1(page); 
 await page.goto("/events");
     await page.waitForResponse("**/api/events**")
     await expect(page.locator(".text-3xl")).toHaveText("Upcoming Events");
     const allEvents = await loginpage.getEventCards(page);

  await expect(allEvents.first()).toBeVisible();
   const eventCount = await allEvents.count();
  await expect(eventCount).toBe(4);
  for(let i=0;i<4;i++){

    await expect(allEvents.nth(i)).toBeVisible();
    // await page.pause();
  }
  await expect(allEvents).not.toContainText(["World Tech Summit"])
  for (let i=0;i<mockData.data.length;i++)
  {
await expect(allEvents.nth(i).locator("a[href^='/events/'] h3")).toContainText(mockData.data[i].title);
await expect(allEvents.nth(i).locator(".pt-3 span")).toContainText(mockData.data[i].availableSeats.toString());//convert number to string
await expect(allEvents.nth(i).locator(".pt-3 p")).toContainText(`$${Number(mockData.data[i].price).toLocaleString()}`);
await expect(allEvents.nth(i).locator("#book-now-btn")).toHaveAttribute("href",`/events/${mockData.data[i].id}`);

  }

   await expect(page.locator(".text-3xl")).toHaveText("Upcoming Events");
  await page.getByPlaceholder("Search events, venues…").fill("Hyderabad conference");
  await page.locator("select").first().selectOption("Conference");
  await page.locator("select").last().selectOption("Hyderabad");
  await expect(allEvents.first()).toBeVisible();
   const selectedEvent = allEvents.filter({
    hasText: "Tech Innovators Conference 2026"
  });
  console.log(selectedEvent.textContent());
 const eventTitle = await selectedEvent.locator("a[href^='/events/'] h3").textContent();
 const eventPrice=await selectedEvent.locator(".pt-3 p").textContent();
 const eventAvailableSeats= parseInt(await selectedEvent.locator(".pt-3 span").textContent()).toString();
 
 //await page.pause();
 const bookNowLink= selectedEvent.getByTestId("book-now-btn");

 const href = await bookNowLink.getAttribute("href");
 
await expect(bookNowLink).toBeVisible();
//console.log(await bookNowLink.count());
await Promise.all([
  page.waitForURL("**/events/**"),
   bookNowLink.click()
]);
 
 //await  bookNowLink.click();

  //console.log(await page.url());
  //await expect(page).toHaveURL(/events/);
 //await page.waitForURL("**/events**");

  await expect(page.locator("h1")).toHaveText( eventTitle);

   const eventGrids = page.locator(".grid .mb-6 div div");
  const priceOfTickets = await eventGrids.nth(5).textContent();
  //console.log(priceOfTickets);
  await expect(priceOfTickets).toContain(eventPrice);
  await expect (await eventGrids.nth(4).locator("span").textContent()).toContain(eventAvailableSeats);
const currentPath=await page.url();
  await expect(currentPath).toContain(href);
     const singlePriceOfTicket=Number(priceOfTickets.replace(/[^\d]/g,""));
     const bookingpage=new BookingHelper();
     const ticketCount=parseInt(await page.locator(".ticket-count").textContent());
    
    await  expect(ticketCount).toBe(1);
     await bookingpage.verifyGrandTotal(page,singlePriceOfTicket);
     await expect( page.getByRole("button",{name:"+"})).toBeVisible();
    await page.getByRole("button",{name:"+"}).click();
     await bookingpage.verifyGrandTotal(page,singlePriceOfTicket);

     //await page.pause();

});


