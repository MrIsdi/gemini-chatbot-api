document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');

    // Function to add a message to the chat box
    function addMessage(sender, text) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        messageElement.innerHTML = `<strong>${sender}:</strong> ${text}`;
        if(sender == "You"){
          messageElement.classList.add("user");
        }else{
          messageElement.classList.add("bot");
        }
        chatBox.appendChild(messageElement);
        // Scroll to the bottom of the chat box
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    chatForm.addEventListener('submit', async function (event) { // Changed to async
        event.preventDefault(); // Prevent the default form submission

        const userMessage = userInput.value.trim(); // Using userMessage as in your snippet
        if (!userMessage) {
            return; // Don't send empty messages
        }

        // Add user message to chat box
        addMessage('You', userMessage);

        // Clear the input field
        userInput.value = '';

        // Replace placeholder with fetch call
        try {
            // Send message to backend
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userMessage }) // Send userMessage
            });

            if (!response.ok) {
                // Handle non-successful HTTP responses
                // Try to get error message from backend, otherwise use status
                let errorData = { message: `HTTP error! status: ${response.status}`};
                try { errorData = await response.json(); } catch (e) { /* ignore if not json */ }
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // Add bot reply to chat box
            addMessage('Gemini', data.reply);
        } catch (error) {
            console.error('Error sending message:', error);
            // Display an error message in the chat box
            addMessage('System', `Error: ${error.message || 'Could not get a response.'}`);
        }
    });
});