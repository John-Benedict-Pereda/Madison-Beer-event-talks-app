document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule');
    const searchInput = document.getElementById('categorySearch');
    let allTalks = [];

    // Fetch schedule data from the API
    async function fetchSchedule() {
        try {
            const response = await fetch('/api/schedule');
            allTalks = await response.json();
            renderSchedule(allTalks);
        } catch (error) {
            console.error('Error fetching schedule:', error);
            scheduleContainer.innerHTML = '<p class="error">Failed to load schedule. Please try again later.</p>';
        }
    }

    // Render schedule items to the page
    function renderSchedule(talks) {
        if (talks.length === 0) {
            scheduleContainer.innerHTML = '<p class="no-results">No talks found matching that category.</p>';
            return;
        }

        scheduleContainer.innerHTML = talks.map(talk => `
            <div class="talk-card ${talk.isBreak ? 'break' : ''}">
                <span class="talk-time">🕒 ${talk.startTime} - ${talk.endTime}</span>
                <h2 class="talk-title">${talk.title}</h2>
                ${talk.speakers.length > 0 ? `<p class="talk-speakers">🎙️ ${talk.speakers.join(', ')}</p>` : ''}
                <p class="talk-description">${talk.description}</p>
                <div class="tag-list">
                    ${talk.categories.map(cat => `<span class="tag">${cat}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }

    // Live Filter logic
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        const filteredTalks = allTalks.filter(talk => {
            // Include breaks in the list if the search is empty
            if (!searchTerm && talk.isBreak) return true;
            
            // Search in categories
            const categoryMatch = talk.categories.some(cat => 
                cat.toLowerCase().includes(searchTerm)
            );

            // Search in title as well for better UX
            const titleMatch = talk.title.toLowerCase().includes(searchTerm);

            return categoryMatch || titleMatch;
        });

        renderSchedule(filteredTalks);
    });

    fetchSchedule();
});
