import{test,expect } from '@playwright/test'
import{LoginPage} from'../helper/loginpage'

class BookingHelper{

    async verifyGrandTotal(page,singlePriceOfTicket){

const ticketCount=parseInt(await page.locator(".ticket-count").textContent());
console.log(ticketCount);
   const totalTextgrid=  page.locator(".p-4>div").filter({hasText:"Total"})
   const totalText= await totalTextgrid.locator("span").nth(1).textContent();
   console.log(totalText);

   const total = Number(totalText.replace(/[^\d]/g, ""));
    const grandTotal=ticketCount*singlePriceOfTicket
    expect(total).toBe(grandTotal);

    }
    async  createBookingFromFilters(page,{
         searchText, category,city, quantity,customerName, customerEmail, phone} )
         {
            
await page.getByPlaceholder("Search events, venues…").fill(searchText);
await page.locator("select").first().selectOption(category);
await page.locator("select").last().selectOption(city);
await page.waitForLoadState("networkidle");
const allEvents=page.locator("article");
//wait expect(allEvents.first()).toBeVisible();
const eventFilter=allEvents.filter({hasText: searchText});
await expect(eventFilter).toBeVisible();
const booklink=eventFilter.getByTestId("book-now-btn");

await expect(booklink).toBeVisible();
console.log(await booklink.count());
await Promise.all([
  page.waitForURL("**/events/**"),
   booklink.click()
]);

console.log("URL after click:", page.url());
//await page.pause();
await expect(page.locator("div h1")).toBeVisible();
//await page.locator("form #ticket-count").fill(quantity.toString());  fill() not work with span
for(let i=1;i<quantity;i++){
await page.getByRole("button",{name:"+"}).click();
}
await page.getByPlaceholder("Your full name").fill(customerName);
await page.getByPlaceholder("you@email.com").fill(customerEmail);
//await page.pause();
await page.getByPlaceholder("+91 98765 43210").fill(phone);

await page.getByRole("button",{name:"Confirm Booking"}).click();
console.log("booking confirmed");
const eventTitle=page.locator("div h1");
const bookingRef= await page.locator(".p-4>div").filter({hasText:"Booking Ref"});
const ticketCount= await page.locator(".p-4>div").filter({hasText:"Tickets"});
const total= await page.locator(".p-4>div").filter({hasText:"Total"});
 return{
    eventTitle: await eventTitle.textContent(),
    bookingRef: await bookingRef.locator("span").nth(1).textContent(),
    ticketCount: await ticketCount.locator("span").nth(1).textContent(),
    total: await total.locator("span").nth(1).textContent(),
    customerEmail: customerEmail
};



//return eventTittle;

         }
async findBookingCardByRef(page, bookingRef){

    const matchingcard=await  page.getByTestId("booking-card").filter({hasText:bookingRef});
    await expect(matchingcard).toBeVisible();
    return matchingcard;
}
async openBookingDetailFromCard(page,matchCard)
{
     await matchCard.getByRole("button",{name:"View Details"}).click();
      await page.waitForURL("**/bookings/**");

  
}


}
module.exports = { BookingHelper };

