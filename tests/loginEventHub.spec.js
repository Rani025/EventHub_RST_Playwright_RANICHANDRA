const { test, expect } = require('@playwright/test')
const { LoginPage } = require("../pageobjects/LoginPage");
const { BookingPage } = require("../pageobjects/BookingPage");
const { EventPage } = require("../pageobjects/EventPage")
require('dotenv').config();
const data = JSON.parse(JSON.stringify(require('../test data/bookingData.json')));

test("eventHub login", async ({ page }) => {
  const loginpage = new LoginPage(page);
  const bookingPage = new BookingPage(page);
  const eventpage = new EventPage(page);
  await loginpage.openLoginPage();
  await loginpage.login(process.env.TEST_EMAIL,
    process.env.TEST_PASSWORD);
  await loginpage.browseEvent();

  await bookingPage.seachAndFilterEvents(data[0].searchText, data[0].category, data[0].city);

  // const cityDrpodown = page.locator("select").last();
  // await expect(cityDrpodown).toHaveValue("Hyderabad");

  //Test 2 — Practice nth, first, and last on the event list

  await eventpage.unFilteredComparisonOfEvents();

});

