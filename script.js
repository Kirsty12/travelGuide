document.addEventListener("DOMContentLoaded", async () => {
    console.log("Script loaded successfully!");

    const topVotedSection = document.getElementById("topVotedCountries");
    const countrySection = document.querySelector(".destination-list");
    const searchInput = document.getElementById("searchInput");

    // Retrieve votes from localStorage or initialize an empty object
    let votes = JSON.parse(localStorage.getItem("countryVotes")) || {};

    // List of top holiday destinations
    const popularDestinations = [
        "France", "Italy", "Spain", "United Kingdom", "United States", "Japan", "Denmark",
        "Thailand", "Australia", "New Zealand", "Mexico", "Greece", "Maldives", "Switzerland",
        "Canada", "Brazil", "United Arab Emirates", "Singapore", "Portugal", "South Africa"
    ];

    async function fetchTopHolidayDestinations() {
        try {
            const restCountriesRes = await fetch("https://restcountries.com/v3.1/all");
            const countries = await restCountriesRes.json();

            // Filter only popular holiday destinations
            const filteredCountries = countries.filter(country =>
                popularDestinations.includes(country.name.common)
            );

            return filteredCountries.map(country => ({
                name: country.name.common,
                flag: country.flags?.png || "placeholder.jpg",
                capital: country.capital ? country.capital[0] : "Unknown",
                region: country.region || "Unknown",
                population: country.population || 0,
                wikiLink: `https://en.wikipedia.org/wiki/${encodeURIComponent(country.name.common)}`
            }));
        } catch (error) {
            console.error("Error fetching countries:", error);
            return [];
        }
    }

    async function displayCountries() {
        console.log("Running displayCountries()...");

        const countries = await fetchTopHolidayDestinations();

        if (countrySection) {
            countrySection.innerHTML = ""; // Clear previous content
        }

        // Sort countries: First by votes (descending), then alphabetically
        countries.sort((a, b) => {
            const votesA = votes[a.name] || 0;
            const votesB = votes[b.name] || 0;

            // Sort by vote count first
            if (votesB !== votesA) return votesB - votesA;

            // Then alphabetically if vote count is the same
            return a.name.localeCompare(b.name);
        });

        countries.forEach(country => {
            const countryCard = document.createElement("div");
            countryCard.classList.add("country-card");
            countryCard.dataset.country = country.name;

            countryCard.innerHTML = `
                <img src="${country.flag}" alt="${country.name}">
                <h3>${country.name}</h3>
                <p><strong>Capital:</strong> ${country.capital}</p>
                <p><strong>Region:</strong> ${country.region}</p>
                <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                <a href="${country.wikiLink}" target="_blank">Learn More</a>
                <p>Votes: <span class="vote-count">${votes[country.name] || 0}</span></p>
                <button class="vote-btn">Vote</button>
            `;

            countrySection.appendChild(countryCard);
        });
    }

    // 🔎 Search functionality - filter countries based on search input
    function filterCountries(searchTerm) {
        const countryCards = document.querySelectorAll(".country-card");
        searchTerm = searchTerm.toLowerCase();

        countryCards.forEach(card => {
            const countryName = card.dataset.country.toLowerCase();
            card.style.display = countryName.includes(searchTerm) ? "block" : "none";
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const searchTerm = searchInput.value.trim();
            filterCountries(searchTerm);
        });
    }

    function updateVoteDisplay() {
        document.querySelectorAll(".country-card").forEach(card => {
            const country = card.dataset.country;
            if (!country) return;
            const voteCount = votes[country] || 0;
            const voteSpan = card.querySelector(".vote-count");
            if (voteSpan) voteSpan.textContent = voteCount;
        });
    }

    function updateTopVotedCountries() {
        const topVotedSection = document.getElementById("topVotedCountries");
        if (!topVotedSection) return;

        // Sort countries by highest votes (descending order) and take the top 5
        const sortedCountries = Object.entries(votes)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        topVotedSection.innerHTML = ""; // Clear existing content

        sortedCountries.forEach(([country]) => {
            const imageName = country.toLowerCase().replace(/ /g, "-") + ".jpg";
            const imageUrl = `images/countries/${imageName}`;

            const card = document.createElement("div");
            card.classList.add("country-card");
            card.innerHTML = `
                <img src="${imageUrl}" alt="${country}" onerror="this.src='images/countries/placeholder.jpg'">
                <h3>${country}</h3>
                <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(country)}" target="_blank">Explore</a>
            `;
            topVotedSection.appendChild(card);
        });

        setupCarousel(); // Call function to enable carousel functionality
    }

    // Function to enable carousel navigation
    function setupCarousel() {
        const carousel = document.querySelector(".carousel");
        const prevBtn = document.querySelector(".carousel-btn.prev");
        const nextBtn = document.querySelector(".carousel-btn.next");
    
        if (!carousel) return;
    
        const scrollStep = 270; // Width of each card + gap
        const visibleSlides = 5; // Number of slides visible at a time
        let isTransitioning = false;
        
        const slides = [...carousel.children];
        const totalSlides = slides.length;
    
        // Clone all slides to create a seamless effect
        slides.forEach(slide => {
            const cloneFront = slide.cloneNode(true);
            const cloneBack = slide.cloneNode(true);
            carousel.appendChild(cloneFront); // Append clones to the end
            carousel.insertBefore(cloneBack, carousel.firstChild); // Append clones to the start
        });
    
        const fullSlideCount = carousel.children.length; // Updated count after cloning
        let currentIndex = totalSlides; // Start at the first real slide set
    
        // Move to the first real set (skip cloned slides at the start)
        carousel.style.transition = "none";
        carousel.style.transform = `translateX(-${scrollStep * currentIndex}px)`;
    
        function moveCarousel(direction) {
            if (isTransitioning) return;
            isTransitioning = true;
    
            if (direction === "next") {
                currentIndex++;
            } else {
                currentIndex--;
            }
    
            carousel.style.transition = "transform 0.5s ease-in-out";
            carousel.style.transform = `translateX(-${currentIndex * scrollStep}px)`;
    
            setTimeout(() => {
                if (currentIndex >= fullSlideCount - visibleSlides) {
                    // Reset instantly to the real first slide
                    carousel.style.transition = "none";
                    currentIndex = totalSlides;
                    carousel.style.transform = `translateX(-${currentIndex * scrollStep}px)`;
                } else if (currentIndex <= visibleSlides - 1) {
                    // Reset instantly to the real last slide
                    carousel.style.transition = "none";
                    currentIndex = fullSlideCount - (visibleSlides * 2);
                    carousel.style.transform = `translateX(-${currentIndex * scrollStep}px)`;
                }
                setTimeout(() => {
                    carousel.style.transition = "transform 0.5s ease-in-out";
                    isTransitioning = false;
                }, 50);
            }, 500);
        }
    
        // Click Events for Buttons
        nextBtn.addEventListener("click", () => moveCarousel("next"));
        prevBtn.addEventListener("click", () => moveCarousel("prev"));
    }
    
    
    
    
    
    // Event delegation ensures voting works on dynamically loaded content
    document.body.addEventListener("click", (e) => {
        if (e.target.classList.contains("vote-btn")) {
            const countryCard = e.target.closest(".country-card");
            const country = countryCard.dataset.country;

            if (!country) {
                console.error("Missing country data attribute!");
                return;
            }

            // Increase vote count
            votes[country] = (votes[country] || 0) + 1;

            // Save updated votes to localStorage
            localStorage.setItem("countryVotes", JSON.stringify(votes));

            // Update UI
            updateVoteDisplay();
            updateTopVotedCountries();
        }
    });

    // Load country data and initialize vote displays
    if (countrySection) {
        await displayCountries(); // Ensure only one execution
    }
    updateVoteDisplay();
    updateTopVotedCountries();
});
