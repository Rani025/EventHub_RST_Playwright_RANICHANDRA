import { test, expect, request } from '@playwright/test';
const { LoginPage } = require('../pageobjects/LoginPage')
const { BookingPage } = require('../pageobjects/BookingPage')
const { MyBookingPage } = require('../pageobjects/MyBookingPage')
const { EventPage } = require('../pageobjects/EventPage')
import { apiUtils } from '../utils/apiUtils';
const apiObject = new apiUtils();
test("Mocked one Booking and keeping live Bookings", async ({ page }) => {

  const loginpage = new LoginPage(page);
  const bookingObjects = new BookingPage(page);
  const myBookingPage = new MyBookingPage(page);
  await loginpage.openLoginPage();
  await loginpage.login1();
  let patchedData;
  let patchId;
  let liveBooking;
  let orginalEmail;
  let patchCards;
//"**/api/bookings?page=1&limit=10"
  //Keep that booking’s original id, but replace its reference code, event title, ticket count, and total amount 
  await page.route("**/api/bookings**", async route => {
    // console.log("URL:", route.request().url());
    const response = await page.request.fetch(route.request());
    const body = await response.json();

    patchId = body.data[0].id;
    liveBooking = body.data[1];
    orginalEmail = body.data[0].customerEmail;
    patchedData = await apiObject.apiDataMock(body.data[0]);
    body.data[0] = patchedData;
    await route.fulfill({

      response,
      body: JSON.stringify(body)
    });
  });
  await page.goto("/bookings");

  await page.waitForResponse("**/api/bookings**");
  console.log("PATCHED:", patchedData);
console.log("LIVE:", liveBooking);

  await myBookingPage.checkMyBooking();
  const expectedPatchedPrice = `$${Number(patchedData.totalPrice).toLocaleString()}`;

  const patchCard = await myBookingPage.findBookingCardByRef(patchedData.bookingRef);

  await myBookingPage.patchedCardVerify(patchCard, patchedData);

  const liveCards = await myBookingPage.findBookingCardByRef(liveBooking.bookingRef);
  await myBookingPage.verifyLiveEventInPatchedApi(liveCards, liveBooking);
  // await page.pause();
  //checkinh pach data in opendetail
  await page.route("https://api.eventhub.rahulshettyacademy.com/api/bookings/**", async route => {
    const response = await page.request.fetch(route.request());
    const body = await response.json();
    const detailId = await route.request().url().split("/").pop();
    if (detailId == patchId.toString()) {

      const detailPatchBooking = await apiObject.apiDataMock(body.data);
      await route.fulfill({

        response,
        body: JSON.stringify
          ({
            ...body,
            data: detailPatchBooking
          })
      });

    }
    else {
      await route.fulfill({

        response,
        body: JSON.stringify({
          ...body,
          data: body.data

        })

      });
    }
  });
  //Confirm the detail page breadcrumb/reference, title, payment summary tickets,
  // and total paid match the patched values, and the customer email still matches the original live value.
 await myBookingPage.checkAPIBookingInOpenDetail(patchCard, patchedData);
  await expect(page.url()).toContain(patchId.toString());

  await myBookingPage.confirmTotalByRefindPatchCard(expectedPatchedPrice,patchCard);
  
  //await page.pause();

});
