document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("companySearch");
  const industryFilter = document.getElementById("industryFilter");
  const grid = document.getElementById("companyGrid");
  const resultCount = document.getElementById("resultCount");
  const noResults = document.getElementById("noResults");

  // These elements exist only on companies.html.
  if (!searchInput || !industryFilter || !grid) return;

  let allCompanies = [];

  function normalizeIndustry(value) {
    const key = String(value || "").toLowerCase();
    if (key.includes("technology")) return "technology";
    if (key.includes("it") || key.includes("services")) return "it-services";
    if (key.includes("consult")) return "consulting";
    if (key.includes("financ") || key.includes("bank")) return "finance";
    return key.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function renderCompanies() {
    const query = searchInput.value.toLowerCase().trim();
    const selectedIndustry = industryFilter.value;
    const filtered = allCompanies.filter(company => {
      const name = String(company.name || "").toLowerCase();
      const industry = normalizeIndustry(company.industry);
      const searchable = [
        company.name, company.industry, company.location, company.description
      ].map(value => String(value || "")).join(" ").toLowerCase();
      return searchable.includes(query) &&
        (selectedIndustry === "all" || industry === selectedIndustry);
    });

    grid.replaceChildren();

    filtered.forEach(company => {
      const card = document.createElement("article");
      card.className = "company-card searchable-company";
      card.dataset.name = String(company.name || "").toLowerCase();
      card.dataset.industry = normalizeIndustry(company.industry);

      const icon = document.createElement("div");
      icon.className = "company-icon";
      icon.textContent = String(company.name || "C").trim().charAt(0).toUpperCase();

      const title = document.createElement("h3");
      title.textContent = company.name || "Company";

      const industry = document.createElement("p");
      industry.textContent = company.industry || "Other";

      const description = document.createElement("p");
      description.className = "company-description";
      description.textContent = company.description || "Visit the company's official website for more information.";

      const careersLink = document.createElement("a");
      careersLink.className = "text-link";
      careersLink.textContent = "Careers ↗";
      careersLink.href = company.careersUrl || company.website || "https://placements.spit.ac.in/";
      careersLink.target = "_blank";
      careersLink.rel = "noopener noreferrer";

      const location = document.createElement("p");
      location.textContent = company.location ? "Location: " + company.location : "";

      const sampleNotice = document.createElement("p");
      sampleNotice.className = "company-description";
      sampleNotice.textContent = company.isSample
        ? "Illustrative listing — not a confirmed SPIT recruiter."
        : "";

      card.append(icon, title, industry, description);
      if (location.textContent) card.appendChild(location);
      card.append(careersLink);
      if (sampleNotice.textContent) card.appendChild(sampleNotice);
      grid.appendChild(card);
    });

    if (resultCount) {
      resultCount.textContent = filtered.length +
        (filtered.length === 1 ? " company found" : " companies found");
    }
    if (noResults) noResults.hidden = filtered.length !== 0;
    if (filtered.length === 0 && noResults) {
      noResults.hidden = false;
    }
  }

  async function loadCompanies() {
    if (resultCount) resultCount.textContent = "Loading companies...";
    try {
      const response = await fetch("/api/companies");
      if (!response.ok) throw new Error("Server returned " + response.status);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Companies API did not return a list.");
      allCompanies = data;

      // Build industry options dynamically, preserving the existing filter.
      const existing = new Set(Array.from(industryFilter.options).map(option => option.value));
      [...new Set(allCompanies.map(company => normalizeIndustry(company.industry)).filter(Boolean))]
        .forEach(value => {
          if (!existing.has(value)) {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = value.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
            industryFilter.appendChild(option);
          }
        });

      renderCompanies();
      if (!allCompanies.length && resultCount) {
        resultCount.textContent = "No companies in the database yet. Run node seed.js to add sample records.";
      }
    } catch (error) {
      console.error("Unable to load companies:", error);
      if (resultCount) resultCount.textContent = "Could not load companies. Ensure the server is running and refresh.";
      if (noResults) {
        noResults.hidden = false;
        noResults.textContent = "Could not load companies from MongoDB. Check the server terminal.";
      }
    }
  }

  searchInput.addEventListener("input", renderCompanies);
  industryFilter.addEventListener("change", renderCompanies);
  loadCompanies();
});document.addEventListener("DOMContentLoaded", function () {
  // Stop safely if Chart.js has not loaded
  if (typeof Chart === "undefined") {
    console.error("Chart.js is not loaded.");
    return;
  }

  // Chart 1: Student Placement Status
  const statusCanvas = document.getElementById("placementStatusChart");

  if (statusCanvas && !Chart.getChart(statusCanvas)) {
    new Chart(statusCanvas, {
      type: "doughnut",

      data: {
        labels: ["Placed", "Unplaced", "Ineligible"],
        datasets: [
          {
            data: [402, 10, 35],
            backgroundColor: ["#5145cd", "#f59e0b", "#cbd5e1"],
            borderColor: "#ffffff",
            borderWidth: 3,
            hoverOffset: 8,
          },
        ],
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const total = context.dataset.data.reduce(
                  (sum, value) => sum + value,
                  0,
                );

                const percentage = ((context.raw / total) * 100).toFixed(1);

                return `${context.label}: ${context.raw} (${percentage}%)`;
              },
            },
          },
        },
      },
    });
  }

  // Chart 2: Placements by Category
  const categoryCanvas = document.getElementById("placementCategoryChart");

  if (categoryCanvas && !Chart.getChart(categoryCanvas)) {
    new Chart(categoryCanvas, {
      type: "pie",

      data: {
        labels: ["Elite", "Super Dream", "Dream", "Normal"],
        datasets: [
          {
            data: [84, 214, 60, 44],
            backgroundColor: ["#5145cd", "#7c70ed", "#f59e0b", "#38bdf8"],
            borderColor: "#ffffff",
            borderWidth: 3,
            hoverOffset: 8,
          },
        ],
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const total = context.dataset.data.reduce(
                  (sum, value) => sum + value,
                  0,
                );

                const percentage = ((context.raw / total) * 100).toFixed(1);

                return `${context.label}: ${context.raw} (${percentage}%)`;
              },
            },
          },
        },
      },
    });
  }

  // Chart 3: Average CTC by Branch
  const ctcCanvas = document.getElementById("branchCtcChart");

  if (ctcCanvas && !Chart.getChart(ctcCanvas)) {
    new Chart(ctcCanvas, {
      type: "bar",

      data: {
        labels: ["COMP", "CSE-AIML", "EXTC", "CSE-DS", "MCA"],

        datasets: [
          {
            label: "Average CTC (LPA)",
            data: [13.32, 14.67, 11.07, 15.48, 8.16],
            backgroundColor: [
              "#5145cd",
              "#7c70ed",
              "#a99ff5",
              "#38bdf8",
              "#f59e0b",
            ],
            borderRadius: 7,
            maxBarThickness: 55,
          },
        ],
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,

        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Average CTC (LPA)",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },

        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `Average CTC: ₹${context.raw} LPA`;
              },
            },
          },
        },
      },
    });
  }
});
