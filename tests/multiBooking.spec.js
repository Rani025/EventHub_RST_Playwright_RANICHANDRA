const{test,expect}=require('@playwright/test')
import{LoginPage}from '../helper/loginpage'
import{BookingHelper} from '../helper/booking'
const email= "beginner@sample.com";
const password= "Rani@1234" ;

test("Create two bookings and preserve both runtime payloads",async ({page})=>{

    const loginPage = new LoginPage();
    await loginPage.openLoginPage(page);
    await loginPage.login(page,email,password);
const booking = new BookingHelper();
booking.createBookingFromFilters(page,"World","Conference","Hyderabad",1,"Rani","rani@email.com",12345678);

});