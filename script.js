document.addEventListener("DOMContentLoaded", async () => {
    console.log("Script loaded successfully!");

    const topVotedSection = document.getElementById("topVotedCountries");
    const countrySection = document.querySelector(".destination-list");
    const searchInput = document.getElementById("searchInput");
    const menuToggle = document.getElementById("menuToggle");
    const navbarMenu = document.getElementById("navbarMenu");

    // Ensure the elements exist before adding event listeners
    if (!menuToggle || !navbarMenu) {
        console.error("Navbar elements not found on this page.");
        return;
    }
    
    // Toggle menu when clicking the button
    menuToggle.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevent closing immediately
        navbarMenu.classList.toggle("active");
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (event) {
        if (!menuToggle.contains(event.target) && !navbarMenu.contains(event.target)) {
            navbarMenu.classList.remove("active");
        }
    });

    // Prevent the menu from closing when clicking inside
    navbarMenu.addEventListener("click", function (event) {
        event.stopPropagation();
    });
    

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
    
        // Sort by highest votes and take the top 5
        const sortedCountries = Object.entries(votes)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
    
        topVotedSection.innerHTML = ""; // Clear previous content
    
        sortedCountries.forEach(([country], index) => {
            const imageName = country.toLowerCase().replace(/ /g, "-") + ".jpg";
            const imageUrl = `images/countries/${imageName}`;
    
            const isActive = index === 0 ? "active" : ""; // First item needs "active" class
    
            const card = `
                <div class="carousel-item ${isActive}">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-md-10">
                                <div class="card">
                                    <img src="${imageUrl}" class="card-img-top" alt="${country}" onerror="this.src='images/countries/placeholder.jpg'">
                                    <div class="card-body">
                                        <h5 class="card-title">${country}</h5>
                                        <p class="card-text">Explore the beauty of ${country}.</p>
                                        <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(country)}" target="_blank" class="btn btn-primary">Learn More</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
    
            topVotedSection.innerHTML += card;
        });
    
        // 🛠 Delay carousel reinitialization to ensure DOM is updated
        setTimeout(() => {
            reinitialiseCarousel();
        }, 500);
    }
    

    function reinitialiseCarousel() {
        let carouselElement = document.querySelector("#topVotedCarousel");
    
        if (!carouselElement) {
            console.error("Carousel element not found.");
            return;
        }
    
        // Force Bootstrap to reinitialize the carousel
        let bsCarousel = bootstrap.Carousel.getInstance(carouselElement);
        if (bsCarousel) {
            bsCarousel.dispose(); // Remove old instance
        }
    
        bsCarousel = new bootstrap.Carousel(carouselElement, {
            interval: 5000, // Auto-slide every 5 seconds
            wrap: true // Enables infinite looping
        });
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
