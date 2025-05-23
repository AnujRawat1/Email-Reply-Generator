console.log("Email Writer Extension -> Content Script Loaded");

function createAIButton() {
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.style.marginRight = '8px';
    button.innerHTML = `AI Reply`;
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');
    return button;
}

function createDropdown() {
    const dropdown = document.createElement('select');
    dropdown.className = 'ai-tone-dropdown';
    dropdown.style.marginRight = '8px';
    dropdown.style.padding = '6px';
    dropdown.style.borderRadius = '4px';
    dropdown.style.border = '1px solid #ccc';
    dropdown.style.fontSize = '14px';
    dropdown.style.cursor = 'pointer';

    const options = ['NONE', 'Professional', 'Casual', 'Friendly'];
    options.forEach(optionText => {
        const option = document.createElement('option');
        option.value = optionText.toLowerCase();
        option.textContent = optionText;
        dropdown.appendChild(option);
    });

    return dropdown;
}


function findComposeToolbar() {
    const selectors = [
        '.btC',
        '.aDh',
        '[role="toolbar"]',
        '.gU.Up'
    ];
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            return toolbar;
        }
    }
    return null;
}

function getEmailContent() {
    const selectors = [ '.h7', '.a3s.ail', '.gmail_quote', '[role="presentation"]' ];

    for(const selector of selectors) {
        const content = document.querySelector(selector);
        if(content) 
            return content.innerText.trim();
        return '';
    }
}

const injectButton = () => {
    const existingButton = document.querySelector('.ai-reply-button');
    if(existingButton)  existingButton.remove();

    const toolbar = findComposeToolbar() ;
    if(!toolbar) {
        console.log("Toolbar Not Found");
        return;
    }

    console.log("Toolbar Found !, \nCreating AI Button");

    const dropdown = createDropdown();
    const button = createAIButton();

    button.classList.add('ai-reply-button');
    button.addEventListener('click', async () => {

        try {
            console.log("AI Button Clicked");

            button.innerHTML = `Generating...`;
            button.disabled = true;

            const emailContent = getEmailContent();
            const selectedTone = dropdown.value;

            const response = await fetch('https://smart-email-reply-generator.onrender.com/api/email/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "emailContent" : emailContent,
                    "tone" : selectedTone
                })
            });

            if(!response.ok)
                throw new Error("API Request Failed");

            const generatedReply = await response.text();
            const composeBox = document.querySelector('[role="textbox"][g_editable = "true"]');

            if( composeBox ) {
                composeBox.focus();
                document.execCommand('insertText', false, generatedReply);
            }else{
                console.error("Compose Box Not Found");
            }

        } catch (error) {
            console.error(error);
            alert("Failed to Generate the Reply");
        } finally {
            button.innerHTML = `AI Reply`;
            button.disabled = false;
        }
    });


    toolbar.insertBefore(button, toolbar.firstChild);
}

const observer = new MutationObserver((mutations) => {

    for( const mutation of mutations ) {
        const addedNodes = Array.from(mutation.addedNodes);
        
        const hasComposeElements = addedNodes.some(node => node.nodeType === Node.ELEMENT_NODE   
            && (node.matches('.aDh, .btC, [role="dialog"]') || node.querySelector('.aDh, .btC, [role="dialog"]'))
        );

        if(hasComposeElements) {
            console.log("Compose Window Detected");
            setTimeout(injectButton, 500);
        }
    }

});


observer.observe(document.body, {
    childList: true,
    subtree: true
});