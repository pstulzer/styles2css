import {Download2File} from "./downloadFile";
import {TextSelection} from "./textSelection";

const lang = document.getElementById('lang');
const style = document.getElementById('style');
const code = document.getElementById('code');
const loader = document.getElementById('loader');

function generateCss() {
    parent.postMessage({pluginMessage: {type: "generate", data: {lang: lang.value, style: style.value}}}, '*');
}

const go = document.getElementById('go');
go.onclick = (event) => {
    event.preventDefault();
    code.innerHTML = "";
    loader.classList.add("active");
    setTimeout(generateCss, 1000);
}

const download = document.getElementById('download');
download.onclick = () => {
    parent.postMessage({pluginMessage: {type: "getname"}}, '*')
}

function selectElementText(el) {
    const range = document.createRange() // create new range object
    range.selectNodeContents(el) // set range to encompass desired element text
    const selection = window.getSelection() // get Selection object from currently user selected text
    selection.removeAllRanges() // unselect any user selected text (if any)
    selection.addRange(range) // add range to Selection object to select it
}

const copy = document.getElementById('copy');
copy.onclick = () => {
    selectElementText(code)
    document.execCommand("copy");
}

onmessage = (event) => {
    // console.log("got this from the plugin code", event.data.pluginMessage)
    if (event.data.pluginMessage.type === "Code") {
        code.innerHTML = event.data.pluginMessage.data;
        copy.disabled = false;
        download.disabled = false;
        loader.classList.remove("active");
    }
    if (event.data.pluginMessage.type === "Name") {
        let filename = event.data.pluginMessage.data + "." + lang.value.toString().toLowerCase()
        selectElementText(code)
        //  let paratext = TextSelection()
        // Download2File(paratext, filename, 'text/plain')
    }
    if (event.data.pluginMessage.type === "ShowError") {
        alert(event.data.pluginMessage.value);
    }
}
