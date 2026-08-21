const { expect } = require('@playwright/test')


class BookingPage {
    constructor(page) {
        this.page = page;
        this.allEvents = this.page.locator("article");
        //this.booklink = eventFilter.getByTestId("book-now-btn");
        this.addButton = this.page.getByRole("button", { name: "+" });
        this.customerName = this.page.getByPlaceholder("Your full name");
        this.customerEmail = this.page.getByPlaceholder("you@email.com");
        this.phone = this.page.getByPlaceholder("+91 98765 43210");
        this.booking = this.page.getByRole("button", { name: "Confirm Booking" });
        this.searchBar = this.page.getByPlaceholder("Search events, venues…");
        this.selectCategory = this.page.locator("select").first();
        this.selectCity = this.page.locator("select").last();


    }

    async verifyGrandTotal(singlePriceOfTicket) {

        const ticketCount = parseInt(
            await this.page.locator(".ticket-count").textContent()
        );
        console.log(ticketCount);
        const totalTextgrid = this.page.locator(".p-4>div").filter({ hasText: "Total" })
        const totalText = await totalTextgrid.locator("span").nth(1).textContent();
        console.log(totalText);

        const total = Number(totalText.replace(/[^\d]/g, ""));
        const grandTotal = ticketCount * singlePriceOfTicket
        await expect(total).toBe(grandTotal);

    }
    async selectCategoryAndCity(category, city) {
        await this.selectCategory.selectOption(category);
        await this.selectCity.selectOption(city);
    }
    getEventByFilter(searchText) {

        return this.allEvents.filter({ hasText: searchText });
    }
    async createBookingFromFilters(
        searchText, category, city, quantity, customerName, customerEmail, phone ) {


        await this.searchBar.fill(searchText);
        await this.selectCategoryAndCity(category, city);
        await this.page.waitForLoadState("networkidle");

        //wait expect(allEvents.first()).toBeVisible();
        this.eventFilter =  this.getEventByFilter(searchText);
        await expect(eventFilter).toBeVisible();

        this.bookNowButton = this.eventFilter.getByTestId("book-now-btn");
        await expect(this.bookNowButton).toBeVisible();
        console.log(await this.bookNowButton.count());
        await this.bookNowButton.click();

        console.log("URL after click:", this.page.url());
        //await page.pause();
        await expect(this.page.locator("div h1")).toBeVisible();
        //await page.locator("form #ticket-count").fill(quantity.toString());  fill() not work with span
        for (let i = 1; i < quantity; i++) {
            await this.addButton.click();
        }
        await this.customerName.fill(customerName);
        await this.customerEmail.fill(customerEmail);
        //await page.pause();
        await this.phone.fill(phone);

        await this.booking.click();
        console.log("booking confirmed");


        return this.getBookingDetails(customerEmail);
    



        //return eventTittle;

    }
   async  getBookingDetails(customerEmail){
const eventTitle = this.page.locator("div h1");
      const bookingRef = await this.page.locator(".p-4>div")
        .filter({ hasText: "Booking Ref" });
      const  ticketCount = await this.page.locator(".p-4>div")
        .filter({ hasText: "Tickets" });
       const total = await this.page.locator(".p-4>div")
        .filter({ hasText: "Total" });

        return {
            eventTitle: await eventTitle.textContent(),
            bookingRef: await bookingRef.locator("span").nth(1).textContent(),
            ticketCount: await ticketCount.locator("span").nth(1).textContent(),
            total: await total.locator("span").nth(1).textContent(),
            customerEmail:customerEmail
        };

    }
    async navigateEvent() {

        await this.page.getByTestId("nav-events").click();
    }
        

// mock Events By API 
async findMockEventByFilterandCheck(){

      
   await expect(this.page.locator(".text-3xl")).toHaveText("Upcoming Events");
  await this.searchBar.fill("Hyderabad conference");
  await this.selectCategoryAndCity("Conference","Hyderabad");
  await expect(this.allEvents.first()).toBeVisible();
   this.eventFilter = this.getEventByFilter("Tech Innovators Conference 2026");
  console.log(this.eventFilter.textContent());
 this.eventTitle = await this.eventFilter.locator("a[href^='/events/'] h3").textContent();
 this.eventPrice=await this.eventFilter.locator(".pt-3 p").textContent();
 this. eventAvailableSeats= parseInt(await this.eventFilter.locator(".pt-3 span").textContent()).toString();
 
 //await page.pause();
 this.bookNowButton= this.eventFilter.getByTestId("book-now-btn");

 this.href = await this.bookNowButton.getAttribute("href");
 
await expect( this.bookNowButton).toBeVisible();
await  this.bookNowButton.click();;
/*await Promise.all([
  page.waitForURL("**//**"),
   bookNowLink.click()
]);*/
}
async verifyMockedEventBooking(){

     await expect(this.page.locator("h1")).toHaveText( this.eventTitle);

   const eventGrids = this.page.locator(".grid .mb-6 div div");
  const priceOfTickets = await eventGrids.nth(5).textContent();
  //console.log(priceOfTickets);
  await expect(priceOfTickets).toContain(this.eventPrice);
  await expect (await eventGrids.nth(4).locator("span").textContent()).toContain(this.eventAvailableSeats);
const currentPath=await this.page.url();
  await expect(currentPath).toContain(this.href);
     const singlePriceOfTicket=Number(priceOfTickets.replace(/[^\d]/g,""));
     //const bookingpage=new BookingHelper();
      //Confirm ticket quantity starts at 1, total equals the mock price for one ticket, then increase quantity to 2 and confirm the total becomes price × 2.
     const ticketCount=parseInt(await this.page.locator(".ticket-count").textContent());
   
    await  expect(ticketCount).toBe(1);
     await this.verifyGrandTotal(singlePriceOfTicket);

     await expect( this.page.getByRole("button",{name:"+"})).toBeVisible();
    await this.page.getByRole("button",{name:"+"}).click();
     await this.verifyGrandTotal(singlePriceOfTicket);

}
 
    }



module.exports = { BookingPage };

