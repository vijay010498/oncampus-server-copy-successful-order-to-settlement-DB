const functions = require('firebase-functions');
const admin = require('firebase-admin');
const ORDERDB = functions.config().database.orderdb;
admin.initializeApp();

//Check order status
exports.copySuccessOrderToSettelementDb = 
functions.database.instance(ORDERDB).ref('/Orders/{orderId}')
        .onWrite(async (change, context) =>{
            const snapshot = change.after;
            const order = snapshot.val();
            const currentStatus = order.orderStatus;
            const ratingValue = order.ratingValue;
            const restaurantId = order.restaurantId;
            console.log('Current Status',currentStatus);

            //Only when order status == 3 (delivered/ pickedup)
            if(currentStatus == 3 && ratingValue == -1){
                const orderId = context.params.orderId;
                console.log('Order',order);

                //Copy order to settelement DB
                const ref = await admin.app().database('https://eatitv2-75508-settlementprocessing.firebaseio.com/')
                            .ref('Orders').child(restaurantId).child(orderId)
                            .set(order).then(() =>{
                                console.log('Order transferred to Settlement DB ');

                            }).catch((error)=>{
                                console.log('Order transferred to Settlement Db Error',error);

                            });
              
            }
            else
                return null;



        });