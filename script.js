

document.addEventListener("DOMContentLoaded", function () {
    // Stop safely if Chart.js has not loaded
    if (typeof Chart === "undefined") {
        console.error("Chart.js is not loaded.");
        return;
    }

    // Chart 1: Student Placement Status
    const statusCanvas =
        document.getElementById("placementStatusChart");

    if (statusCanvas && !Chart.getChart(statusCanvas)) {
        new Chart(statusCanvas, {
            type: "doughnut",

            data: {
                labels: ["Placed", "Unplaced", "Ineligible"],
                datasets: [{
                    data: [402, 10, 35],
                    backgroundColor: [
                        "#5145cd",
                        "#f59e0b",
                        "#cbd5e1"
                    ],
                    borderColor: "#ffffff",
                    borderWidth: 3,
                    hoverOffset: 8
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom"
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const total =
                                    context.dataset.data.reduce(
                                        (sum, value) => sum + value, 0
                                    );

                                const percentage =
                                    (context.raw / total * 100).toFixed(1);

                                return `${context.label}: ${context.raw} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Chart 2: Placements by Category
    const categoryCanvas =
        document.getElementById("placementCategoryChart");

    if (categoryCanvas && !Chart.getChart(categoryCanvas)) {
        new Chart(categoryCanvas, {
            type: "pie",

            data: {
                labels: ["Elite", "Super Dream", "Dream", "Normal"],
                datasets: [{
                    data: [84, 214, 60, 44],
                    backgroundColor: [
                        "#5145cd",
                        "#7c70ed",
                        "#f59e0b",
                        "#38bdf8"
                    ],
                    borderColor: "#ffffff",
                    borderWidth: 3,
                    hoverOffset: 8
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom"
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const total =
                                    context.dataset.data.reduce(
                                        (sum, value) => sum + value, 0
                                    );

                                const percentage =
                                    (context.raw / total * 100).toFixed(1);

                                return `${context.label}: ${context.raw} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Chart 3: Average CTC by Branch
    const ctcCanvas =
        document.getElementById("branchCtcChart");

    if (ctcCanvas && !Chart.getChart(ctcCanvas)) {
        new Chart(ctcCanvas, {
            type: "bar",

            data: {
                labels: [
                    "COMP",
                    "CSE-AIML",
                    "EXTC",
                    "CSE-DS",
                    "MCA"
                ],

                datasets: [{
                    label: "Average CTC (LPA)",
                    data: [13.32, 14.67, 11.07, 15.48, 8.16],
                    backgroundColor: [
                        "#5145cd",
                        "#7c70ed",
                        "#a99ff5",
                        "#38bdf8",
                        "#f59e0b"
                    ],
                    borderRadius: 7,
                    maxBarThickness: 55
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Average CTC (LPA)"
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },

                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `Average CTC: ₹${context.raw} LPA`;
                            }
                        }
                    }
                }
            }
        });
    }
});