const { expect } = require('@playwright/test')
const { LoginPage } = require('../pageobjects/LoginPage')
class EventPage {


  constructor(page) {
    this.page = page;
    this.EventSearch = this.page.getByPlaceholder("Search events, venues…");
    this.Categiry = this.page.locator("select").first();
    this.city = this.page.locator("select").last();
    this.allEvents = this.page.locator("article");
  }

  async unFilteredComparisonOfEvents() {
    await this.page.goto("/events");
    await this.EventSearch.clear();
    await this.Categiry.selectOption("");
    await this.city.selectOption("");
    //await page.pause();
    //const allEvents1 = await loginpage.getEventCards();
    await expect(this.allEvents.last()).toBeVisible();
    const count = await this.allEvents.count()
    await expect(count).toBeGreaterThanOrEqual(3);
    console.log(count);
    //a[href^='/events/'] h3
    const eventTittles = this.allEvents.locator("h3");
    const firstTittle = await eventTittles.first().textContent();
    console.log(firstTittle);
    const lastTittle = await eventTittles.last().textContent();
    const secondTittle = await eventTittles.nth(1).textContent();
    console.log(lastTittle);
    console.log(secondTittle);
    const allTittles = await eventTittles.allTextContents();
    await expect(allTittles).not.toBe("");
    await expect(firstTittle).not.toBe(lastTittle);
  }
  async checkEventListWithMockEvents(mockData) {

    await expect(this.page.locator(".text-3xl")).toHaveText("Upcoming Events");
    const loginpage = new LoginPage(this.page);
    this.allEvents = await loginpage.getEventCards();

    await expect(this.allEvents.first()).toBeVisible();
    const eventCount = await this.allEvents.count();
    await expect(eventCount).toBe(4);
    for (let i = 0; i < 4; i++) {

      await expect(this.allEvents.nth(i)).toBeVisible();
      // await page.pause();
    }
    await expect(this.allEvents).not.toContainText(["World Tech Summit"])
    for (let i = 0; i < mockData.data.length; i++) {
      await expect(this.allEvents.nth(i).locator("a[href^='/events/'] h3")).toContainText(mockData.data[i].title);
      await expect(this.allEvents.nth(i).locator(".pt-3 span")).toContainText(mockData.data[i].availableSeats.toString());//convert number to string
      await expect(this.allEvents.nth(i).locator(".pt-3 p")).toContainText(`$${Number(mockData.data[i].price).toLocaleString()}`);
      await expect(this.allEvents.nth(i).locator("#book-now-btn")).toHaveAttribute("href", `/events/${mockData.data[i].id}`);

    }
  }

}



module.exports = { EventPage };