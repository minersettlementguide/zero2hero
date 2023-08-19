/*
    Global Variables:
*/
var pageContent;
var pageTopBtn;
var pageBottomBtn;


/*
    Color Picker Script:
*/
let colorPicker = document.getElementById('color-picker');
var sliderR = document.getElementById('picker-slider-r');
var sliderG = document.getElementById('picker-slider-g');
var sliderB = document.getElementById('picker-slider-b');
var sliderGray = document.getElementById('picker-slider-gray');

var pickerOutputColor = document.getElementById('picker-output-color');
var pickerOutputText = document.getElementById('picker-output-field');

function validateUserinput() {
    // Assign Value on Execution
    const input = pickerOutputText.value;

    // Use Regex to Validate Input
    let hexRegex = new RegExp(/^<#([A-Fa-f0-9]{3})>$/);

    // If Value is Hexcode, Update the UI, Else Reset UI
    if (hexRegex.test(input) == true) {
        let parsedHexcode = input.replace(/[^a-z0-9]/gi, '');

        // If Clean Value is 3 digits, Update Output Color
        if (parsedHexcode.length === 3) {
            pickerOutputColor.style.backgroundColor = `#${parsedHexcode}`;
        }
    } else {
        pickerOutputText.classList.add('picker-validation-border');
    }
}

function updateGrayscale() {
    // Convert Int to String for Grayscale Value
    var hexGrayInt = sliderGray.value;
    var hexGrayStr = parseInt(sliderGray.value).toString(16)

    // Convert Individual Color to Hexcode
    var hexcodeValue = hexGrayStr + hexGrayStr + hexGrayStr;
    var hexCodeCSS = `#${hexcodeValue}`;
    var hexCodeMarkup = `<#${hexcodeValue}>`;

    // Update Slider Accent Color
    sliderR.style.accentColor = `#${hexGrayStr}00`;
    sliderG.style.accentColor = `#0${hexGrayStr}0`;
    sliderB.style.accentColor = `#00${hexGrayStr}`;
    sliderGray.style.accentColor = hexCodeCSS;

    // Update Slider RGB Values
    sliderR.value = hexGrayInt;
    sliderG.value = hexGrayInt;
    sliderB.value = hexGrayInt;

    // Update Output Colors
    pickerOutputColor.style.backgroundColor = hexCodeCSS;
    pickerOutputText.value = hexCodeMarkup;
}

function updateColor() {
    // Reset Gray Slider on RGB Update
    sliderGray.value = 0;

    // Convert Int to String for RGB Values
    var hexStrR = parseInt(sliderR.value).toString(16);
    var hexStrG = parseInt(sliderG.value).toString(16);
    var hexStrB = parseInt(sliderB.value).toString(16);

    // Convert Individual Colors to Hexcode
    var hexcodeValue = hexStrR + hexStrG + hexStrB;
    var hexCodeCSS = `#${hexcodeValue}`;
    var hexCodeMarkup = `<#${hexcodeValue}>`;

    // Update Slider Accent Color
    sliderR.style.accentColor = `#${hexStrR}00`;
    sliderG.style.accentColor = `#0${hexStrG}0`;
    sliderB.style.accentColor = `#00${hexStrB}`;

    // Update Output Colors
    pickerOutputColor.style.backgroundColor = hexCodeCSS;
    pickerOutputText.value = hexCodeMarkup;
}

function resetColor() {
    pickerOutputText.classList.remove('picker-validation-border');
    pickerOutputText.value = '<#f00>';
    sliderR.style.accentColor = `#F00`;
    sliderR.value = 15;
    sliderG.value = 0;
    sliderB.value = 0;
    sliderGray.value = 0;
}

colorPicker.addEventListener('input', (event) => {
    // Remove Validation on Input Event
    pickerOutputText.classList.remove('picker-validation-border');

    // Determine Element ID
    var element = event.target;
    var elementId = element.getAttribute('id');

    // Process by Element ID
    if (elementId === 'picker-output-field') {
        setTimeout(() => {
            validateUserinput();
        }, 1250);
    } else if (elementId === 'picker-slider-gray') {
        updateGrayscale();
    } else {
        updateColor();
    }
});

/*
    Page Jump Script:
*/

function percentage(partial, total) {
    const result = Math.round((partial / total) * 100)
    return result;
} 

function scrollButtonVisibility() {
    // Calculate Scroll Height into Percents
    let pageContentHeight = pageContent.scrollHeight;
    let pageScrollPercent = percentage(pageContent.scrollTop, pageContentHeight);
    let topButtonLimit = 1;
    let bottomButtonLimit = 97;

    // Control Top Scroll Button Visibility
    if (pageScrollPercent > topButtonLimit) {
        pageTopBtn.style.display = "inline-block";
    } else {
        pageTopBtn.style.display = "none";
    }

    // Control Bottom Scroll Button Visibility
    if (pageScrollPercent > bottomButtonLimit) {
        pageBottomBtn.style.display = "none";
    } else {
        pageBottomBtn.style.display = "inline-block";
    }
}

function scrollPageTop() {
    pageContent.scrollTop = 0;
}

function scrollPageBottom() {
    pageContent.scrollTop = pageContent.scrollHeight;
}



/*
    Main Process:
*/

// Build HTML Cards
function generateCards(data, script) {

    // Process Array of Cards into HTML
    let processedCards = [];

    for (let i = 0; i < data.length; i++) {

        // Set Card Title
        let cardTitle = data[i].title;

        // Process Screenshots If Provided
        let cardScreenshotPaths = data[i].screenshots;
        let cardScreenshots = [];
        
        if (cardScreenshotPaths.length) {
            for (let a = 0; a < cardScreenshotPaths.length; a++) {
                let cardScreenshotPath = cardScreenshotPaths[a]
                let cardScreenshotTemplate = `<img class="img-screenshot img-medium" src="${cardScreenshotPath}">`;
                cardScreenshots.push(cardScreenshotTemplate);
            }
        }

        // Process Steps If Provided
        let cardStepList = data[i].steps;
        let cardSteps = [];

        if (cardStepList.length) {
            for (let b = 0; b < cardStepList.length; b++) {
                let cardStep = cardStepList[b]
                let cardStepTemplate = `<li>${cardStep}"</li>`;
                cardSteps.push(cardStepTemplate);
            }
        }

        // Populate Data to HTML Template
        let cardTemplate = `
            <div>
                <div class="flex-card-title">
                    <h2>${cardTitle}</h2>
                </div>
                <div class="flex-card">
                    <div class="flex-card-instructions">
                        <ul>
                            ${cardSteps.join('\n')}
                        </ul>
                    </div>
                    <div class="flex-card-row-center">
                        ${cardScreenshots.join('\n')}
                    </div>
                </div>
            </div>
        `;

        // Push Completed Card
        processedCards.push(cardTemplate);
    }

    return processedCards;
}

// Process HTML Cards
async function assembleCards(data) {
    
    // Build Categorized HTML Page Object 
    const pageDataObject = {
        earlyGamePage: '',
        midGamePage: '',
        endGamePage: ''
    }

    // Process Card JSON
    for (let i = 0; i < data.length; i++) {
        if (data[i].section == 'Early Game') {
            const earlyGameCardList = data[i].cards;
            let earlyGameCards = generateCards(earlyGameCardList);
            pageDataObject.earlyGamePage = earlyGameCards.join('\n');
            
        } else if (data[i].section == 'Mid Game') {
            const midGameCardList = data[i].cards;
            let midGameCards = generateCards(midGameCardList);
            pageDataObject.midGamePage = midGameCards.join('\n');

        } else if (data[i].section == 'End Game') {
            const endGameCardList = data[i].cards;
            let endGameCards = generateCards(endGameCardList);
            pageDataObject.endGamePage = endGameCards.join('\n');

        } else {
            continue;
        }
    }

    return pageDataObject;
}

// Fetch Card Data
async function getData() {
    try {
        const url = 'https://minersettlementguide.github.io/zero2hero/data/guide.json';
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Fetching Data Failed: ', error);
        return;
    }
}

// Execute on Page Load
window.onload = async () => {
    // Reset Color Picker on Page Load
    resetColor();

    // Content Div
    let dynamicContentDiv = document.getElementById("dynamic-content");

    // Fetch Guide Data & Process Into Pages
    let cardData = await getData();
    let pages = await assembleCards(cardData);

    // Render Page Data
    let dynamicContent = `${pages.earlyGamePage}\n${pages.midGamePage}\n${pages.endGamePage}`
    dynamicContentDiv.innerHTML = dynamicContent;

    // Prepare Page Nav
    pageTopBtn = document.getElementById("pageTopBtn");
    pageBottomBtn = document.getElementById("pageBottomBtn");
    pageContent = document.getElementById("pageContentContainer");

    // Prepare Scroll Buttons
    pageContent.onscroll = function () {
        scrollButtonVisibility()
    };
};
