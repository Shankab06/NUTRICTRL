document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Get user ingredients from local storage
        let userIngredients = localStorage.getItem("userIngredients") || "Unknown Ingredients";
        document.getElementById("ingredientSummary").innerText = `Analyzing: ${userIngredients}`;

        // Send request to backend
        const response = await fetch("http://localhost:3000/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ingredients: userIngredients }),
        });

        const data = await response.json();
        const resultText = data.result || "No response received.";

        // Update result page
        document.getElementById("resultText").innerText = resultText;

        // Set result image based on classification
        let resultImage = "images/neutral.png"; // Default image
        if (resultText.toLowerCase().includes("good")) {
            resultImage = "images/good.png";
        } else if (resultText.toLowerCase().includes("bad")) {
            resultImage = "images/bad.png";
        }

        document.getElementById("resultImage").src = resultImage;
    } catch (error) {
        document.getElementById("resultText").innerText = "Error analyzing food. Please try again.";
        console.error("Error:", error);
    }
});
