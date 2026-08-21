const { test, expect, request } = require('@playwright/test')
import{LoginPage} from'../pageobjects/LoginPage'
import { MyBookingPage } from '../pageobjects/MyBookingPage'

//const bookingobjects = new BookingHelper();
let apiContext;
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
    apiContext = await request.newContext();
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
    const bookingEventApiResponseJson = await bookingEventApiResponse.json();
    matchEventApiResponseData = bookingEventApiResponseJson.data.find(booking => booking.bookingRef === eventApiBookingData.bookingRef);

    await expect(bookingEventApiResponse.ok()).toBeTruthy();


});

test("Create API bookings ", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.addInitScript(value => {
        window.localStorage.setItem('eventhub_token', value);
    }, token);
    const loginPage=new LoginPage(page);
      await loginPage.getPage();
   const mybookingPageObject=new MyBookingPage(page);
    //await page.pause();
    await expect(eventApiBookingData.bookingRef).not.toBe("");
    await expect(eventApiBookingData.quantity).toBe(2);
    console.log("first assertion");
    //Look the booking up again by reference through the API and confirm id, reference, ticket quantity, and total match the create response.
    await expect(matchEventApiResponseData.id).toBe(eventApiBookingData.id);
    await expect(matchEventApiResponseData.bookingRef).toBe(eventApiBookingData.bookingRef);
    await expect(matchEventApiResponseData.quantity).toBe(eventApiBookingData.quantity);
    await expect(matchEventApiResponseData.totalPrice).toBe(eventApiBookingData.totalPrice);
    //checking matchacrd in UI
    const matchCards = await mybookingPageObject.checkingLiveWithApiEvent(eventApiBookingData);
    await mybookingPageObject.checkAPIBookingInOpenDetail(matchCards,eventApiBookingData);

    // delete booking 

    const deleteBookingResponse = await apiContext.delete(`https://api.eventhub.rahulshettyacademy.com/api/bookings/${eventApiBookingData.id}`,
        {
            headers:
                { 'Authorization': `Bearer ${token}` }

        });
    console.log("deleet status", deleteBookingResponse);

    //checking after deletion 
    const bookingsAfterDeleteResponse = await apiContext.get(
        "https://api.eventhub.rahulshettyacademy.com/api/bookings",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    const bookingsAfterDeleteResponseJson = await bookingsAfterDeleteResponse.json();
    const deletedBooking = bookingsAfterDeleteResponseJson.data.find(
        booking =>
            booking.bookingRef === eventApiBookingData.bookingRef
    );
    await expect(deletedBooking).toBeUndefined();

    await page.goto("https://eventhub.rahulshettyacademy.com/bookings");
    //await page.getByTestId("nav-bookings").click();
    await page.waitForURL("/bookings");
  await mybookingPageObject.checkDeletedBooking(eventApiBookingData.bookingRef);
  
});

test.afterAll(async () => {
    await apiContext.dispose();
});
