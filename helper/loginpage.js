class LoginPage
{

async openLoginPage(page)
{
    const BASE_URL="https://eventhub.rahulshettyacademy.com" ;
 await page.goto(BASE_URL);
 //await page.waitForTimeout(5000);
  //await page.waitForLoadState('networkidle') ;
//await page.pause(); 

}
}
module.exports = { LoginPage } ;