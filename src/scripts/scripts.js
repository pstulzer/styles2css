import {Download2File} from "./downloadFile";
import {TextSelection} from "./textSelection";

const lang = document.getElementById('lang');
const code = document.getElementById('code');
const loader = document.getElementById('loader');
const counter = loader.querySelector("h2");
const message = document.getElementById('message');
const generate = document.getElementById('go');

const generateCss = (settings) => {
    parent.postMessage({
        pluginMessage: {
            type: "generate",
            data: settings
        }
    }, '*');
}
const generateForm = document.getElementById('generateForm');
generateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    new FormData(generateForm);
});
generateForm.addEventListener('formdata', (e) => {
    code.innerHTML = "";
    message.classList.remove("active");
    loader.classList.add("active");
    copy.disabled = true;
    download.disabled = true;
    generate.disabled = true;

    const settings = {
        lang: "CSS",
        style: "kebab-case",
        usevars: "off"
    }

    let data = e.formData;
    for (let entry of data.entries()) {
        settings[entry[0]] = entry[1];
    }

    setTimeout(generateCss, 100, settings);
    window.history.back();
});

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
        generate.disabled = false;
        loader.classList.remove("active");
    }
    if (event.data.pluginMessage.type === "Name") {
        let filename = event.data.pluginMessage.data + "." + lang.value.toString().toLowerCase()
        selectElementText(code)
        let paratext = TextSelection()
        Download2File(paratext, filename, 'text/plain')
    }
    if (event.data.pluginMessage.type === "ShowError") {
        alert(event.data.pluginMessage.value);
    }
    if (event.data.pluginMessage.type === "STYLES") {
        let idle = "";
        let val = "";
        let value = counter.querySelector(".counter__value");
        if (value === null) {
            value = `<span class="counter__value"></span>`;
        }
        val = value.textContent;
        if (parseInt(val) === event.data.pluginMessage.value) {
            idle = counter.querySelector(".counter__idle").textContent;
            idle = idle + ".";
            if (idle.length > 10) {
                idle = "";
            }
        } else {
            val = event.data.pluginMessage.value
        }
        counter.innerHTML = `<span class="counter__text">Counting styles:</span><span class="counter__value">` + val + `</span><span class="counter__idle">` + idle + `</span>`;
    }
}
