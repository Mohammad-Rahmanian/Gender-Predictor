// API for gender prediction
const API_URL = "https://api.genderize.io/?name=";

document.addEventListener("DOMContentLoaded", () => {
    // Initialize form values
    let formValues = { name: "", gender: undefined };
    let firstName = "";

    // Function to simplify element selection
    const getEl = (selector) => document.querySelector(selector);

    const nameInput = getEl("#name");
    const form = getEl("#form");
    const saveButton = getEl("#save");
    const genderText = getEl("#gender-text");
    const genderValue = getEl("#gender-variable");
    const savedAnswer = getEl("#saved-answer");
    const clearButton = getEl("#clear");
    const error = getEl("#error");

    // Function to display error messages
    const updateError = (message, display = "flex") => {
        error.style.display = display;
        error.innerHTML = message;
    };

    // Event listeners for form inputs
    nameInput.addEventListener("input", e => formValues.name = e.target.value);
    form.addEventListener("input", () => {
        formValues.gender = getEl('input[name="radio-group"]:checked')?.value;
    });

    // Handle form submission
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Validate input name
        firstName = formValues.name.trim();
        if (firstName.length > 255) return updateError("Name cannot exceed 255 characters");
        if (!/^[A-Za-z\s]+$/.test(firstName)) return updateError("Name must contain only spaces and letters");
        if (!firstName) return updateError("Please enter a name");

        // API request and response handling
        updateError("", "none");
        savedAnswer.textContent = localStorage.getItem(firstName) || "NO DATA";
        genderText.textContent = genderValue.textContent = "loading...";
        try {
            const response = await fetch(`${API_URL}${firstName}`);
            const data = await response.json();
            if (data.probability === 0) throw new Error(firstName + " not found");
            genderText.textContent = data.gender;
            genderValue.textContent = `${data.probability}`;
        } catch (err) {
            updateError(err.message);
            genderText.textContent = "Gender";
            genderValue.textContent = "Probability";
        }
    });

    // Save button functionality
    saveButton.addEventListener("click", () => {
        if (formValues.gender && formValues.name) {
            updateError("", "none");
            firstName = formValues.name;
            localStorage.setItem(formValues.name, formValues.gender);
            savedAnswer.textContent = localStorage.getItem(formValues.name) || "No Data";
        } else if(!formValues.name) {
            updateError("Please enter a name");
        } else {
            updateError("Enter 'male' or 'female' for gender");
        }
    });

    // Clear button functionality
    clearButton.addEventListener("click", () => {
        if (localStorage.getItem(firstName)) {
            localStorage.removeItem(firstName);
            firstName = "";
            savedAnswer.textContent = "Clear";
        }
    });
});
