const { test, expect } = require('@playwright/test')
import { LoginPage } from '../pageobjects/LoginPage'
import { BookingPage } from '../pageobjects/BookingPage'
const { MyBookingPage } = require('../pageobjects/MyBookingPage')
require('dotenv').config();


const createBookingData = JSON.parse(JSON.stringify(require('../test data/bookingData.json')))
//Json->string->js object
//const loginData = JSON.parse(JSON.stringify(require('../test data/loginTestData.json')));
const bookings = [];
let bookingobjects;
let myBookingPagObject;
let webContext;

test.beforeAll("Create two bookings and preserve both runtime payloads", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    bookingobjects = new BookingPage(page);

    await loginPage.openLoginPage();
   // await loginPage.login(loginData.email, loginData.password);
   await loginPage.login(
    process.env.TEST_EMAIL,
    process.env.TEST_PASSWORD
    );
    await context.storageState({ path: 'storagestate.json' })
    webContext = await browser.newContext({ storageState: 'storagestate.json' });
    await loginPage.browseEvent();

    for (const data of createBookingData) {
        const bookingDetail = await bookingobjects.createBookingFromFilters(
            data.searchText,
            data.category,
            data.city,
            data.quantity,
            data.customerName,
            data.customerEmail,
            data.phone)
        await bookings.push(bookingDetail);

       await  bookingobjects.navigateEvent();
    }

    await expect(bookings[0].eventTitle).toBe("World Tech Summit");
    await expect(bookings[0].bookingRef).not.toBe("");
    await expect(bookings[0].ticketCount).toBe("1");
    console.log("first assertion");
    await expect(bookings[0].bookingRef).not.toBe(bookings[1].bookingRef);
    await expect(bookings[0].eventTitle).not.toBe(bookings[1].eventTitle);
    await expect(bookings[1].ticketCount).toBe("2");
    console.log("second assertion");



});
//booking page to find matchcards
test("Reconcile My Bookings cards with the correct detail pages", async () => {
    const page = await webContext.newPage();
    myBookingPagObject = new MyBookingPage(page);
    await page.goto("/bookings");
    await myBookingPagObject.checkMyBooking();
   
    const matchCards = [];
    //await page.pause();
    console.log("TEST page URL:", page.url());
    console.log("POM page URL:", myBookingPagObject.page.url());
    matchCards.push(await myBookingPagObject.findBookingCardByRef(bookings[0].bookingRef));

    matchCards.push(await myBookingPagObject.findBookingCardByRef(bookings[1].bookingRef));
    await myBookingPagObject.twoBookingComparison(matchCards, bookings);

    //open first booking detail
    await myBookingPagObject.confirmFirstBookingInOpenDetail(matchCards[0], bookings);

    //opensecond  booking detail 2
    await page.goto("/bookings");
    await myBookingPagObject.confirmSecondBookingInOpenDetail(matchCards[1], bookings);



});
