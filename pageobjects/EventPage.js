const { expect } = require('@playwright/test')
const { LoginPage } = require('../pageobjects/LoginPage')
class EventPage {


  constructor(page) {
    this.page = page;


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