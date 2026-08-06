import{test,expect,request}from '@playwright/test';
import { LoginPage } from '../helper/loginpage';
import{BookingHelper} from '../helper/booking';

test("Mocked one Booking and keeping live Bookings",async({page})=>{

const loginpage = new LoginPage();
const bookingObjects=new BookingHelper();
 await loginpage.openLoginPage(page);
  await loginpage.login1(page); 
  let patchedData;
  let patchId;
  let liveBooking;
  //Keep that booking’s original id, but replace its reference code, event title, ticket count, and total amount 
  await page.route("**/api/bookings?page=1&limit=10",async route=>{
     console.log("URL:", route.request().url());
    const response=await page.request.fetch(route.request());
    const body=await response.json();
    console.log("First printing");
    console.log(body.data);
    patchId= body.data[0].id;
    liveBooking=body.data[1];
   
   body.data[0].bookingRef ="A-BCDEFG";
   body.data[0].event.title="The Dubai AI workshop";
   body.data[0].quantity=3;
   body.data[0].totalPrice=1000;
  patchedData=body.data[0];
  console.log("second printinh");
  console.log(patchedData);
  await route.fulfill({

    response,
    body:JSON.stringify(body)
  });

  });
  await page.goto("/bookings");
  await page.waitForResponse("**/api/bookings**");
const mybooking= page.locator("div h1");
await expect(mybooking).toBeVisible();
await expect(mybooking.getByText("My Bookings")).toHaveText("My Bookings");
const patchCards =await bookingObjects.findBookingCardByRef(page,patchedData.bookingRef);
await expect(patchCards.locator("div h3")).toHaveText(patchedData.event.title);
const cardTicketText1=await patchCards.locator("span").filter({hasText:" ticket"}).textContent();
const cardTicketCount1 = cardTicketText1.match(/\d+/)[0];
await expect(cardTicketCount1).toContain(patchedData.quantity.toString());
const expectedPrice = `$${Number(patchedData.totalPrice).toLocaleString()}`;
await expect(patchCards.locator("p").nth(0)).toHaveText(expectedPrice);
const liveCards =await bookingObjects.findBookingCardByRef(page,liveBooking.bookingRef);
expect(liveCards.locator("div h3")).toHaveText(liveBooking.event.title);
await bookingObjects.openBookingDetailFromCard(page,patchCards);
await expect(page.url()).toContain(patchId.toString());
await page.pause();
});