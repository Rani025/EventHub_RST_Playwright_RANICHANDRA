class apiUtils
{
async apiDataMock(patchData){
// changing the body.data[0] to new values
   patchData.bookingRef ="A-BCDEFG";
   patchData.event.title="The Dubai AI workshop";
   patchData.quantity=3;
   patchData.totalPrice=1000;
   return patchData;
}

}
module.exports={apiUtils};