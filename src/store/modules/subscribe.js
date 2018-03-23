import Vue from 'vue'

const state = {
    productValue: undefined,
    productValueDiscount:undefined,
    assign: undefined,
    selectedProduct: undefined,
    createOrder: undefined,
    singleProduct: undefined,
    createHashD: undefined,
    singleProductPaymentD: undefined,
    createHash: undefined,
    singleProductPayment: undefined,
    paymentResponse: undefined,
    banklist: undefined,
    paytmHash: undefined,
    paymentConformation :undefined,

};

const getters = {
    productValue: (state) => {
        return state.productValue;
    },
    selectedProduct: (state) => {
        return state.selectedProduct;
    },
    createOrder: (state) => {
        return state.createOrder;
    },
    singleProduct: (state) => {
        return state.singleProduct;
    },
    createHashD: (state) => {
        return state.createHashD;
    },
    singleProductPaymentD: (state) => {
        return state.singleProductPaymentD;
    },
    createHash: (state) => {
        return state.createHash;
    },
    singleProductPayment: (state) => {
        return state.singleProductPayment;
    },
    paymentResponse: (state) => {
        return state.paymentResponse;
    },
    banklist: (state) => {
        return state.banklist;
    },
    paytmHash: (state) => {
        return state.paytmHash;
    },
    paymentConformation: (state) => {
        return state.paymentConformation;
    }

};

const mutations = {
    setProductValue: (state, products) => {
        state.productValue = products;
    },
    setSelectedProduct: (state, product) => {
        state.selectedProduct = product;
    },
    setCreateOrder: (state, order) => {
        state.createOrder = order;
    },
    setSingleProduct: (state, singleProductValue) => {
        state.singleProduct = singleProductValue;
    },
    setCreateHashD: (state, hash) => {
        state.createHashD = hash;
    },
    setSingleProductPaymentD: (state, product) => {
        state.singleProductPaymentD = product;
    },
    setCreateHash: (state, hash) => {
        state.createHash = hash;
    },
    setSingleProductPayment: (state, product) => {
        state.singleProductPayment = product;
    },
    setProductResponse: (state, response) => {
        state.paymentResponse = response;
    },
    setBankList: (state, banks) => {
        state.banklist=banks;
    },
    setPaytmHas: (state, paytmH) => {
        state.paytmHash=paytmH;
    },
    setPaymentConformation :(state,paymentConformationStatus) => {
        state.paymentConformation=paymentConformationStatus;
    },
};

