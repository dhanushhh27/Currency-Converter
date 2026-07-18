const BASE_URL = 
"https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
// const GEMINI_API_KEY = "";//ENTER YOUR API KEY HERE
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select")
const toCurr = document.querySelector(".to select")
const msg = document.querySelector(".msg");


for(let select of dropdowns){
    for (currCode in countryList){
        let newOption = document.createElement("option");
        newOption.innerText= currCode;
        newOption.value = currCode;
        if(select.name === "from" && currCode === "USD")
            {
            newOption.selected= "selected";
        }
        else if(select.name === "to" && currCode === "INR")
            {
                newOption.selected= "selected";
            }
            select.append(newOption);
        }
        select.addEventListener("change",(evt) => {
            updateFlag(evt.target);
        });
    }

    const updateExchangeRate = async() => {       
    let amount = document.querySelector(".amount input");
        let amtVal = amount.value;
        if(amtVal === "" || amtVal < 1) {
            amtVal = 1;
            amount.value = "1";
        }

         const fromCurrency = fromCurr.value.toLowerCase();
         const toCurrency = toCurr.value.toLowerCase();

         const URL = `${BASE_URL}/${fromCurrency}.json`;
         try {
        let response = await fetch(URL);
        let data = await response.json();
        let rate = data[fromCurrency][toCurrency];
        
        let finalAmount = amtVal * rate;
        console.log("Exchange Rate:", rate);
        console.log("Final Amount:", finalAmount);
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(3)} ${toCurr.value}`;
        fetchCurrencySummary(fromCurr.value, toCurr.value);
        } catch (error) {
        console.error("Error fetching the exchange rate:", error);
    }
};

    const updateFlag = (element) =>{
        let currCode = element.value;
        let countryCode = countryList[currCode];
        let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
        let img = element.parentElement.querySelector("img");
        img.src = newSrc;

    };

    const fetchCurrencySummary = async (from, to) => {
    const summaryBox = document.getElementById("ai-summary");
    summaryBox.style.display = "block";
    summaryBox.innerText = "✨ AI is analyzing trends...";

    const prompt = `Give me one fun fact or a recent economic trend about the exchange rate between ${from} and ${to}. Keep it under 20 words.`;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        
        // Extract the text from the Gemini response structure
        const aiText = data.candidates[0].content.parts[0].text;
        summaryBox.innerText = `✨ AI Insight: ${aiText}`;
    } catch (error) {
        console.error("AI Error:", error);
        summaryBox.innerText = "✨ AI Insight is currently unavailable.";
    }
};
    
    btn.addEventListener("click", async(evt) => {
        evt.preventDefault();
        updateExchangeRate();
    });
    window.addEventListener("load", () => {
    updateExchangeRate();
});



const themeBtn = document.getElementById("theme");

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeBtn.innerText = "Light Mode";
}

themeBtn.addEventListener("click", () => {
    // Toggle the dark-mode class on the body
    document.body.classList.toggle("dark-mode");
    
    if (document.body.classList.contains("dark-mode")) {
        themeBtn.innerText = "Light Mode";
        localStorage.setItem("theme", "dark");
    } else {
        themeBtn.innerText = "Dark Mode";
        localStorage.setItem("theme", "light");
    }
});
const swapIcon = document.getElementById("arrow");

swapIcon.addEventListener("click", () => {
    let tempCode = fromCurr.value;
    fromCurr.value = toCurr.value;
    toCurr.value = tempCode;

    updateFlag(fromCurr);
    updateFlag(toCurr);

    updateExchangeRate();

    swapIcon.classList.add("rotate");
    setTimeout(() => {
        swapIcon.classList.remove("rotate");
    }, 300);
});

