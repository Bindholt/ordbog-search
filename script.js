window.addEventListener("load", main);
const ENDPOINT = "http://localhost:8080/ordbogen/";
let min;
let max;

async function main() {
    document.querySelector("#search-btn").addEventListener("click", async () => (search()))
}

async function getSizes() {
    const json = await fetch(ENDPOINT).then((response) => response.json());
    return json;
}

async function getEntryAt(index) {
    const entry = await fetch(`${ENDPOINT}${index}`).then(resp => resp.json());
    return entry;
}

async function search() {
    document.querySelector("#success").style.display = "none";
    document.querySelector("#failure").style.display = "none";

    const searchWord = document.querySelector("#search").value.toLowerCase();
    const startTime = performance.now();
    
    const entry = await binarySearch(searchWord);

    const endTime = performance.now();
    const timeDiff = (endTime - startTime)/1000;
    document.querySelector("#time-elapsed").innerHTML = "total time: " + timeDiff.toFixed(2) + " seconds";

    if(entry != -1) {
        document.querySelector("#success").style.display = "block";
        document.querySelector("#inflected").innerHTML = "Bøjningsform: " + entry.inflected;
        document.querySelector("#headword").innerHTML = "Opslagsord: " + entry.headword;
        document.querySelector("#homograph").innerHTML = "Homograf nr.: " + entry.homograph;
        document.querySelector("#partofspeech").innerHTML = "Ordklasse: " + entry.partofspeech;
        document.querySelector("#id").innerHTML = "ID: " + entry.id;

    } else {
        document.querySelector("#failure").style.display = "block";
        document.querySelector("#fail-word").innerHTML = searchWord;
    }
    console.log(entry);
    
}

async function binarySearch(search) {
    let json = await getSizes();
    let min = json.min;
    let max = json.max;
    let i = 0;

    while(min <= max){
        let middleIndex = Math.floor((max+min)/2);
        let entry = await getEntryAt(middleIndex);
        let compared = compareSearch(search, entry);
        switch (true) {
            case compared > 0:
                min = middleIndex + 1;
                statusUpdate(i);
                break;
            case compared < 0:
                max = middleIndex - 1;
                statusUpdate(i);
                break;
            case compared == 0:
                return entry;
            default:
                break;
        }
        i++;
    }

    return -1;
}

function compareSearch(val1, val2) {

    return val1.localeCompare(val2.inflected);
}

function statusUpdate(i) {
    document.querySelector("#lookups").innerHTML = "Server Requests: " + i + " - ";
    document.querySelector("#time-elapsed").innerHTML = "total time: unknown";
}