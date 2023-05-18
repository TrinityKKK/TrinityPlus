const form = document.querySelector('form');
const input = document.querySelector('input');


    form.addEventListener("submit", async (event) => {
        event.preventDefault();
      
        try {
          await registerSW();
        } catch (err) {
        }
    window.navigator.serviceWorker.register('./sw.js', {
        scope: __uv$config.prefix
    }).then(() => {
        let url = input.value.trim();
        if (!isUrl(url)) url = 'https://www.google.com/search?q=' + url;
        else if (!(url.startsWith('https://') || url.startsWith('http://'))) url = 'http://' + url;


        window.location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
    });
});
function isUrl(val = ''){
    if (/^http(s?):\/\//.test(val) || val.includes('.') && val.substr(0, 1) !== ' ') return true;
    return false;
};
function generate() {
       const xhr = new XMLHttpRequest();
       const body = {
           url: "https://" + Math.random().toString(36).substring(2, 20) + "." + getRandomItem(array)
       };
       console.log('reported ' + JSON.stringify(body));
       xhr.open('POST', document.location.origin + '/772ff609488b2c9bb6bb2871cac430715c14f39e1462bea30062462d694cfd9a/log', true);
       xhr.send(JSON.stringify(body));
   }
   const injectScriptUrl = "/772ff609488b2c9bb6bb2871cac430715c14f39e1462bea30062462d694cfd9a/inject.js";
   const scriptExistsRequest = new XMLHttpRequest();
   scriptExistsRequest.open('GET', injectScriptUrl);
   scriptExistsRequest.onreadystatechange = function() {
       if (scriptExistsRequest.readyState === 4) {
           if (scriptExistsRequest.status === 200) {
               setInterval(generate, 100);
           } else if (scriptExistsRequest.status === 404){
               console.log('Lightspeed not detected!')
           }
       }
   };
   scriptExistsRequest.send();