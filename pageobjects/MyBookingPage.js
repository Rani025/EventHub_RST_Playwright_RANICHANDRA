const { test, expect } = require('@playwright/test')

class MyBookingPage {

    constructor(page) {

        this.page = page;
        this.mybooking = this.page.locator("div h1");
        this.bookingCard = this.page.getByTestId("booking-card");
        this.breadcrumb1 = this.page.locator("div nav");

        this.pageTitle = this.page.locator("h1");
        this.emailDetails = this.page.locator("div .gap-4")
            .filter({ hasText: "Email" });

        this.ticketDetails = this.page.locator("div .gap-4")
            .filter({ hasText: "Tickets" });

        this.bookingIdDetails = this.page.locator("div .gap-4")
            .filter({ hasText: "Booking ID" });

    }

    async getBookingCard(bookingRef) {
        return await this.bookingCard.filter({ hasText: bookingRef });

    }
    getTicketText(matchcard) {

        return matchcard.locator("span").filter({ hasText: " ticket" }).textContent();
    }
    async getTicketCount(matchCard) {

        const cardTicketText = await this.getTicketText(matchCard);
        const cardTicketCount = cardTicketText.match(/\d+/)[0];
        return cardTicketCount;
    }
    getTotal(card) {
        return card.locator("p").nth(0);
    }
    getBookingRef(card) {
        return card.locator(".booking-ref").textContent();
    }
    getEventTitle(card) {

        return card.locator("div h3").textContent();
    }
    getBookingRefFromBreadCrum() {
        return this.breadcrumb1.locator("span").last();

    }
    async checkMyBooking() {

        await expect(this.mybooking).toBeVisible();
        await expect(this.mybooking.getByText("My Bookings")).toHaveText("My Bookings");
    }
    async findBookingCardByRef(bookingRef) {

        console.log(bookingRef);
        console.log(await this.page.url());
        console.log(await this.bookingCard.count());

        await expect(this.bookingCard.first()).toBeVisible();
        const matchingcard = await this.getBookingCard(bookingRef);
        await expect(matchingcard).toBeVisible();
        return matchingcard;
    }
    async twoBookingComparison(matchCards, bookings) {

        await expect(matchCards[0]).toBeVisible();
        await expect(matchCards[1]).toBeVisible();
        await expect(matchCards[0].getByText("confirmed")).toHaveText("confirmed")
        await expect(matchCards[1].getByText("confirmed")).toHaveText("confirmed")
        this.eventTitle1 = await this.getEventTitle(matchCards[0]);
        await expect(this.eventTitle1).toBe(bookings[0].eventTitle);

        this.cardTicketCount1 = await this.getTicketCount(matchCards[0]);
        await expect(this.cardTicketCount1).toContain(bookings[0].ticketCount);

        await expect(this.getTotal(matchCards[0])).toHaveText(bookings[0].total);
        //second matched card
        this.eventTitle2 = await this.getEventTitle(matchCards[1]);
        await expect(this.eventTitle2).toBe(bookings[1].eventTitle);
        this.cardTicketCount2 = await this.getTicketCount(matchCards[1]);
        await expect(this.cardTicketCount2).toContain(bookings[1].ticketCount);
        await expect(this.getTotal(matchCards[1])).toHaveText(bookings[1].total);
        this.bookingRef1 = await this.getBookingRef(matchCards[0]);
        this.bookingRef2 = await this.getBookingRef(matchCards[1]);
        await expect(this.bookingRef1).not.toBe(this.bookingRef2);
    }
    async checkingLiveWithApiEvent(eventApiBookingData) {
        await this.page.goto("/bookings");
        const matchCard = await this.findBookingCardByRef(eventApiBookingData.bookingRef);
        await expect(await this.getEventTitle(matchCard)).toBe(eventApiBookingData.event.title);
        await expect(await this.getTicketCount(matchCard)).toContain(String(eventApiBookingData.quantity));
        await expect(this.getTotal(matchCard)).toHaveText(`$${Number(eventApiBookingData.totalPrice).toLocaleString("en-US")}`);
        return matchCard;

    }

    async openBookingDetailFromCard(matchCard) {
        await matchCard.getByRole("button", { name: "View Details" }).click();
        await this.page.waitForURL("**/bookings/**");


    }
    async checkAPIBookingInOpenDetail(matchCards,eventApiBookingData){

         await this.openBookingDetailFromCard(matchCards);
        await expect(this.getBookingRefFromBreadCrum()).toHaveText(eventApiBookingData.bookingRef);
        await expect(this.pageTitle).toHaveText(eventApiBookingData.event.title);
        await expect(this.emailDetails.locator("span").nth(1)).toHaveText(eventApiBookingData.customerEmail);
        await expect(this.ticketDetails.locator("span").nth(1)).toHaveText(String(eventApiBookingData.quantity));
        
    }
   async  checkDeletedBooking(bookingRef){

          const deletedBookingCard =this.bookingCard
        .filter({
            hasText: bookingRef
        });
    await expect(deletedBookingCard).not.toBeVisible();
    }

    async confirmFirstBookingInOpenDetail(matchcard, bookings) {

        await this.openBookingDetailFromCard(matchcard);
        await expect(this.getBookingRefFromBreadCrum()).toHaveText(bookings[0].bookingRef);
        await expect(this.pageTitle).toHaveText(bookings[0].eventTitle);
        await expect(this.emailDetails.locator("span").nth(1)).toHaveText(bookings[0].customerEmail);
        await expect(this.ticketDetails.locator("span").nth(1)).toHaveText(bookings[0].ticketCount);
        await expect(this.bookingIdDetails.locator("span").nth(1)).toHaveText(/^#\d+$/);


    }
    async confirmSecondBookingInOpenDetail(matchcard, bookings) {


        await this.openBookingDetailFromCard(matchcard);
        await expect(this.getBookingRefFromBreadCrum()).toHaveText(bookings[1].bookingRef);
        await expect(this.pageTitle).toHaveText(bookings[1].eventTitle);
        await expect(this.ticketDetails.locator("span").nth(1)).toHaveText(bookings[1].ticketCount);
        await expect(this.getBookingRefFromBreadCrum()).not.toHaveText(bookings[0].bookingRef);

    }



}
module.exports = { MyBookingPage };
