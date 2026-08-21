const {test,expect,request}=require ('@playwright/test')
//import { LoginPage } from '../helper/loginpage';
import mockData from'../test data/mockEventData.json';
//import {BookingHelper} from '../helper/booking'
const {LoginPage}=require('../pageobjects/LoginPage')
const{BookingPage}=require('../pageobjects/BookingPage')
const{EventPage}=require('../pageobjects/EventPage')

test("api mock test",async({page})=>{
  const loginpage = new LoginPage(page);
    const eventPage = new EventPage(page);
    const bookingPage = new BookingPage(page);
   await page.route("**/api/events**",
     async route=>{

     const response=await page.request.fetch(route.request());
     // const body=JSON.stringify(mockData);
      const url = new URL(route.request().url());
      const pathParts = url.pathname.split("/");
    const lastPart = pathParts[pathParts.length - 1];


    // 1. Handle single event detail API
    if (!isNaN(lastPart) && lastPart !== "") {

        const eventId = lastPart;

        const event = mockData.data.find(
            event => event.id.toString() === eventId
        );

        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
                success: true,
                data: event
            })
        });

        return; // very important
    }

    const search =await url.searchParams.get("search");
    const category =await  url.searchParams.get("category");
    const city =await url.searchParams.get("city");
     let body;
     let filteredEvents = mockData.data;


if (search) {
    const searchWords = search
      .toLowerCase()
      .split(" ");

 filteredEvents = filteredEvents.filter(event => {

    const eventText = Object.values(event)
        .join(" ")
        .toLowerCase();

    return searchWords.every(word =>
        eventText.includes(word)
    );

 });
    
}


if (category) {
    filteredEvents =  filteredEvents.filter(event =>
        event.category === category
    );
}


if (city) {
    filteredEvents = filteredEvents.filter(event =>
        event.city === city
    );
}
      await route.fulfill({
         response,
         
        body:JSON.stringify({
          ...mockData,
          data:filteredEvents})
     });
    }
  );
     
  //operations after mocked events   
  await loginpage.openLoginPage();
  await loginpage.login1(); 
   await page.goto("/events");
        await page.waitForResponse("**/api/events**")
     
       await eventPage.checkEventListWithMockEvents(mockData);
       await bookingPage.findMockEventByFilterandCheck()
       await bookingPage.verifyMockedEventBooking()
    

 
     //await page.pause();

});


