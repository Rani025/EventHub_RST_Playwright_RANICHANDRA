import { expect } from "@playwright/test";
class LoginPage
{
constructor(page){
   this.page=page;
   this.signInText=this.page.locator(".text-xl");
    this.emailField =
        this.page.getByPlaceholder("you@email.com");

    this.passwordField =
        this.page.getByLabel("Password");

    this.signInButton =
        this.page.getByRole("button", { name: "Sign In" });

    this.browseEventsLink =
        this.page.getByRole("link", {
            name: /browse events/i
        }).first();

    this.eventCards =
       this.page.locator("article");


}
async assertingLoginPage(){

    await expect(this.emailField ).toBeVisible();

 await expect(this.signInButton).toHaveText("Sign In");
}
async secondAssertionLogin(){

    await expect(this.passwordField ).toBeVisible();
    await  expect(this.page).toHaveURL(/.*\/login/);
    await expect(this.signInText).toHaveText("Sign in to EventHub");
}
async isolatedPageChecking(){
    await expect(this.signInText).toHaveText("Sign in to EventHub");
await expect(this.emailField).toHaveValue("");
}
async openLoginPage()
{
    const BASE_URL="https://eventhub.rahulshettyacademy.com" ;
 await this.page.goto(`${BASE_URL}/login`,
     {waitUntill: "domcontentloaded"});
 }
 async opneLoginByConfiguredURL(){
     await this.page.goto('/login');
      await expect(this.page).toHaveTitle(/EventHub/i);
 }
 async getEmailField()
 {
await this.emailField.fill("beginner@sample.com");
await expect(this.emailField).toHaveValue("beginner@sample.com");
 // return  this.emailField;
 }
 async login1(){

    await this.emailField.fill("beginner@sample.com");
    await this.passwordField.fill("Rani@1234");
    await this.signInButton.click();
    await expect(this.browseEventsLink).toBeVisible();
    
 }

 async login(emailId,password){

    await this.emailField.fill(emailId);
    await this.passwordField.fill(password);
    await this.signInButton.click();
    await expect(this.browseEventsLink).toBeVisible();
 }
 async getPage(){
      await this.page.goto("https://eventhub.rahulshettyacademy.com");
    
         await expect(this.browseEventsLink).toBeVisible();
 }
 async browseEvent(){

   await this.browseEventsLink.click();

 }
  getEventCards()
 {
    //Step 3 — Work with multiple matching event cards

return this.eventCards;
 }
  parseSeatCount(eventSeats)
 {
 return parseInt(eventSeats,10);
    


 }
}
module.exports = { LoginPage } ;