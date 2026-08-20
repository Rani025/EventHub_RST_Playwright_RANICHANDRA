
const{test,expect}=require('@playwright/test')
import{LoginPage}from '../pageobjects/LoginPage'
import{BookingPage} from '../pageobjects/BookingPage'
const {MyBookingPage}=require('../pageobjects/MyBookingPage')
const email= "beginner@sample.com";
const password= "Rani@1234" ;
const bookings=[];
let bookingobjects ;
 let myBookingPagObject ;
let webContext;

test.beforeAll("Create two bookings and preserve both runtime payloads",async ({browser})=>{
const context=await browser.newContext();
const page=await context.newPage();
    const loginPage = new LoginPage(page);
    bookingobjects = new BookingPage(page);
   
    await loginPage.openLoginPage();
    await loginPage.login(email,password);
    await context.storageState({path:'storagestate.json'})
    webContext=await browser.newContext({storageState:'storagestate.json'});
await loginPage.browseEvent();



const bookingOne= await bookingobjects.createBookingFromFilters(
    {searchText: "World",
    category: "Conference",
    city: "Hyderabad",
    quantity: 1,
    customerName: "Rani",
    customerEmail: "rani@email.com",
    phone: "1234567890"});
    await bookings.push(bookingOne);
   // await page.pause();
   bookingobjects.navigateEvent();
    const bookingTwo=await bookingobjects.createBookingFromFilters( 
        {   searchText: "Dilli",
            category: "Festival",
            city: "Delhi",
            quantity: 2, 
            customerName: "Rani",
            customerEmail: "rani@email.com",
            phone: "1234567890" })
    await bookings.push(bookingTwo);
    
    await expect(bookings[0].eventTitle).toBe("World Tech Summit");
        await expect(bookings[0].bookingRef).not.toBe("");
        await expect(bookings[0].ticketCount).toBe("1");
        console.log("first assertion");
        await expect(bookings[0].bookingRef).not.toBe(bookings[1].bookingRef);
        await expect(bookings[0].eventTitle).not.toBe(bookings[1].eventTitle);
        await expect(bookings[1].ticketCount).toBe("2");
        console.log("second assertion");

  
   
        });
//booking page to find matchcards
test("Reconcile My Bookings cards with the correct detail pages",async()=>{
const page=await webContext.newPage();
 myBookingPagObject = new MyBookingPage(page);
await page.goto("/bookings");
const mybooking= page.locator("div h1");
await expect(mybooking).toBeVisible();
await expect(mybooking.getByText("My Bookings")).toHaveText("My Bookings");
const matchCards =[];
await page.pause();
console.log("TEST page URL:", page.url());
console.log("POM page URL:", myBookingPagObject.page.url());
 matchCards.push(await myBookingPagObject.findBookingCardByRef(bookings[0].bookingRef));

 matchCards.push(await myBookingPagObject.findBookingCardByRef(bookings[1].bookingRef));
 await myBookingPagObject.twoBookingComparison(matchCards,bookings);

 
//open first booking detail
//await myBookingPagObject.openBookingDetailFromCard(matchCards[0]);
await myBookingPagObject.confirmFirstBookingInOpenDetail(matchCards[0],bookings);


 //opensecond  booking detail 2
 await page.goto("/bookings");
 //await myBookingPagObject.openBookingDetailFromCard();
 await myBookingPagObject.confirmSecondBookingInOpenDetail(matchCards[1],bookings);



});