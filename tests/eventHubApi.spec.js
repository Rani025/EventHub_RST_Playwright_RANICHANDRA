const { test, expect, request } = require('@playwright/test')
import { LoginPage } from '../helper/loginpage'
import { BookingHelper } from '../helper/booking'

const bookingobjects = new BookingHelper();
let webContext;
const loginPayLoad = {
    email: "beginner@sample.com",
    password: "Rani@1234"
};
let selectedEventId;
const eventBookingPayLoad = {
    "customerName": "Gautam",
    "customerEmail": "gautam@gmail.com",
    "customerPhone": "1234567890",
    "quantity": 2,
    "eventId": selectedEventId
};
let token;
let eventApiBookingData;
let matchEventApiResponseData;
let matchcard;
test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const apiResponse = await apiContext.post("https://api.eventhub.rahulshettyacademy.com/api/auth/login",
        {
            data: loginPayLoad

        });
    await expect(apiResponse.ok()).toBeTruthy();

    const apiResponseJson = await apiResponse.json();
    token = apiResponseJson.token;
    //console.log(token);

    const liveEventApiResponse = await apiContext.get("https://api.eventhub.rahulshettyacademy.com/api/events?limit=6",
        {
            headers:
                { 'Authorization': `Bearer ${token}` }

        });
        //console.log("Authorization:", `Bearer ${token}`);
  // const resposnseText=(await liveEventApiResponse).text();
    //console.log(resposnseText);


    await expect((await liveEventApiResponse).ok()).toBeTruthy();

    const liveApiEventBody = await liveEventApiResponse.json();
    const selectedLiveEvent = liveApiEventBody.data.find(event => event.availableSeats >= 2);
    selectedEventId = selectedLiveEvent.id;
    eventBookingPayLoad.eventId = selectedEventId;

    const eventbookingApiResponse = await apiContext.post("https://api.eventhub.rahulshettyacademy.com/api/bookings", {
        data: eventBookingPayLoad,
        headers:
        {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
        }
    });
    const eventbookingApiResponseJson = await eventbookingApiResponse.json();
    eventApiBookingData = eventbookingApiResponseJson.data;
    //console.log("Booking API response:", eventbookingApiResponseJson);

    await expect(eventbookingApiResponse.ok()).toBeTruthy();


const bookingEventApiResponse = await apiContext.get("https://api.eventhub.rahulshettyacademy.com/api/bookings?page=1&limit=10",
        {
            headers:
                { 'Authorization': `Bearer ${token}` }

        });
        const bookingEventApiResponseJson= await bookingEventApiResponse.json();
         matchEventApiResponseData =bookingEventApiResponseJson.data.find(booking=>booking.bookingRef===eventApiBookingData.bookingRef);
         
         await expect(bookingEventApiResponse.ok()).toBeTruthy();


});

test("Create API bookings ", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.addInitScript(value => {
        window.localStorage.setItem('eventhub_token', value);
    }, token);
    await page.goto("https://eventhub.rahulshettyacademy.com");

    await expect(page.getByRole('link', { name: /browse events/i }).first()).toBeVisible();
 
   
    await page.pause();
   


   // await expect(eventApiBookingData.event.title).toBe("Hollywood Monsoon Night — Los Angeles");
    await expect(eventApiBookingData.bookingRef).not.toBe("");
    await expect(eventApiBookingData.quantity).toBe(2);
    console.log("first assertion");
//Look the booking up again by reference through the API and confirm id, reference, ticket quantity, and total match the create response.
      await expect(matchEventApiResponseData.id).toBe(eventApiBookingData.id);
      await expect(matchEventApiResponseData.bookingRef).toBe(eventApiBookingData.bookingRef);
      await expect(matchEventApiResponseData.quantity).toBe(eventApiBookingData.quantity);
      await expect(matchEventApiResponseData.totalPrice).toBe(eventApiBookingData.totalPrice);
//checking matchacrd in UI
await page.getByTestId("nav-bookings").click();
//page.goto("/bookings")
console.log("Current URL:", page.url());
     matchcard= await page.getByTestId("booking-card").filter({ hasText: eventApiBookingData.bookingRef }); 
     await page.pause();
     await expect(matchcard).toBeVisible();
     console.log("matchcard",await matchcard.innerText());
   
    await expect(matchcard.locator("div h3")).toHaveText(eventApiBookingData.event.title);
     const cardTicketText = await matchcard.locator("span").filter({ hasText: " ticket" }).textContent();
    const cardTicketCount = cardTicketText.match(/\d+/)[0];
    await expect(cardTicketCount).toContain(String(eventApiBookingData.quantity));
const cardTotalText=await matchcard.locator("p").nth(0).textContent();
      const cardTotal = cardTotalText.replace(/[^\d]/g, "");
    await expect(cardTotal).toBe(eventApiBookingData.totalPrice);
 //open first booking detail
 //Open View Details from that card and confirm the detail path, breadcrumb/reference, event details, payment summary, and customer email all match the stored API booking data.
    await bookingobjects.openBookingDetailFromCard(page, matchcard);
    const breadcrumb1 = page.locator("div nav");
    await expect(breadcrumb1.locator("span").last()).toHaveText(eventApiBookingData.bookingRef);
    await expect(page.locator("h1")).toHaveText(eventApiBookingData.event.title);

    const email1 = page.locator("div .gap-4").filter({ hasText: "Email" });
    await expect(email1.locator("span").nth(1)).toHaveText(eventApiBookingData.customerEmail);
    const ticketDetails = await page.locator("div .gap-4").filter({ hasText: "Tickets" });
    await expect(ticketDetails.locator("span").nth(1)).toHaveText(String(eventApiBookingData.quantity));
   

    //opensecond  booking detail 2
   

});
