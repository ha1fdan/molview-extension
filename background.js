async function getStorage(tabId){

    let result = await browser.tabs.executeScript(tabId,{
        code: `
        var data={};

        for(var i=0;i<localStorage.length;i++){

            var key=localStorage.key(i);

            data[key]=localStorage.getItem(key);
        }

        data;
        `
    });

    return result[0];
}

async function setStorage(tabId,data){

    let code = `
    var data = ${JSON.stringify(data)};

    for(var key in data){

        localStorage.setItem(
            key,
            data[key]
        );
    }
    `;

    await browser.tabs.executeScript(tabId,{
        code: code
    });
}

browser.runtime.onMessage.addListener(async(msg)=>{

    let [tab]=await browser.tabs.query({
        active:true,
        currentWindow:true
    });

    if(!tab.url.includes("app.molview.com")){
        return;
    }

    if(msg.action==="export"){

        let data=await getStorage(tab.id);

        await browser.storage.local.set({
            ["molview_"+msg.name]:data
        });

    }

    if(msg.action==="import"){

        let data=await browser.storage.local.get(msg.key);

        await setStorage(
            tab.id,
            data[msg.key]
        );

        await browser.tabs.reload(tab.id);

    }

});