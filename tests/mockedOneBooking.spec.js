import { test, expect, request } from '@playwright/test';
import { LoginPage } from '../helper/loginpage';
import { BookingHelper } from '../helper/booking';
import { apiUtils } from '../utils/apiUtils';
const apiObject = new apiUtils();
test("Mocked one Booking and keeping live Bookings", async ({ page }) => 
  {

  const loginpage = new LoginPage();
  const bookingObjects = new BookingHelper();
  await loginpage.openLoginPage(page);
  await loginpage.login1(page);
  let patchedData;
  let patchId;
  let liveBooking;
  let orginalEmail;
  let patchCards;
 
  //Keep that booking’s original id, but replace its reference code, event title, ticket count, and total amount 
  await page.route("**/api/bookings?page=1&limit=10", async route => {
    // console.log("URL:", route.request().url());
   const response = await page.request.fetch(route.request());
    const body = await response.json();

    patchId = body.data[0].id;
    liveBooking = body.data[1];
    orginalEmail = body.data[0].customerEmail;
    patchedData = await apiObject.apiDataMock(body.data[0]);
    await route.fulfill({

      response,
      body: JSON.stringify(body)
    });
  });
  await page.goto("/bookings");
  await page.waitForResponse("**/api/bookings**");
  const mybooking = page.locator("div h1");
  await expect(mybooking).toBeVisible();
  await expect(mybooking.getByText("My Bookings")).toHaveText("My Bookings");
  patchCards = await bookingObjects.findBookingCardByRef(page, patchedData.bookingRef);
  await expect(patchCards.locator("div h3")).toHaveText(patchedData.event.title);
  const cardTicketText = await patchCards.locator("span").filter({ hasText: " ticket" }).textContent();
  const cardTicketCount = cardTicketText.match(/\d+/)[0];
  await expect(cardTicketCount).toContain(patchedData.quantity.toString());
  const expectedPatchedPrice = `$${Number(patchedData.totalPrice).toLocaleString()}`;
  await expect(patchCards.locator("p").nth(0)).toHaveText(expectedPatchedPrice);
  const liveCards = await bookingObjects.findBookingCardByRef(page, liveBooking.bookingRef);
  expect(liveCards.locator("div h3")).toHaveText(liveBooking.event.title);
 // await page.pause();
  await page.route("https://api.eventhub.rahulshettyacademy.com/api/bookings/**", async route => {
       const response = await page.request.fetch(route.request());
      const body = await response.json();
       const detailId = await route.request().url().split("/").pop();
    if (detailId == patchId.toString()) {
      //console.log("URL:", route.request().url());
   
      //console.log("orginal body in detail page");
      // console.log(body);
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
    await bookingObjects.openBookingDetailFromCard(page, patchCards);
    await page.waitForResponse("https://api.eventhub.rahulshettyacademy.com/api/bookings**");
    await expect(page.url()).toContain(patchId.toString());


    //Confirm the detail page breadcrumb/reference, title, payment summary tickets,
    // and total paid match the patched values, and the customer email still matches the original live value.
    const breadcrumb = page.locator("div nav");
    await expect(breadcrumb.locator("span").last()).toHaveText(patchedData.bookingRef);
    await expect(page.locator("h1")).toHaveText(patchedData.event.title);
    const ticketDetails = await page.locator("div .gap-4").filter({ hasText: "Tickets" });
    await expect(ticketDetails.locator("span").nth(1)).toHaveText(patchedData.quantity.toString());
    const totalPayment = await page.locator("div .flex").filter({ hasText: "Total Paid" });
    await expect(totalPayment.locator("span").nth(1)).toHaveText(expectedPatchedPrice);
    const email1 = page.locator("div .gap-4").filter({ hasText: "Email" });
    await expect(email1.locator("span").nth(1)).toHaveText(orginalEmail);
    await expect(page.getByText("rani@email.com")).toBeVisible();
    const totalDetailPrice = totalPayment.locator("span").nth(1);
    const totalDetailPriceValue=await totalDetailPrice.textContent();

     await page.goto("/bookings");
    await page.waitForURL("/bookings");
    
    
    const bookingPriceTotal = patchCards.locator("p").nth(0);
      await expect(bookingPriceTotal).toHaveText(totalDetailPriceValue);

    //await page.pause();
 
  });
  