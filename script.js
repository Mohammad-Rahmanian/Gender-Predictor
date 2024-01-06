const API_URL = "https://api.genderize.io/?name=";

document.addEventListener("DOMContentLoaded", () => {
    let formValues = { name: "", gender: undefined };
    let lastName = "";

    const getEl = (selector) => document.querySelector(selector);
    const nameInput = getEl("#name");
    const form = getEl("#form");
    const saveButton = getEl("#save");
    const genderText = getEl("#gender-txt");
    const genderValue = getEl("#gender-val");
    const savedAnswer = getEl("#saved-answer");
    const clearButton = getEl("#clear");
    const error = getEl("#error");

    const updateError = (message, display = "flex") => {
        error.style.display = display;
        error.innerHTML = message;
    };

    nameInput.addEventListener("input", e => formValues.name = e.target.value);
    form.addEventListener("input", () => {
        formValues.gender = getEl('input[name="radio-group"]:checked')?.value;
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        lastName = formValues.name.trim();
        if (lastName.length > 255) {
            return updateError("Name cannot exceed 255 characters");
        }
        if (!/^[A-Za-z\s]+$/.test(lastName)) {
            return updateError("Name must contain only spaces, uppercase, and lowercase letters");
        }
        if (!lastName) return updateError("Complete the form");

        updateError("", "none");
        savedAnswer.textContent = localStorage.getItem(lastName) || "NO DATA";
        genderText.textContent = genderValue.textContent = "loading...";

        try {
            const response = await fetch(`${API_URL}${lastName}`);
            const data = await response.json();
            if (data.probability === 0) {
                throw new Error(lastName + " name not found");
            }
            genderText.textContent = data.gender;
            genderValue.textContent = `${data.probability}`;
        } catch (err) {
            updateError(err.message);
            genderText.textContent = "GENDER";
            genderValue.textContent = "Probability";
        }
    });

    saveButton.addEventListener("click", () => {
        if (formValues.gender && formValues.name) {
            updateError("", "none");
            lastName = formValues.name;
            localStorage.setItem(formValues.name, formValues.gender);
            savedAnswer.textContent = localStorage.getItem(formValues.name) || "NO DATA";
        } else {
            updateError("Complete the form");
        }
    });

    clearButton.addEventListener("click", () => {
        if (localStorage.getItem(lastName)) {
            localStorage.removeItem(lastName);
            lastName = "";
            savedAnswer.textContent = "CLEARED";
        }
    });
});