const actions = {
    actGetPlanProducts: (context) => {
        // console.log(JSON.parse(localStorage.getItem('altAccount')).profile.username);

        var baseUrl = context.getters.baseUrl;

        // console.log('[subscriber.js | actGetPlanProducts | baseUrl | ]', baseUrl);

        var homeDomain = undefined;
        if (localStorage.getItem('homeDomain')) {
            homeDomain = localStorage.getItem('homeDomain');
        }

        var paymentPayUrl=localStorage.getItem('paymentProxyURL');
        return new Promise((resolve, reject) => {
            if (!homeDomain) {
                reject({ error: true, message: 'domain data not found' });
            }

            Vue.http.get(paymentPayUrl + 'products', {
                params: {
                    domain: homeDomain,
                    promotion: true
                },
            }).then(
                (response) => {
                    // console.log('[subscriber.js | actGetPlanProducts | response | ]', response);

                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject('[actGetSections response] Error');
                    }
                },
                (error) => {
                    reject(error.body);
                }
            )
        });

    },


    actCreateOrder: (context,data) => {
        var baseUrl = context.getters.baseUrl;

        var homeDomain = undefined;
        if (localStorage.getItem('homeDomain')) {
            homeDomain = localStorage.getItem('homeDomain');
        }

        var user = JSON.parse(localStorage.getItem('altUser'));
        var paymentPayUrl=localStorage.getItem('paymentProxyURL');
        return new Promise((resolve, reject) => {
            if (!homeDomain) {
                reject({ error: true, message: 'domain data not found' });
            }

            Vue.http.post(paymentPayUrl + 'accounts/orders',data,{
                params: {
                    domain: homeDomain,
                },
                headers: {
                    XSSESSION: user.sessionToken
                },
            }).then(
                (response) => {

                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject({ code: response.status, message: 'create order failed' });
                    }
                },
                (error) => {
                    reject({ code: error.status, message: 'create order failed' });
                }
            )
        });

    },
    actSingleProduct: (context) => {
        var baseUrl = context.getters.baseUrl;

        var homeDomain = undefined;
        if (localStorage.getItem('homeDomain')) {
            homeDomain = localStorage.getItem('homeDomain');
        }

        var paymentPayUrl=localStorage.getItem('paymentProxyURL');
        return new Promise((resolve, reject) => {
            if (!homeDomain) {
                reject({ error: true, message: 'domain data not found' });
            }

            Vue.http.get(paymentPayUrl+'products', {
                params: {
                    domain: homeDomain,
                    promotion: true
                },
            }).then(
                (response) => {
                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject('[actGetSections response] Error');
                    }
                },
                (error) => {
                    reject(error.body);
                }
            )
        });

    },

    actCreateHashD: (context,data) => {
        var baseUrl = context.getters.baseUrl;

        var homeDomain = undefined;
        if (localStorage.getItem('homeDomain')) {
            homeDomain = localStorage.getItem('homeDomain');
        }

        var user = JSON.parse(localStorage.getItem('altUser'));
        var paymentPayUrl=localStorage.getItem('paymentProxyURL');
        return new Promise((resolve, reject) => {
            if (!homeDomain) {
                reject({ error: true, message: 'domain data not found' });
            }

            Vue.http.post(paymentPayUrl + 'payment/payu/generatehash', data.hash, {
                params: {
                    domain: homeDomain,
                    orderid:data.orderId,
                },
                headers: {
                    XSSESSION: user.sessionToken
                },
            }).then(
                (response) => {
                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject('[actGetSections response] Error');
                    }
                },
                (error) => {
                    reject(error.body);
                }
            )
        });

    },
    actSingleProductPaymentD: (context) => {
        var baseUrl = context.getters.baseUrl;

        var homeDomain = undefined;
        if (localStorage.getItem('homeDomain')) {
            homeDomain = localStorage.getItem('homeDomain');
        }

        var paymentPayUrl=localStorage.getItem('paymentProxyURL');
        return new Promise((resolve, reject) => {
            Vue.http.get(paymentPayUrl+'products', {
                params: {
                    domain: homeDomain,
                    promotion: true
                },
            }).then(
                (response) => {
                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject('[actGetSections response] Error');
                    }
                },
                (error) => {
                    reject(error.body);
                }
            )
        });

    },
    actCreateHash: (context,data) => {
        var baseUrl = context.getters.baseUrl;

        var homeDomain = undefined;
        if (localStorage.getItem('homeDomain')) {
            homeDomain = localStorage.getItem('homeDomain');
        }

        var user = JSON.parse(localStorage.getItem('altUser'));
        var paymentPayUrl=localStorage.getItem('paymentProxyURL');

        return new Promise((resolve, reject) => {
            Vue.http.post(paymentPayUrl + 'payment/payu/generatehash', data.hash, {
                params: {
                    domain: homeDomain,
                    orderid: data.orderId,
                },
                headers: {
                    XSSESSION: user.sessionToken
                },
            }).then(
                (response) => {
                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject('[actGetSections response] Error');
                    }
                },
                (error) => {
                    reject(error.body);
                }
            )
        });
    },
    actSingleProductPayment: (context) => {
        var baseUrl = context.getters.baseUrl;

        var homeDomain = undefined;
        if (localStorage.getItem('homeDomain')) {
            homeDomain = localStorage.getItem('homeDomain');
        }

        var paymentPayUrl=localStorage.getItem('paymentProxyURL');
        return new Promise((resolve, reject) => {
            Vue.http.get(paymentPayUrl+'products', {
                params: {
                    domain: homeDomain,
                    promotion: true
                },
            }).then(
                (response) => {

                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject('[actGetSections response] Error');
                    }
                },
                (error) => {
                    reject(error.body);
                }
            )
        });

    },


    actProductResponse: (context) => {
        var baseUrl = context.getters.baseUrl;
        var user = JSON.parse(localStorage.getItem('altUser'));
        var orderId= localStorage.getItem('product_order');
        var transId= localStorage.getItem('tranId');

        var homeDomain = undefined;
        if (localStorage.getItem('homeDomain')) {
            homeDomain = localStorage.getItem('homeDomain');
        }

        var paymentPayUrl=localStorage.getItem('paymentProxyURL')
        var trData={transaction_id:transId};
        return new Promise((resolve, reject) => {
            Vue.http.post(paymentPayUrl+'accounts/orders/'+orderId+'/payment-payu/',trData,{
                params: {
                    domain: homeDomain,
                },
                headers: {
                    XSSESSION: user.sessionToken
                },
            }).then(
                (response) => {

                    resolve(response.body);
                    // console.log('[payment-result | payment response |  | ]', response);


                },
                (error) => {
                    reject(error.body);
                }
            )
        });

    },
    actTransactionWallet: (context) => {
        var baseUrl = context.getters.baseUrl;
        //var domain = context.getters.domain;
        //// console.log(domain);
        var user = JSON.parse(localStorage.getItem('altUser'));
        var orderId= localStorage.getItem('product_order');
        var transId= localStorage.getItem('tranId');

        var homeDomain = undefined;
        if (localStorage.getItem('homeDomain')) {
            homeDomain = localStorage.getItem('homeDomain');
        }

        // console.log(transId+'---------------------'+domain);
        var paymentPayUrl=localStorage.getItem('paymentProxyURL')
        var trData={payload:transId};
        return new Promise((resolve, reject) => {
            Vue.http.post(paymentPayUrl+'accounts/orders/'+orderId+'/payment/',trData,{
                params: {
                    domain: homeDomain,
                },
                headers: {
                    XSSESSION: user.sessionToken
                },
            }).then(
                (response) => {

                    resolve(response.body);
                    // console.log('[payment-result | payment response |  | ]', response);


                },
                (error) => {
                    reject(error.body);
                }
            )
        });

    },
    actPromoWithPurches: (context,promocodePayload) => {
        var baseUrl = context.getters.baseUrl;

        var homeDomain = undefined;
        if (localStorage.getItem('homeDomain')) {
            homeDomain = localStorage.getItem('homeDomain');
        }

        var user = JSON.parse(localStorage.getItem('altUser'));
        var paymentPayUrl=localStorage.getItem('paymentProxyURL');
        return new Promise((resolve, reject) => {
            Vue.http.post(paymentPayUrl + 'accounts/orders',promocodePayload,{
                params: {
                    domain: homeDomain,
                },
                headers: {
                    XSSESSION: user.sessionToken
                },
            }).then(
                (response) => {

                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject({ code: response.status, message: 'invalid voucher code' });
                    }
                },
                (error) => {
                    reject(error.body);
                }
            )
        });

    },

    actPaytmHasCode: (context,data) => {

        var baseUrl = context.getters.baseUrl;

        var homeDomain = undefined;
        if (localStorage.getItem('homeDomain')) {
            homeDomain = localStorage.getItem('homeDomain');
        }

        var user = JSON.parse(localStorage.getItem('altUser'));
        var paymentPayUrl=localStorage.getItem('paymentProxyURL');

        var resultUrl=location.protocol + '//' + location.host+'/payment_results_wallet/';

        // console.log(data.dataH);
        return new Promise((resolve, reject) => {
            Vue.http.post('https://payment.cloud.altbalaji.com/payment/paytm/generatehash', data.dataH, {
                params: {
                    domain: homeDomain,
                    orderid: data.orderId,
                    notification_url: resultUrl,
                }
            }).then(
                (response) => {
                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject('[actGetSections response] Error');
                    }
                },
                (error) => {
                    reject(error.body);
                }
            )
        });
    },


    actFreechargeHasCode: (context,data) => {
        var baseUrl = context.getters.baseUrl;

        var homeDomain = undefined;
        if (localStorage.getItem('homeDomain')) {
            homeDomain = localStorage.getItem('homeDomain');
        }

        var user = JSON.parse(localStorage.getItem('altUser'));
        var paymentPayUrl=localStorage.getItem('paymentProxyURL');

        var resultUrl=location.protocol + '//' + location.host+'/payment_results_wallet/';
        // console.log(data.dataH);
        return new Promise((resolve, reject) => {
            Vue.http.post('https://payment.cloud.altbalaji.com/payment/freecharge/generatehash', data.dataH, {
                params: {
                    domain: homeDomain,
                    orderid: data.orderId,
                    notification_url: resultUrl,
                }
            }).then(
                (response) => {
                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject('[actGetSections response] Error');
                    }
                },
                (error) => {
                    reject(error.body);
                }
            )
        });
    },
    actMobikwikHasCode: (context,data) => {
        var baseUrl = context.getters.baseUrl;

        var homeDomain = undefined;
        if (localStorage.getItem('homeDomain')) {
            homeDomain = localStorage.getItem('homeDomain');
        }

        var user = JSON.parse(localStorage.getItem('altUser'));
        var paymentPayUrl=localStorage.getItem('paymentProxyURL');

        var resultUrl=location.protocol + '//' + location.host+'/payment_results_wallet/';

        // console.log(data.dataH);
        return new Promise((resolve, reject) => {
            Vue.http.post('https://payment.cloud.altbalaji.com/payment/mobikwik/generatehash', data.dataH, {
                params: {
                    domain: homeDomain,
                    orderid: data.orderId,
                    notification_url: resultUrl,
                }
            }).then(
                (response) => {
                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject('[actGetSections response] Error');
                    }
                },
                (error) => {
                    reject(error.body);
                }
            )
        });
    },
    actAirtel_moneyHasCode: (context,data) => {
        var baseUrl = context.getters.baseUrl;

        var homeDomain = undefined;
        if (localStorage.getItem('homeDomain')) {
            homeDomain = localStorage.getItem('homeDomain');
        }

        var user = JSON.parse(localStorage.getItem('altUser'));
        var paymentPayUrl=localStorage.getItem('paymentProxyURL');

        var resultUrl=location.protocol + '//' + location.host+'/payment_results_wallet/';

        return new Promise((resolve, reject) => {
            Vue.http.post('https://payment.cloud.altbalaji.com/payment/airtel/generatehash', data.dataH, {
                params: {
                    domain: homeDomain,
                    orderid: data.orderId,
                    notification_url: resultUrl,
                }
            }).then(
                (response) => {
                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject('[actGetSections response] Error');
                    }
                },
                (error) => {
                    reject(error.body);
                }
            )
        });
    },

    actOla_moneyHasCode: (context,data) => {
        var baseUrl = context.getters.baseUrl;

        var homeDomain = undefined;
        if (localStorage.getItem('homeDomain')) {
            homeDomain = localStorage.getItem('homeDomain');
        }

        var user = JSON.parse(localStorage.getItem('altUser'));
        var paymentPayUrl=localStorage.getItem('paymentProxyURL');

        var resultUrl=location.protocol + '//' + location.host+'/payment_results_wallet/';

        return new Promise((resolve, reject) => {
            Vue.http.post('https://payment.cloud.altbalaji.com/payment/olamoney/generatehash', data.dataH, {
                params: {
                    domain: homeDomain,
                    orderid: data.orderId,
                    notification_url: resultUrl,
                }
            }).then(
                (response) => {
                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject('[actGetSections response] Error');
                    }
                },
                (error) => {
                    reject(error.body);
                }
            )
        });
    },
    actOxigenHasCode: (context,data) => {
        var baseUrl = context.getters.baseUrl;

        var homeDomain = undefined;
        if (localStorage.getItem('homeDomain')) {
            homeDomain = localStorage.getItem('homeDomain');
        }

        var user = JSON.parse(localStorage.getItem('altUser'));
        var paymentPayUrl=localStorage.getItem('paymentProxyURL');

        var resultUrl=location.protocol + '//' + location.host+'/payment_results_wallet/';

        return new Promise((resolve, reject) => {
            Vue.http.post('https://payment.cloud.altbalaji.com/payment/oxigen/generatehash', data.dataH, {
                params: {
                    domain: homeDomain,
                    orderid: data.orderId,
                    notification_url: resultUrl,
                }
            }).then(
                (response) => {
                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject('[actGetSections response] Error');
                    }
                },
                (error) => {
                    reject(error.body);
                }
            )
        });
    },
    actProductDetails: (context,data) => {
        var baseUrl = context.getters.baseUrl;
        var user = JSON.parse(localStorage.getItem('altUser'));
        var homeDomain = undefined;
        if (localStorage.getItem('homeDomain')) {
            homeDomain = localStorage.getItem('homeDomain');
        }
        var orderId = undefined;
        if(localStorage.getItem('product_order')) {
            orderId = localStorage.getItem('product_order');
        }

        return new Promise((resolve, reject) => {
            Vue.http.get('https://api.cloud.altbalaji.com/accounts/orders/'+orderId,{
                params: {
                    domain: homeDomain
                },headers: {
                    XSSESSION: user.sessionToken
                },
            }).then(
                (response) => {
                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject('[actGetSections response] Error');
                    }
                },
                (error) => {
                    reject(error.body);
                }
            )
        });
    },

};

export default {
    state, getters, mutations, actions,
};
