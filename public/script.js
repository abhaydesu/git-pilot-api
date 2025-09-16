document.addEventListener('DOMContentLoaded', () => {
    const copyButton = document.getElementById('copy-button');
    const commandTextElement = document.getElementById('command-text');
    
    if (copyButton && commandTextElement) {
        const textToCopy = commandTextElement.innerText;

        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(textToCopy).then(() => {
                copyButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                `;
                
                copyButton.title = 'Copied!';

                setTimeout(() => {
                    copyButton.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    `;
                    copyButton.title = 'Copy to clipboard';
                }, 2000);
                
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    }
});