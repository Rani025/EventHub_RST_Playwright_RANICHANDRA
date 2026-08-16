const { test, expect, request } = require('@playwright/test')
import { LoginPage } from '../helper/loginpage'
import { BookingHelper } from '../helper/booking'
const email = "beginner@sample.com";
const password = "Rani@1234";
const bookings = [];
const bookingobjects = new BookingHelper();
let webContext;
const loginPayLoad = {
    email: "beginner@sample.com",
    password: "Rani@1234"
};
let token;
test.beforeAll( async () => {
    const apiContext = await request.newContext();
    const apiResponse = await apiContext.post("https://api.eventhub.rahulshettyacademy.com/api/auth/login",
        {
            data: loginPayLoad

        })
        await expect(apiResponse.ok()).toBeTruthy();

    const apiResponseJson = await apiResponse.json();
    token = apiResponseJson.token;
    console.log(token);


});

test("Create API bookings ", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    // const loginPage = new LoginPage();
    //await loginPage.openLoginPage(page);
    // await loginPage.login(page,email,password);
    // await context.storageState({path:'storagestate.json'})
    //webContext=await browser.newContext({storageState:'storagestate.json'});
    await page.addInitScript(value => {
        window.localStorage.setItem('eventhub_token', value);
    }, token);
   await page.goto("https://eventhub.rahulshettyacademy.com");
   //
https://api.eventhub.rahulshettyacademy.com/api/bookings
/*{
    "customerName": "RANI",
    "customerEmail": "rani@gmail.com",
    "customerPhone": "1234567890",
    "quantity": 2,
    "eventId": 2
}*/

    await expect(page.getByRole('link', { name: /browse events/i }).first()).toBeVisible();
    await page.getByRole('link', { name: /browse events/i }).first().click();
    //booking

    const bookingOne = await bookingobjects.createBookingFromFilters(page,
        {
            searchText: "World",
            category: "Conference",
            city: "Hyderabad",
            quantity: 2,
            customerName: "Rani",
            customerEmail: "rani@email.com",
            phone: "1234567890"
        });
    await bookings.push(bookingOne);
    // await page.pause();
    await page.getByTestId("nav-events").click();


    await expect(bookingOne.eventTitle).toBe("World Tech Summit");
    await expect(bookingOne.bookingRef).not.toBe("");
    await expect(bookingOne.ticketCount).toBe("2");
    console.log("first assertion");

});
//booking page to find matchcards
/*test("Reconcile My Bookings cards with the correct detail pages", async () => {
    const page = await webContext.newPage();
    await page.goto("/bookings");
    const mybooking = page.locator("div h1");
    await expect(mybooking).toBeVisible();
    await expect(mybooking.getByText("My Bookings")).toHaveText("My Bookings");
    const matchCards = [];
    matchCards.push(await bookingobjects.findBookingCardByRef(page, bookings[0].bookingRef));
    matchCards.push(await bookingobjects.findBookingCardByRef(page, bookings[1].bookingRef));

    await expect(matchCards[0]).toBeVisible();
    await expect(matchCards[1]).toBeVisible();
    await expect(matchCards[0].getByText("confirmed")).toHaveText("confirmed")
    await expect(matchCards[1].getByText("confirmed")).toHaveText("confirmed")

    await expect(matchCards[0].locator("div h3")).toHaveText(bookings[0].eventTitle);
    const cardTicketText1 = await matchCards[0].locator("span").filter({ hasText: " ticket" }).textContent();
    const cardTicketCount1 = cardTicketText1.match(/\d+/)[0];
    await expect(cardTicketCount1).toContain(bookings[0].ticketCount);
    await expect(matchCards[0].locator("p").nth(0)).toHaveText(bookings[0].total);
    //second matched card
    await expect(matchCards[1].locator("div h3")).toHaveText(bookings[1].eventTitle);
    const cardTicketText2 = await matchCards[1].locator("span").filter({ hasText: " ticket" }).textContent();
    const cardTicketCount2 = cardTicketText2.match(/\d+/)[0];
    await expect(cardTicketCount2).toContain(bookings[1].ticketCount);
    await expect(matchCards[1].locator("p").nth(0)).toHaveText(bookings[1].total);
    await expect(await matchCards[0].locator(".booking-ref").textContent()).not.toBe(await matchCards[1].locator(".booking-ref").textContent());
    const eventTitle1 = await matchCards[0].locator("div h3").textContent();
    const eventTitle2 = await matchCards[1].locator("div h3").textContent();

    //open first booking detail
    await bookingobjects.openBookingDetailFromCard(page, matchCards[0]);
    const breadcrumb1 = page.locator("div nav");
    await expect(breadcrumb1.locator("span").last()).toHaveText(bookings[0].bookingRef);
    await expect(page.locator("h1")).toHaveText(eventTitle1);

    const email1 = page.locator("div .gap-4").filter({ hasText: "Email" });
    await expect(email1.locator("span").nth(1)).toHaveText(bookings[0].customerEmail);
    const ticketDetails1 = await page.locator("div .gap-4").filter({ hasText: "Tickets" });
    await expect(ticketDetails1.locator("span").nth(1)).toHaveText(cardTicketCount1);
    const bookingId = await page.locator("div .gap-4").filter({ hasText: "Booking ID" });
    await expect(bookingId.locator("span").nth(1)).toHaveText(/^#\d+$/);

    //opensecond  booking detail 2
    await page.goto("/bookings");
    await bookingobjects.openBookingDetailFromCard(page, matchCards[1]);
    const breadcrumb2 = page.locator("div nav");
    await expect(breadcrumb2.locator("span").nth(1)).toHaveText(bookings[1].bookingRef);
    await expect(page.locator("h1")).toHaveText(eventTitle2);
    const ticketDetails2 = await page.locator("div .gap-4").filter({ hasText: "Tickets" });
    await expect(ticketDetails1.locator("span").nth(1)).toHaveText(cardTicketCount2);
    await expect(breadcrumb2.locator("span").nth(1)).not.toHaveText(bookings[0].bookingRef);


});
*/