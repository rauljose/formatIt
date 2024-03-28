
class It_Dialog {

    static alert(title, message, okLabel = 'Ok') {
        return new Promise((resolve) => {
            // Generate a unique ID for the dialog
            const dialogId = 'dialog_' + new Date().getTime();

            // Save the current active element
            const activeElement = document.activeElement;

            // Create the dialog HTML
            const dialogHTML = `
      <dialog class="it_dialog" id="${dialogId}" role="dialog" aria-labelledby="${dialogId}_title" aria-describedby="${dialogId}_desc" aria-modal="true" aria-live="assertive">
        <div class="it_dialog_title">
          <h2 id="${dialogId}_title">${title}</h2>
          <button id="closeButton_${dialogId}" class="it_dialog_title_close" aria-label="Close">&times;</button>
        </div>
        <div id="${dialogId}_desc">${message}</div>
        <button id="readButton_${dialogId}" aria-label="${okLabel}">${okLabel}</button>
      </dialog>
    `;

            // Append the dialog to the body
            document.body.insertAdjacentHTML('beforeend', dialogHTML);

            // Get the dialog and buttons
            const dialog = document.getElementById(dialogId);
            const readButton = document.getElementById(`readButton_${dialogId}`);
            const closeButton = document.getElementById(`closeButton_${dialogId}`);

            // Add event listeners
            readButton.addEventListener('click', () => {
                console.log('Read button clicked');
                dialog.close();
            });

            closeButton.addEventListener('click', () => {
                dialog.close();
            });

            document.addEventListener('keydown', (event) => {
                if(event.keyCode === 27) {
                    dialog.close();
                }
            });

            // Remove the dialog when it is closed and resolve the promise
            dialog.addEventListener('close', () => {
                dialog.remove();
                // Return focus to the previously active element
                activeElement.focus();
                resolve();
            });

            // Open the dialog
            dialog.showModal();
            // Move focus to the dialog
            dialog.focus();
        });
    }

    static confirm(title, message, yesLabel = 'Yes', noLabel = 'No') {
        return new Promise((resolve, reject) => {
            // Generate a unique ID for the dialog
            const dialogId = 'dialog_' + new Date().getTime();

            // Save the current active element
            const activeElement = document.activeElement;

            // Create the dialog HTML
            const dialogHTML = `
      <dialog class="it_dialog" id="${dialogId}" role="dialog" aria-labelledby="${dialogId}_title" aria-describedby="${dialogId}_desc" aria-modal="true" aria-live="assertive">
        <div style="display: flex; justify-content: space-between; align-items: center;background-color:darkblue;margin:0">
          <h2 id="${dialogId}_title">${title}</h2>
          <button id="closeButton_${dialogId}" style="background: none; border: none; font-size: 1.5em;" aria-label="Close">&times;</button>
        </div>
        <div id="${dialogId}_desc">${message}</div>
        <button id="yesButton_${dialogId}" aria-label="${yesLabel}">${yesLabel}</button>
        <button id="noButton_${dialogId}" aria-label="${noLabel}">${noLabel}</button>
      </dialog>
    `;

            // Append the dialog to the body
            document.body.insertAdjacentHTML('beforeend', dialogHTML);

            // Get the dialog and buttons
            const dialog = document.getElementById(dialogId);
            const yesButton = document.getElementById(`yesButton_${dialogId}`);
            const noButton = document.getElementById(`noButton_${dialogId}`);
            const closeButton = document.getElementById(`closeButton_${dialogId}`);

            // Add event listeners
            yesButton.addEventListener('click', () => {
                dialog.close();
                resolve();
            });

            noButton.addEventListener('click', () => {
                dialog.close();
                reject();
            });

            closeButton.addEventListener('click', () => {
                dialog.close();
                reject();
            });

            document.addEventListener('keydown', (event) => {
                if(event.keyCode === 27) {
                    dialog.close();
                    reject();
                }
            });

            // Remove the dialog when it is closed
            dialog.addEventListener('close', () => {
                dialog.remove();
                // Return focus to the previously active element
                activeElement.focus();
            });

            // Open the dialog
            dialog.showModal();
            // Move focus to the dialog
            dialog.focus();
        });
    }
}
