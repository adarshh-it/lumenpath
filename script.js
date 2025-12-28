/**
 * LUMENPATH CORE ENGINE
 * Logic for Skill Analysis & Roadmap Generation
 */

// 1. Data Definitions
const database = {
    "data-scientist": {
        title: "Senior Data Scientist",
        skills: ["Python", "Machine Learning", "SQL", "Statistics", "Cloud"],
        benchmarks: [90, 85, 80, 80, 70],
        userLevel: [75, 40, 85, 60, 30] 
    },
    "frontend-developer": {
        title: "Senior Frontend Engineer",
        skills: ["React", "TypeScript", "Tailwind CSS", "Testing", "System Design"],
        benchmarks: [90, 85, 80, 75, 70],
        userLevel: [80, 50, 90, 40, 30]
    }
};

const courses = [
    { skill: "System Design", title: "Distributed Systems Mastery", provider: "ByteByteGo", type: "Course" },
    { skill: "TypeScript", title: "Advanced TypeScript Patterns", provider: "Frontend Masters", type: "Workshop" },
    { skill: "Machine Learning", title: "Deep Learning Specialization", provider: "Coursera", type: "Degree" },
    { skill: "Testing", title: "End-to-End Testing with Cypress", provider: "Udemy", type: "Certification" },
    { skill: "Cloud", title: "AWS Solutions Architect", provider: "Amazon", type: "Certification" },
    { skill: "Statistics", title: "Inferential Stats for Data Science", provider: "Khan Academy", type: "Course" }
];

let myChart = null;

// 2. Main Functions
function runDiagnostic() {
    const selectedRole = document.getElementById('roleSelect').value;
    const data = database[selectedRole];
    
    // Initialize/Refresh Icons
    lucide.createIcons();
    
    // Update UI Components
    updateChart(data);
    updateGaps(data);
    updateRoadmap(data);
}

function updateChart(data) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    
    // Destroy previous chart instance to prevent memory leaks/glitches
    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: data.skills,
            datasets: [{
                label: 'Your Current Level',
                data: data.userLevel,
                backgroundColor: 'rgba(34, 211, 238, 0.2)',
                borderColor: '#22d3ee',
                borderWidth: 3,
                pointBackgroundColor: '#22d3ee',
                pointRadius: 4
            }, {
                label: 'Market Benchmark',
                data: data.benchmarks,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                borderWidth: 2,
                borderDash: [5, 5],
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    grid: { color: '#334155' },
                    angleLines: { color: '#334155' },
                    pointLabels: { 
                        color: '#94a3b8', 
                        font: { size: 11, weight: 'bold' } 
                    },
                    ticks: { display: false },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#f1f5f9', padding: 20 }
                }
            }
        }
    });
}

function updateGaps(data) {
    const container = document.getElementById('gapContainer');
    container.innerHTML = '';

    data.skills.forEach((skill, index) => {
        const gap = data.benchmarks[index] - data.userLevel[index];
        
        if (gap > 0) {
            container.innerHTML += `
                <div class="bg-slate-800/60 border border-slate-700 p-4 rounded-2xl flex justify-between items-center transition-all hover:border-slate-500">
                    <div>
                        <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">${skill}</p>
                        <p class="text-xl font-bold text-white">${gap}% Gap</p>
                    </div>
                    <div class="h-1.5 w-16 bg-slate-700 rounded-full overflow-hidden">
                        <div class="h-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" style="width: ${gap}%"></div>
                    </div>
                </div>
            `;
        }
    });
}

function updateRoadmap(data) {
    const container = document.getElementById('roadmapContainer');
    container.innerHTML = '';

    const weakSkills = data.skills.filter((skill, index) => data.userLevel[index] < data.benchmarks[index]);

    if (weakSkills.length === 0) {
        container.innerHTML = '<p class="text-emerald-400 text-sm italic">You are fully optimized for this role!</p>';
        return;
    }

    weakSkills.forEach(skill => {
        const match = courses.find(c => c.skill === skill);
        if (match) {
            container.innerHTML += `
                <div class="p-4 bg-slate-900/50 border border-slate-700 rounded-2xl hover:border-cyan-500/50 transition-all group cursor-pointer">
                    <div class="flex justify-between items-start mb-2">
                         <span class="text-[9px] font-black text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded uppercase border border-cyan-400/20">${match.type}</span>
                         <i data-lucide="external-link" size="14" class="text-slate-600 group-hover:text-cyan-400 transition-colors"></i>
                    </div>
                    <h3 class="font-bold text-slate-200 group-hover:text-white">${match.title}</h3>
                    <p class="text-xs text-slate-500 mt-1">${match.provider} • Target: ${skill}</p>
                </div>
            `;
        }
    });
    
    // Re-render icons for new content
    lucide.createIcons();
}

// 3. Lifecycle Setup
window.onload = () => {
    runDiagnostic();
};
