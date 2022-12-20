const readlineSync  = require("readline-sync");
const fetch = require('node-fetch');
const fs = require('fs');
const cw = require('crypto-wallets');


    //----------------------------------------------------------------------------------------------------------------------------  
    //Function

    const getapi = async (url) => {
        var req_f      = fetch(url);
        //result JSON
        var res_f      = req_f.then(res => res.json());

        return res_f;
    }

    const postapi = async (url, data, header) => {
        var req_f      = fetch(url, {
            method: 'POST',
            body: data,
            headers: header
        });
        //result JSON
        var res_f      = req_f.then(res => res.json());

        return res_f;
    }

    const incaptcha = async (key, sitegooglekey) => {
        var req_f      = fetch('http://2captcha.com/in.php?key='+key+'&method=userrecaptcha&json=1&googlekey='+sitegooglekey+'&invisible=1&pageurl=https://collectibles.manutd.com/api/claim-token&userAgent=Mozilla/5.0%20(Windows%20NT%2010.0;%20Win64;%20x64)%20AppleWebKit/537.36%20(KHTML,%20like%20Gecko)%20Chrome/108.0.0.0%20Safari/537.36');
        //result JSON
        var res_f      = req_f.then(res => res.json());

        return res_f;
    }

    const rescaptcha = async (key, id) => {
        var req_f      = fetch('http://2captcha.com/res.php?key='+key+'&action=get&json=1&id='+id);
        //result JSON
        var res_f      = req_f.then(res => res.json());

        return res_f;
    }

    const randgmail = async () => {
        return getapi('https://api.namefake.com/indonesian-indonesia');
    }

    const sipaling = async () => {
        return getapi('https://jsonblob.com/api/jsonBlob/1053962046596726784');
    }

    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    const pertama = async (wallet_tz) => {
        var data_wallet     = `{"wallet_address": "${wallet_tz}","wallet_provider": "Temple - Tezos Wallet"}`;
        var url_wallet      = "https://collectibles.manutd.com/api/claim-wallet";
        var head_wallet     = {
            'content-type' : 'text/plain',
            'user-agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
            'origin' : 'https://collectibles.manutd.com',
            'referer' : 'https://collectibles.manutd.com/',
        };
        var req_wallet      = await postapi(url_wallet, data_wallet, head_wallet);

        console.log('    [-] Register Wallet | ' + wallet_tz);
        // console.log(req_wallet);

        return req_wallet
    }

    const kedua = async (wallet_tz) => {
        const email   = await randgmail();
        const gmail   = email["username"]+'@gmail.com';
        // console.log('[-]  Gmail | ' + gmail);

        var data_email  = `{"wallet_address": "${wallet_tz}","email": "${gmail}","marketing_consent": true}`;
        var url_email   = "https://collectibles.manutd.com/api/claim-email";
        var head_email  = {
            'content-type' : 'text/plain',
            'user-agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
            'origin' : 'https://collectibles.manutd.com',
            'referer' : 'https://collectibles.manutd.com/',
            'cookie' : 's_cc=true; wallet_address="'+wallet_tz+'"; wallet_type=beacon; phase_two_onboarding_step=1',
        };
        var req_email      = await postapi(url_email, data_email, head_email);

        
        console.log('    [-] Register Email | ' + gmail);
        // console.log(req_email);
    }

    const ketiga = async (wallet_tz, pkey, key2captcha, googlekey) => {
            //Bypass captcha
            console.log('    [!] Bypass captcha')
            var idbypas = await incaptcha(key2captcha, googlekey);
            // console.log(idbypas.request);

            do {
                var authbypas = await rescaptcha(key2captcha, idbypas.request);
                var recaptchaToken = authbypas.request;
            } while (recaptchaToken === "CAPCHA_NOT_READY");

        var head_claim  = {
            'content-type' : 'text/plain;charset=UTF-8',
            'user-agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
            'origin' : 'https://collectibles.manutd.com',
            'referer' : 'https://collectibles.manutd.com/',
            'cookie' : 's_cc=true; wallet_address="'+wallet_tz+'"; wallet_type=beacon; phase_two_onboarding_step=4',
        };
        var data_claim  = `{"wallet_address": "${wallet_tz}","recaptcha_response": "${recaptchaToken}"}`;
        var url_claim   = "https://collectibles.manutd.com/api/claim-token";
        var req_claim   = await postapi(url_claim, data_claim, head_claim);

        console.log('    [-] Claim NFT');
        // console.log(req_claim.data);

        if (req_claim.data.length !== 0){
            //pharsing Data NFT
            var name_nft   = req_claim["data"]["name"];
            var type_nft   = req_claim["data"]["token_type"];
            var id_nft     = req_claim["data"]["token_id"];

            console.log("    [✓] Done");
            console.log("    [-] Data NFT");
            console.log("        - Name > "+name_nft);
            console.log("        - Type > "+type_nft);
            console.log("        - Id   > "+id_nft);

            //save data wallet
            var text_save = `${type_nft}|${name_nft}|${wallet_tz}|${pkey}\n`;
            await save(text_save, 'result_wallet.txt');
        } else {
            console.log("    [x] Somethings Error !");
        }

        await delay(3000);
        // process.exit(0);
    }

    async function save(content, file){
        // fs.open('wallet.txt', 'w+', function(err, file){
        fs.open(file, 'a+', function(err, file){
            if (err) throw err;
    
            
    
            fs.writeFile(file, content, (err) => {
                if (err) throw err;
                //console.log(`Dono...`)
            })
        })
    }

    async function genwallet(){
        // mainnet for XTZ
        var cok     = cw.generateWallet('XTZ');
    
        return cok;
    }

    //----------------------------------------------------------------------------------------------------------------------------


    (async () => {
        console.log(`
                  ==========================================================
                  ============= AUTO CREATE + CLAIM x 2 CAPTCHA ============
                  ========================================================== \n`);


    //----------------------------------------------------------------------------------------------------------------------------

        const data_x = await sipaling();
        const key2captcha = data_x.key2captcha;
        const googlekey = data_x.googlekey;

        const wtf     = readlineSync.question(`Berapa address ? `);

        for (var i = 1 ; i <= wtf ; i++){
            var wallet = await genwallet();
            var wallet_tz = wallet.address;
            var privkey = wallet.privateKey;

            console.log(`\n${i}. ${wallet_tz}`);

            var req_wallet    = await pertama(wallet_tz);

            if (req_wallet["data"]["has_already_registered"] != false || req_wallet["data"]["has_already_registered"] == null){
                console.log("    [x] Wallet Registered or Somethings Error !");
        
                if (req_wallet["data"]["token"] != null){
                    //pharsing Data NFT
                    var name_nft   = req_wallet["data"]["token"]["name"];
                    var type_nft   = req_wallet["data"]["token"]["token_type"];
                    var id_nft     = req_wallet["data"]["token"]["token_id"];
        
                    console.log("    [-] Data NFT");
                    console.log("        - Name > "+name_nft);
                    console.log("        - Type > "+type_nft);
                    console.log("        - Id   > "+id_nft);

                    await delay(3000);
                    process.exit(0);
                } else if (req_wallet["data"]["has_already_registered"] == true) {
                    console.log("    [!] NFT has not been claimed");
                    console.log("    [!] Try to claim");

                    await delay(5000);
                    await ketiga(wallet_tz, privkey, key2captcha, googlekey);
                }
            } else {
                    await delay(3000);
                    await kedua(wallet_tz);

                    await delay(3000);
                    await ketiga(wallet_tz, privkey, key2captcha, googlekey);
            }
        }
    })();


    

    

