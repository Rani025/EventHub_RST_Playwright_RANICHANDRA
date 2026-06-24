class LoginPage
{

async openLoginPage(page)
{
    const BASE_URL="https://eventhub.rahulshettyacademy.com" ;
 await page.goto(`${BASE_URL}/login`);
 }
 getEmailField(page)
 {

  return  page.getByPlaceholder("you@email.com");
 }
}
module.exports = { LoginPage } ;