class LoginPage
{

async openLoginPage(page)
{
    const BASE_URL="https://eventhub.rahulshettyacademy.com" ;
 await page.goto(`${BASE_URL}/login`);
 //await page.waitForTimeout(5000);
  //await page.waitForLoadState('networkidle') ;
//await page.pause(); 

}
/*async login(page){

this.openLoginPage(page);

}*/
}
module.exports = { LoginPage } ;