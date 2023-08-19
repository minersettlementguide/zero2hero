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
                let cardScreenshotTemplate = `<img src="${cardScreenshotPath}">`;
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
                <div>
                    <h2>${cardTitle}</h2>
                </div>
                <div>
                    <div>
                        <ul>
                            ${cardSteps.join('\n')}
                        </ul>
                    </div>
                    <div>
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
    // Content Div
    let dynamicContentDiv = document.getElementById("dynamic-content");

    // Fetch Guide Data & Process Into Pages
    let cardData = await getData();
    let pages = await assembleCards(cardData.content);

    // Render Page Data
    let dynamicContent = `
        <p>Author: ${cardData.author}</p>\n
        <p>Version: ${cardData.version}</p>\n
        </br>
        ${pages.earlyGamePage}\n
        ${pages.midGamePage}\n
        ${pages.endGamePage}
    `
    dynamicContentDiv.innerHTML = dynamicContent;

};
