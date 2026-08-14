class apiUtils
{
async apiDataMock(patchData){

   patchData.bookingRef ="A-BCDEFG";
   patchData.event.title="The Dubai AI workshop";
   patchData.quantity=3;
   patchData.totalPrice=1000;
   return patchData;
}

}
module.exports={apiUtils};