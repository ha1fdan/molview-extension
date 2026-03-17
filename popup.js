async function loadBackups(){

    let data = await browser.storage.local.get();

    let select=document.getElementById("backups");

    select.innerHTML="";

    for(let key in data){

        if(key.startsWith("molview_")){

            let option=document.createElement("option");

            option.value=key;

            option.textContent=
                key.replace("molview_","");

            select.appendChild(option);
        }
    }
}

document.getElementById("export").onclick=async()=>{

    let name=document
        .getElementById("name")
        .value
        .trim();

    if(!name){
        alert("Enter name");
        return;
    }

    browser.runtime.sendMessage({
        action:"export",
        name:name
    });

    setTimeout(loadBackups,300);
};

document.getElementById("import").onclick=()=>{

    let key=document
        .getElementById("backups")
        .value;

    browser.runtime.sendMessage({
        action:"import",
        key:key
    });
};

document.getElementById("delete").onclick=async()=>{

    let key=document
        .getElementById("backups")
        .value;

    await browser.storage.local.remove(key);

    loadBackups();
};

loadBackups();