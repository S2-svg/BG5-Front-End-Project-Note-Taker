let currentView = "all";
let editingNoteId = null;
let autoSaveTimer = null;

// Initialize with empty arrays, will be loaded based on user
let notes = [];
let tasks = [];
let events = [];

// User Profile Functions
function initUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userNameEl = document.getElementById('userName');
    const userEmailEl = document.getElementById('userEmail');
    const userAvatar = document.getElementById('userAvatar');
    
    if (currentUser && currentUser.loggedIn) {
        // User is logged in
        userNameEl.innerText = `Welcome back, ${currentUser.name} 👋`;
        
        if (userEmailEl) {
            userEmailEl.innerText = currentUser.email;
        }
        
        if (userAvatar && currentUser.name) {
            // Create initials from name
            const initials = currentUser.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .substring(0, 2);
            userAvatar.innerText = initials;
            userAvatar.style.background = getRandomGradient();
        }
        
        // Load user-specific data
        loadUserData();
    } else {
        // Guest mode
        userNameEl.innerText = 'Welcome back, Guest 👋';
        if (userEmailEl) {
            userEmailEl.innerText = 'Sign in to sync your data';
        }
        if (userAvatar) {
            userAvatar.innerText = 'G';
            userAvatar.style.background = 'linear-gradient(135deg, #666, #999)';
        }
        
        // Load default/guest data
        loadGuestData();
    }
}

function getRandomGradient() {
    const gradients = [
        'linear-gradient(135deg, var(--primary), #3b82f6)',
        'linear-gradient(135deg, #10b981, #059669)',
        'linear-gradient(135deg, #f59e0b, #d97706)',
        'linear-gradient(135deg, #8b5cf6, #7c3aed)',
        'linear-gradient(135deg, #ef4444, #dc2626)'
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
}

function loadUserData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.email) {
        const userData = JSON.parse(localStorage.getItem(`user_${currentUser.email}`));
        
        if (userData) {
            // Load user's saved data
            notes = userData.notes || [];
            tasks = userData.tasks || [];
            events = userData.events || [];
        } else {
            // Initialize empty arrays for new user
            notes = [];
            tasks = [];
            events = [];
        }
        
        // Update localStorage for current session
        localStorage.setItem("saved-notes", JSON.stringify(notes));
        localStorage.setItem("saved-tasks", JSON.stringify(tasks));
        localStorage.setItem("saved-events", JSON.stringify(events));
    }
}

function loadGuestData() {
    // Load guest/default data
    const defaultNotes = [
        {
            id: 1,
            title: "Q1 Revenue Growth",
            content: "Focus on expansion into the APAC region...",
            tag: "Strategy",
            pinned: false,
            starred: true,
            archived: false,
            deleted: false,
            color: "transparent",
            createdAt: new Date("2024-01-15").getTime(),
        },
        {
            id: 2,
            title: "Brand Guidelines v2",
            content: "Updated color palette including the new emerald...",
            tag: "Design",
            pinned: false,
            starred: false,
            archived: false,
            deleted: false,
            color: "transparent",
            createdAt: new Date("2024-01-10").getTime(),
        },
        {
            id: 3,
            title: "Weekly Team Meeting",
            content: "Discuss project timelines and resource allocation...",
            tag: "Meeting",
            pinned: true,
            starred: false,
            archived: false,
            deleted: false,
            color: "#3b82f6",
            createdAt: new Date("2024-01-05").getTime(),
        },
        {
            id: 4,
            title: "Personal Goals 2024",
            content: "1. Learn React Native\n2. Read 24 books\n3. Travel to Japan",
            tag: "Personal",
            pinned: false,
            starred: true,
            archived: true,
            deleted: false,
            color: "#f59e0b",
            createdAt: new Date("2024-01-01").getTime(),
        },
        {
            id: 5,
            title: "Old Project Notes",
            content: "This note is in trash...",
            tag: "Archived",
            pinned: false,
            starred: false,
            archived: false,
            deleted: true,
            deletedAt: new Date("2024-01-20").getTime(),
            color: "transparent",
            createdAt: new Date("2023-12-15").getTime(),
        },
    ];
    
    const defaultTasks = [
        {
            id: 1,
            text: "Review PR for dashboard",
            done: false,
            createdAt: Date.now(),
        },
        {
            id: 2,
            text: "Weekly team sync",
            done: true,
            createdAt: Date.now() - 86400000,
        },
        {
            id: 3,
            text: "Update documentation",
            done: false,
            createdAt: Date.now() - 172800000,
        },
    ];
    
    const defaultEvents = [
        {
            id: 1,
            title: "Design Review",
            time: "20m",
            date: new Date(Date.now() + 1200000).toISOString(),
        },
        {
            id: 2,
            title: "Client Meeting",
            time: "2:00 PM",
            date: new Date().setHours(14, 0, 0, 0),
        },
        {
            id: 3,
            title: "Project Deadline",
            time: "Tomorrow",
            date: new Date(Date.now() + 86400000).toISOString(),
        },
    ];
    
    notes = JSON.parse(localStorage.getItem("guest_notes")) || defaultNotes;
    tasks = JSON.parse(localStorage.getItem("guest_tasks")) || defaultTasks;
    events = JSON.parse(localStorage.getItem("guest_events")) || defaultEvents;
    
    // Save to session storage
    localStorage.setItem("saved-notes", JSON.stringify(notes));
    localStorage.setItem("saved-tasks", JSON.stringify(tasks));
    localStorage.setItem("saved-events", JSON.stringify(events));
}

// Update the logout function
function logout() {
    if (confirm("Are you sure you want to logout?")) {
        // Save current data to appropriate storage before logout
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.email) {
            // Save to user's storage
            const userData = JSON.parse(localStorage.getItem(`user_${currentUser.email}`)) || {};
            userData.notes = notes;
            userData.tasks = tasks;
            userData.events = events;
            localStorage.setItem(`user_${currentUser.email}`, JSON.stringify(userData));
        } else {
            // Save to guest storage
            localStorage.setItem("guest_notes", JSON.stringify(notes));
            localStorage.setItem("guest_tasks", JSON.stringify(tasks));
            localStorage.setItem("guest_events", JSON.stringify(events));
        }
        
        // Clear current session
        localStorage.removeItem('currentUser');
        localStorage.removeItem('saved-notes');
        localStorage.removeItem('saved-tasks');
        localStorage.removeItem('saved-events');
        
        // Redirect to sign in page
        alert("Logged out successfully!");
        window.location.href = "/index.html";
    }
}

// Archive and Trash Functions
function toggleArchive(id) {
    const note = notes.find((n) => n.id === id);
    if (note) {
        note.archived = !note.archived;
        note.updatedAt = Date.now();
        // If archiving, unpin it
        if (note.archived) {
            note.pinned = false;
        }
        saveAndRefresh();
    }
}

function deletePermanently(id) {
    if (confirm("Permanently delete this note? This action cannot be undone.")) {
        const noteIndex = notes.findIndex((n) => n.id === id);
        if (noteIndex !== -1) {
            notes.splice(noteIndex, 1);
            saveAndRefresh();
        }
    }
}

function restoreNote(id) {
    const note = notes.find((n) => n.id === id);
    if (note) {
        note.deleted = false;
        note.deletedAt = null;
        note.archived = false;
        saveAndRefresh();
    }
}

function emptyTrash() {
    const deletedNotes = notes.filter(n => n.deleted);
    if (deletedNotes.length > 0 && confirm(`Permanently delete all ${deletedNotes.length} notes in trash? This action cannot be undone.`)) {
        notes = notes.filter((n) => !n.deleted);
        saveAndRefresh();
    }
}

function restoreAllNotes() {
    const deletedNotes = notes.filter(n => n.deleted);
    if (deletedNotes.length > 0 && confirm(`Restore all ${deletedNotes.length} notes from trash?`)) {
        notes.forEach(n => {
            if (n.deleted) {
                n.deleted = false;
                n.deletedAt = null;
            }
        });
        saveAndRefresh();
    }
}

// View Functions
function setView(view) {
    currentView = view;
    const title = document.getElementById("gridTitle");
    const subtitle = document.getElementById("gridSubtitle");
    let icon = '<i data-lucide="pin" style="color: var(--primary)"></i>';
    let text = "My Notes";
    let subtext = "All your notes in one place";

    switch (view) {
        case "starred":
            icon = '<i data-lucide="star" style="color: #fbbf24"></i>';
            text = "Starred Notes";
            subtext = "Your favorite notes";
            break;
        case "pinned":
            icon = '<i data-lucide="pin" style="color: var(--primary)"></i>';
            text = "Pinned Notes";
            subtext = "Important notes at the top";
            break;
        case "recent":
            icon = '<i data-lucide="history" style="color: var(--primary)"></i>';
            text = "Recent Notes";
            subtext = "Recently created or updated";
            break;
        case "notebooks":
            icon = '<i data-lucide="folder" style="color: var(--primary)"></i>';
            text = "Notebooks";
            subtext = "Organized by notebooks";
            break;
        case "archive":
            icon = '<i data-lucide="archive" style="color: var(--primary)"></i>';
            text = "Archived Notes";
            subtext = "Notes you want to keep but don't need often";
            break;
        case "trash":
            icon = '<i data-lucide="trash-2" style="color: var(--danger)"></i>';
            text = "Trash";
            subtext = "Deleted notes are moved here";
            break;
    }

    title.innerHTML = `${icon} ${text}`;
    if (subtitle) {
        subtitle.innerHTML = subtext;
    }
    updateNavLinks(view);
    renderNotes();
    
    // Add trash management buttons if in trash view
    if (view === "trash") {
        const trashNotes = notes.filter(n => n.deleted);
        if (trashNotes.length > 0) {
            const grid = document.getElementById("notesGrid");
            const managementDiv = document.createElement("div");
            managementDiv.className = "trash-management";
            managementDiv.innerHTML = `
                <button class="trash-btn empty-trash-btn" onclick="emptyTrash()">
                    <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
                    Empty Trash (${trashNotes.length})
                </button>
                <button class="trash-btn restore-all-btn" onclick="restoreAllNotes()">
                    <i data-lucide="refresh-ccw" style="width: 16px; height: 16px;"></i>
                    Restore All
                </button>
            `;
            grid.parentNode.insertBefore(managementDiv, grid);
        }
    }
    
    refreshIcons();
}

function updateNavLinks(activeView) {
    document.querySelectorAll(".nav-links a").forEach((link) => {
        link.classList.remove("active");
    });

    const activeLink = document.querySelector(
        `.nav-links a[onclick*="setView('${activeView}')"]`
    );
    if (activeLink) {
        activeLink.classList.add("active");
    }
}

function changeBg(color, btnElement = null) {
    document.documentElement.style.setProperty("--bg-dark", color);
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16) || 0;
    const g = parseInt(hex.substr(2, 2), 16) || 0;
    const b = parseInt(hex.substr(4, 2), 16) || 0;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    if (brightness > 155) document.body.classList.add("light-mode");
    else document.body.classList.remove("light-mode");
    localStorage.setItem("notetaker-theme", color);

    if (btnElement) {
        document
            .querySelectorAll(".color-btn")
            .forEach((btn) => btn.classList.remove("active"));
        btnElement.classList.add("active");
    }
}

function renderNotes(filter = "") {
    const grid = document.getElementById("notesGrid");
    grid.innerHTML = "";

    let filteredNotes = [...notes];
    
    // Apply search filter
    if (filter) {
        filteredNotes = filteredNotes.filter(
            (n) =>
                n.title.toLowerCase().includes(filter.toLowerCase()) ||
                n.content.toLowerCase().includes(filter.toLowerCase()) ||
                n.tag.toLowerCase().includes(filter.toLowerCase())
        );
    }
    
    // Apply view filters
    switch (currentView) {
        case "starred":
            filteredNotes = filteredNotes.filter((n) => n.starred && !n.deleted && !n.archived);
            break;
        case "pinned":
            filteredNotes = filteredNotes.filter((n) => n.pinned && !n.deleted && !n.archived);
            break;
        case "recent":
            filteredNotes.sort((a, b) => b.createdAt - a.createdAt);
            filteredNotes = filteredNotes.filter((n) => !n.deleted && !n.archived);
            break;
        case "archive":
            filteredNotes = filteredNotes.filter((n) => n.archived && !n.deleted);
            break;
        case "trash":
            filteredNotes = filteredNotes.filter((n) => n.deleted);
            // Sort by deletion date (most recent first)
            filteredNotes.sort((a, b) => (b.deletedAt || 0) - (a.deletedAt || 0));
            break;
        default: // "all"
            filteredNotes = filteredNotes.filter((n) => !n.deleted && !n.archived);
            break;
    }

    // Sort: pinned notes first, then by date (except for trash)
    if (currentView !== "trash") {
        filteredNotes.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return b.createdAt - a.createdAt;
        });
    }

    if (filteredNotes.length === 0) {
        let emptyMessage = "No notes found";
        let emptySubtext = filter ? "Try a different search term" : "Create your first note to get started!";
        let emptyIcon = "file-text";
        
        if (currentView === "archive") {
            emptyMessage = "No archived notes";
            emptySubtext = "Archive notes you want to keep but don't need often";
            emptyIcon = "archive";
        } else if (currentView === "trash") {
            emptyMessage = "Trash is empty";
            emptySubtext = "Deleted notes will appear here";
            emptyIcon = "trash";
        }
        
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <i data-lucide="${emptyIcon}" 
                   style="width: 64px; height: 64px; color: var(--text-dim); opacity: 0.3; margin-bottom: 20px;"></i>
                <h3 style="color: var(--text-dim); margin-bottom: 10px;">${emptyMessage}</h3>
                <p style="color: var(--text-dim); opacity: 0.7;">${emptySubtext}</p>
                ${currentView === 'trash' ? 
                    '<button onclick="setView(\'all\')" style="margin-top: 15px; padding: 8px 16px; background: var(--primary); color: white; border: none; border-radius: 6px; cursor: pointer;">Back to Notes</button>' 
                    : ''}
            </div>
        `;
    } else {
        filteredNotes.forEach((note) => {
            const card = document.createElement("div");
            card.className = `note-card ${note.pinned ? "pinned" : ""} ${note.archived ? "archived" : ""}`;
            if (note.color && note.color !== "transparent")
                card.style.borderTop = `4px solid ${note.color}`;

            const date = new Date(note.createdAt);
            const timeAgo = getTimeAgo(date);

            let actionButtons = '';
            let statusIndicator = '';
            
            if (currentView === "trash") {
                // Trash view: Restore and Delete Permanently buttons
                const deletedDate = note.deletedAt ? new Date(note.deletedAt) : null;
                const deletedAgo = deletedDate ? getTimeAgo(deletedDate) : 'Recently';
                statusIndicator = `<small style="color: var(--danger); font-size: 11px;">Deleted ${deletedAgo}</small>`;
                
                actionButtons = `
                    <i data-lucide="refresh-ccw" class="icon-btn" onclick="restoreNote(${note.id})" title="Restore"></i>
                    <i data-lucide="trash-2" class="icon-btn delete-btn" onclick="deletePermanently(${note.id})" title="Delete Permanently"></i>
                `;
            } else if (currentView === "archive") {
                // Archive view: Unarchive button
                statusIndicator = `<small style="color: var(--primary); font-size: 11px;">Archived</small>`;
                actionButtons = `
                    <i data-lucide="palette" class="icon-btn" onclick="changeNoteColor(${note.id})" title="Change Color"></i>
                    <i data-lucide="archive" class="icon-btn active" onclick="toggleArchive(${note.id})" title="Unarchive"></i>
                    <i data-lucide="edit-3" class="icon-btn" onclick="editNote(${note.id})" title="Edit"></i>
                    <i data-lucide="trash-2" class="icon-btn delete-btn" onclick="deleteNote(${note.id})" title="Move to Trash"></i>
                `;
            } else {
                // Regular view: All actions including Archive
                actionButtons = `
                    <i data-lucide="palette" class="icon-btn" onclick="changeNoteColor(${note.id})" title="Change Color"></i>
                    <i data-lucide="pin" class="icon-btn ${note.pinned ? "active" : ""}" onclick="togglePin(${note.id})" title="${note.pinned ? 'Unpin' : 'Pin'}"></i>
                    <i data-lucide="star" class="icon-btn ${note.starred ? "active" : ""}" onclick="toggleStar(${note.id})" style="${note.starred ? "color:#fbbf24; fill:#fbbf24" : ""}" title="${note.starred ? 'Unstar' : 'Star'}"></i>
                    <i data-lucide="archive" class="icon-btn" onclick="toggleArchive(${note.id})" title="Archive"></i>
                    <i data-lucide="edit-3" class="icon-btn" onclick="editNote(${note.id})" title="Edit"></i>
                    <i data-lucide="trash-2" class="icon-btn delete-btn" onclick="deleteNote(${note.id})" title="Move to Trash"></i>
                `;
            }

            card.innerHTML = `
                <div class="note-header">
                    <span class="tag-pill">${note.tag}</span>
                    <div class="note-actions">
                        ${actionButtons}
                    </div>
                </div>
                <h4>${note.title}</h4>
                <p>${note.content.length > 150 ? note.content.substring(0, 150) + "..." : note.content}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
                    <div>
                        <small style="color: var(--text-dim); font-size: 12px;">Created ${timeAgo}</small>
                        ${statusIndicator ? '<br/>' + statusIndicator : ''}
                    </div>
                    ${note.color && note.color !== "transparent" ? `<div style="width: 12px; height: 12px; border-radius: 50%; background: ${note.color};"></div>` : ""}
                </div>
            `;
            
            // Add visual indicators for archived/deleted notes
            if (note.archived) {
                card.style.opacity = "0.9";
                card.style.borderLeft = "3px solid var(--primary)";
            }
            if (note.deleted) {
                card.style.opacity = "0.7";
                card.style.filter = "grayscale(30%)";
            }
            
            grid.appendChild(card);
        });
    }

    document.getElementById("totalNotesCount").innerText = filteredNotes.length;
    updateQuickStats();
    refreshIcons();
}

function getTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
}

function editNote(id) {
    openNoteModal(id);
}

function deleteNote(id) {
    if (confirm("Move this note to trash?")) {
        const noteIndex = notes.findIndex((n) => n.id === id);
        if (noteIndex !== -1) {
            notes[noteIndex].deleted = true;
            notes[noteIndex].deletedAt = Date.now();
            // Also unarchive and unpin when deleted
            notes[noteIndex].archived = false;
            notes[noteIndex].pinned = false;
        }
        saveAndRefresh();
    }
}

function togglePin(id) {
    const n = notes.find((x) => x.id === id);
    n.pinned = !n.pinned;
    n.updatedAt = Date.now();
    saveAndRefresh();
}

function toggleStar(id) {
    const n = notes.find((x) => x.id === id);
    n.starred = !n.starred;
    n.updatedAt = Date.now();
    saveAndRefresh();
}

function changeNoteColor(id) {
    const colors = [
        "#10b981",
        "#3b82f6",
        "#f59e0b",
        "#ef4444",
        "#a855f7",
        "transparent",
    ];
    const note = notes.find((n) => n.id === id);
    let currentIndex = colors.indexOf(note.color || "transparent");
    let nextIndex = (currentIndex + 1) % colors.length;
    note.color = colors[nextIndex];
    note.updatedAt = Date.now();
    saveAndRefresh();
}

function renderTasks() {
    const list = document.getElementById("todoList");
    list.innerHTML = "";
    const sortedTasks = [...tasks].sort((a, b) => b.createdAt - a.createdAt);

    sortedTasks.forEach((task) => {
        const row = document.createElement("div");
        row.className = "todo-row";
        const timeAgo = getTimeAgo(new Date(task.createdAt));

        row.innerHTML = `
            <input type="checkbox" ${task.done ? "checked" : ""} onchange="toggleTask(${task.id})">
            <span class="${task.done ? "done" : ""}" style="flex: 1;">${task.text}</span>
            <small style="color: var(--text-dim); font-size: 11px;">${timeAgo}</small>
            <i data-lucide="x" onclick="deleteTask(${task.id})" style="width:12px; margin-left:8px; cursor:pointer; opacity:0.3"></i>
        `;
        list.appendChild(row);
    });
    document.getElementById("totalTasksCount").innerText = tasks.length;
    updateProductivityText();
    refreshIcons();
}

function addNewTask() {
    const t = prompt("Task:");
    if (t) {
        tasks.push({
            id: Date.now(),
            text: t,
            done: false,
            createdAt: Date.now(),
        });
        saveAndRefresh();
    }
}

function toggleTask(id) {
    tasks = tasks.map((t) =>
        t.id === id ? { ...t, done: !t.done, updatedAt: Date.now() } : t
    );
    saveAndRefresh();
}

function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    saveAndRefresh();
}

function clearCompletedTasks() {
    tasks = tasks.filter((t) => !t.done);
    saveAndRefresh();
}

function renderEvents() {
    const container = document.getElementById("upcomingEventsList");
    container.innerHTML = "";
    const sortedEvents = [...events].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );

    sortedEvents.forEach((ev) => {
        const div = document.createElement("div");
        div.className = "event-item";
        const eventDate = new Date(ev.date);
        const now = new Date();
        const diffHours = Math.floor((eventDate - now) / 3600000);

        let timeText = ev.time;
        if (diffHours > 0 && diffHours < 24) {
            timeText = `In ${diffHours}h`;
        } else if (diffHours >= 24) {
            const days = Math.floor(diffHours / 24);
            timeText = `In ${days}d`;
        }

        div.innerHTML = `
            <p style="font-size: 13px; color: var(--text-dim); margin-bottom: 4px;">${timeText}</p>
            <p style="font-weight: 700; font-size: 15px;">${ev.title}</p>
            <span style="font-size: 10px; color: var(--danger); cursor:pointer;" onclick="deleteEvent(${ev.id})">Remove</span>
        `;
        container.appendChild(div);
    });
    document.getElementById("totalEventsCount").innerText = events.length;
}

function addNewEvent() {
    const title = prompt("Event Name:");
    if (!title) return;

    const dateStr = prompt(
        "Date (YYYY-MM-DD):",
        new Date().toISOString().split("T")[0]
    );
    const timeStr = prompt("Time (HH:MM):", "14:00");

    if (dateStr && timeStr) {
        const dateTime = new Date(`${dateStr}T${timeStr}`);
        const timeDiff = dateTime - new Date();
        let timeDisplay = "";

        if (timeDiff < 3600000) {
            timeDisplay = `${Math.floor(timeDiff / 60000)}m`;
        } else if (timeDiff < 86400000) {
            timeDisplay = `${Math.floor(timeDiff / 3600000)}h`;
        } else {
            timeDisplay = `${Math.floor(timeDiff / 86400000)}d`;
        }

        events.push({
            id: Date.now(),
            title,
            time: timeDisplay,
            date: dateTime.toISOString(),
        });
        saveAndRefresh();
    }
}

function deleteEvent(id) {
    events = events.filter((e) => e.id !== id);
    saveAndRefresh();
}

function updateProductivityText() {
    const total = tasks.length;
    const done = tasks.filter((t) => t.done).length;
    const pending = total - done;

    const textElement = document.getElementById("productiveCount");
    const progressBar = document.getElementById("taskProgressBar");

    if (pending === 0 && total > 0) textElement.innerText = "All caught up! ✨";
    else if (total === 0) textElement.innerText = "No tasks for today.";
    else textElement.innerText = `You have ${pending} tasks waiting.`;

    const percentage = total === 0 ? 0 : (done / total) * 100;
    progressBar.style.width = `${percentage}%`;
}

function updateQuickStats() {
    const totalNotes = notes.filter(n => !n.deleted).length;
    const pinnedNotes = notes.filter((n) => n.pinned && !n.deleted && !n.archived).length;
    const starredNotes = notes.filter((n) => n.starred && !n.deleted && !n.archived).length;
    const archivedNotes = notes.filter((n) => n.archived && !n.deleted).length;
    const trashedNotes = notes.filter((n) => n.deleted).length;

    document.getElementById("totalNotesStat").innerText = totalNotes;
    document.getElementById("pinnedNotesStat").innerText = pinnedNotes;
    document.getElementById("starredNotesStat").innerText = starredNotes;
    
    // You can add these stats to your UI if you have elements for them
    const archivedStat = document.getElementById("archivedNotesStat");
    const trashStat = document.getElementById("trashNotesStat");
    
    if (archivedStat) archivedStat.innerText = archivedNotes;
    if (trashStat) trashStat.innerText = trashedNotes;
}

function openNoteModal(noteId = null) {
    editingNoteId = noteId;
    const modal = document.getElementById("noteModal");
    const titleInput = document.getElementById("noteTitle");
    const contentInput = document.getElementById("noteContent");
    const tagInput = document.getElementById("noteTag");
    const modalTitle = document.getElementById("modalTitle");
    if (noteId) {
        const note = notes.find((n) => n.id === noteId);
        if (note) {
            titleInput.value = note.title;
            contentInput.value = note.content;
            tagInput.value = note.tag;
            modalTitle.innerText = "Edit Note";
            
            // Show archive status in modal if archived
            if (note.archived) {
                modalTitle.innerHTML += ' <span style="font-size: 12px; color: var(--primary);">(Archived)</span>';
            }
            if (note.deleted) {
                modalTitle.innerHTML += ' <span style="font-size: 12px; color: var(--danger);">(In Trash)</span>';
            }
        }
    } else {
        titleInput.value = "";
        contentInput.value = "";
        tagInput.value = "General";
        modalTitle.innerText = "New Note";
    }

    modal.style.display = "flex";
    setTimeout(() => {
        modal.style.animation = "fadeIn 0.3s ease-out";
        titleInput.focus();
    }, 10);
    refreshIcons();
}

function closeModal() {
    const modal = document.getElementById("noteModal");
    modal.style.animation = "fadeIn 0.3s ease-out reverse";
    setTimeout(() => {
        modal.style.display = "none";
        editingNoteId = null;
    }, 300);
}

// Update the openSettings function to include user name from currentUser
function openSettings() {
    const modal = document.getElementById("settingsModal");
    const nameInput = document.getElementById("userNameInput");
    const autoSaveSelect = document.getElementById("autoSaveInterval");
    const defaultViewSelect = document.getElementById("defaultView");

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const savedName = currentUser ? currentUser.name : localStorage.getItem("notetaker-user") || "Guest";
    const savedAutoSave = localStorage.getItem("notetaker-autosave") || "30";
    const savedDefaultView = localStorage.getItem("notetaker-default-view") || "all";

    nameInput.value = savedName;
    autoSaveSelect.value = savedAutoSave;
    defaultViewSelect.value = savedDefaultView;

    modal.style.display = "flex";
    setTimeout(() => {
        modal.style.animation = "fadeIn 0.3s ease-out";
    }, 10);
    refreshIcons();
}

function closeSettingsModal() {
    const modal = document.getElementById("settingsModal");
    modal.style.animation = "fadeIn 0.3s ease-out reverse";
    setTimeout(() => {
        modal.style.display = "none";
    }, 300);
}

// Update the saveSettings function
function saveSettings() {
    const nameInput = document.getElementById("userNameInput");
    const autoSaveSelect = document.getElementById("autoSaveInterval");
    const defaultViewSelect = document.getElementById("defaultView");

    if (nameInput.value.trim()) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            // Update current user's name
            currentUser.name = nameInput.value;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update user data
            const userData = JSON.parse(localStorage.getItem(`user_${currentUser.email}`));
            if (userData) {
                userData.name = nameInput.value;
                localStorage.setItem(`user_${currentUser.email}`, JSON.stringify(userData));
            }
        }
        
        document.getElementById("userName").innerText = `Welcome back, ${nameInput.value} 👋`;
        
        // Update avatar initials
        const userAvatar = document.getElementById('userAvatar');
        if (userAvatar && nameInput.value) {
            const initials = nameInput.value
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .substring(0, 2);
            userAvatar.innerText = initials;
        }
        
        localStorage.setItem("notetaker-user", nameInput.value);
    }

    localStorage.setItem("notetaker-autosave", autoSaveSelect.value);
    localStorage.setItem("notetaker-default-view", defaultViewSelect.value);

    setupAutoSave();
    setView(defaultViewSelect.value);
    closeSettingsModal();
}

function saveNote() {
    const titleInput = document.getElementById("noteTitle");
    const contentInput = document.getElementById("noteContent");
    const tagInput = document.getElementById("noteTag");

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const tag = tagInput.value;

    if (!title || !content) {
        alert("Please fill in both title and content");
        return;
    }
    if (editingNoteId) {
        const noteIndex = notes.findIndex((n) => n.id === editingNoteId);
        if (noteIndex !== -1) {
            notes[noteIndex] = {
                ...notes[noteIndex],
                title,
                content,
                tag,
                updatedAt: Date.now(),
            };
        }
    } else {
        notes.push({
            id: Date.now(),
            title,
            content,
            tag,
            pinned: false,
            starred: false,
            archived: false,
            deleted: false,
            color: "transparent",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    }
    saveAndRefresh();
    closeModal();
}

function quickAdd(type) {
    if (type === "note") {
        openNoteModal();
    } else if (type === "task") {
        addNewTask();
    }
}

// PDF Export Functions
function exportToPDF(type = 'notes') {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    
    let title = '';
    let content = [];
    
    // Set document title and content based on type
    switch(type) {
        case 'notes':
            title = 'My Notes Export';
            content = getNotesContent();
            break;
        case 'tasks':
            title = 'My Tasks Export';
            content = getTasksContent();
            break;
        case 'events':
            title = 'My Events Export';
            content = getEventsContent();
            break;
        case 'all':
            title = 'Complete Export - Note Taker';
            content = getAllContent();
            break;
        default:
            title = 'Note Taker Export';
            content = getNotesContent();
    }
    
    // Add header
    doc.setFontSize(20);
    doc.setTextColor(40, 53, 147);
    doc.text(title, 105, 20, { align: 'center' });
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on ${currentDate} at ${currentTime}`, 105, 30, { align: 'center' });
    doc.line(10, 35, 200, 35);
    
    // Add content
    let yPos = 45;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    content.forEach((section, index) => {
        if (index > 0) {
            yPos += 10;
        }
        
        // Section title
        if (section.title) {
            doc.setFontSize(14);
            doc.setTextColor(40, 53, 147);
            doc.text(section.title, 10, yPos);
            yPos += 8;
        }
        
        // Section content
        doc.setFontSize(11);
        doc.setTextColor(50);
        
        if (section.type === 'note') {
            // Note format
            doc.setTextColor(0, 102, 204);
            doc.text(`[${section.tag}] ${section.title}`, 10, yPos);
            yPos += 7;
            
            doc.setTextColor(0, 0, 0);
            const lines = doc.splitTextToSize(section.content, 180);
            lines.forEach(line => {
                doc.text(line, 15, yPos);
                yPos += 7;
            });
            
            // Metadata
            doc.setFontSize(9);
            doc.setTextColor(100);
            doc.text(`Created: ${section.created} | ${section.status}`, 15, yPos);
            yPos += 10;
            
        } else if (section.type === 'task') {
            // Task format
            const status = section.done ? '✓' : '○';
            doc.text(`${status} ${section.text}`, 10, yPos);
            yPos += 7;
            
            doc.setFontSize(9);
            doc.setTextColor(100);
            doc.text(`Added: ${section.created}`, 15, yPos);
            yPos += 8;
            
        } else if (section.type === 'event') {
            // Event format
            doc.setTextColor(153, 51, 0);
            doc.text(`${section.time} - ${section.title}`, 10, yPos);
            yPos += 7;
            
            doc.setFontSize(9);
            doc.setTextColor(100);
            doc.text(`Date: ${section.date}`, 15, yPos);
            yPos += 8;
        }
        
        // Add page break if needed
        if (yPos > 280) {
            doc.addPage();
            yPos = 20;
        }
    });
    
    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, 195, 285, { align: 'right' });
        doc.text('Exported from Note Taker App', 10, 285);
    }
    
    // Save the PDF
    doc.save(`notetaker-export-${type}-${currentDate.replace(/\//g, '-')}.pdf`);
}

function getNotesContent() {
    const filteredNotes = notes.filter(n => !n.deleted);
    return filteredNotes.map(note => ({
        type: 'note',
        title: note.title,
        content: note.content,
        tag: note.tag,
        created: new Date(note.createdAt).toLocaleDateString(),
        status: note.archived ? 'Archived' : note.pinned ? 'Pinned' : note.starred ? 'Starred' : 'Active'
    }));
}

function getTasksContent() {
    return tasks.map(task => ({
        type: 'task',
        text: task.text,
        done: task.done,
        created: new Date(task.createdAt).toLocaleDateString()
    }));
}

function getEventsContent() {
    return events.map(event => ({
        type: 'event',
        title: event.title,
        time: event.time,
        date: new Date(event.date).toLocaleDateString()
    }));
}

function getAllContent() {
    const content = [];
    
    if (notes.length > 0) {
        content.push({
            title: 'NOTES',
            type: 'section'
        }, ...getNotesContent());
    }
    
    if (tasks.length > 0) {
        content.push({
            title: 'TASKS',
            type: 'section'
        }, ...getTasksContent());
    }
    
    if (events.length > 0) {
        content.push({
            title: 'EVENTS',
            type: 'section'
        }, ...getEventsContent());
    }
    
    return content;
}

// Word Export Functions
function exportToWord(type = 'notes') {
    let title = '';
    let content = '';
    
    switch(type) {
        case 'notes':
            title = 'My Notes Export';
            content = generateWordNotesContent();
            break;
        case 'tasks':
            title = 'My Tasks Export';
            content = generateWordTasksContent();
            break;
        case 'events':
            title = 'My Events Export';
            content = generateWordEventsContent();
            break;
        case 'all':
            title = 'Complete Export - Note Taker';
            content = generateWordAllContent();
            break;
    }
    
    const currentDate = new Date().toLocaleDateString();
    const header = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${title}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                h1 { color: #283593; border-bottom: 2px solid #283593; padding-bottom: 10px; }
                h2 { color: #3949ab; margin-top: 30px; }
                .note { margin: 20px 0; padding: 15px; border-left: 4px solid #2196f3; background: #f5f9ff; }
                .note-title { color: #1976d2; font-weight: bold; }
                .note-tag { display: inline-block; background: #e3f2fd; padding: 2px 8px; border-radius: 10px; font-size: 12px; margin-left: 10px; }
                .task { margin: 10px 0; padding: 8px; }
                .task-done { text-decoration: line-through; color: #666; }
                .event { margin: 10px 0; padding: 10px; background: #fff8e1; border-left: 4px solid #ffb300; }
                .metadata { font-size: 12px; color: #666; margin-top: 5px; }
                .timestamp { text-align: right; font-size: 11px; color: #999; margin-top: 30px; }
                .page-break { page-break-after: always; }
            </style>
        </head>
        <body>
    `;
    
    const footer = `
            <div class="timestamp">
                Generated on ${currentDate} • Exported from Note Taker App
            </div>
        </body>
        </html>
    `;
    
    const fullContent = header + content + footer;
    
    // Create and download the .doc file
    const blob = new Blob([fullContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notetaker-${type}-export-${currentDate.replace(/\//g, '-')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function generateWordNotesContent() {
    const filteredNotes = notes.filter(n => !n.deleted);
    let html = '<h1>My Notes</h1>';
    
    if (filteredNotes.length === 0) {
        html += '<p>No notes available.</p>';
        return html;
    }
    
    filteredNotes.forEach(note => {
        const date = new Date(note.createdAt).toLocaleDateString();
        const status = note.archived ? 'Archived' : note.pinned ? 'Pinned' : note.starred ? 'Starred' : 'Active';
        
        html += `
            <div class="note">
                <div class="note-title">${note.title} 
                    <span class="note-tag">${note.tag}</span>
                </div>
                <div>${note.content.replace(/\n/g, '<br>')}</div>
                <div class="metadata">
                    Created: ${date} | Status: ${status} | 
                    ${note.color && note.color !== 'transparent' ? `Color: <span style="color:${note.color}">●</span>` : ''}
                </div>
            </div>
        `;
    });
    
    return html;
}

function generateWordTasksContent() {
    let html = '<h1>My Tasks</h1>';
    
    if (tasks.length === 0) {
        html += '<p>No tasks available.</p>';
        return html;
    }
    
    const pendingTasks = tasks.filter(t => !t.done);
    const completedTasks = tasks.filter(t => t.done);
    
    if (pendingTasks.length > 0) {
        html += '<h2>Pending Tasks</h2>';
        pendingTasks.forEach(task => {
            const date = new Date(task.createdAt).toLocaleDateString();
            html += `
                <div class="task">
                    ○ ${task.text}
                    <div class="metadata">Added: ${date}</div>
                </div>
            `;
        });
    }
    
    if (completedTasks.length > 0) {
        html += '<h2>Completed Tasks</h2>';
        completedTasks.forEach(task => {
            const date = new Date(task.createdAt).toLocaleDateString();
            html += `
                <div class="task task-done">
                    ✓ ${task.text}
                    <div class="metadata">Completed: ${date}</div>
                </div>
            `;
        });
    }
    
    return html;
}

function generateWordEventsContent() {
    let html = '<h1>My Events</h1>';
    
    if (events.length === 0) {
        html += '<p>No events available.</p>';
        return html;
    }
    
    // Sort events by date
    const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    sortedEvents.forEach(event => {
        const date = new Date(event.date).toLocaleString();
        html += `
            <div class="event">
                <strong>${event.title}</strong><br>
                Time: ${event.time}<br>
                Date: ${date}
            </div>
        `;
    });
    
    return html;
}

function generateWordAllContent() {
    let html = '<h1>Complete Export - Note Taker</h1>';
    
    if (notes.length > 0) {
        html += '<h2>Notes</h2>' + generateWordNotesContent().replace('<h1>My Notes</h1>', '');
    }
    
    if (tasks.length > 0) {
        html += '<h2>Tasks</h2>' + generateWordTasksContent().replace('<h1>My Tasks</h1>', '');
    }
    
    if (events.length > 0) {
        html += '<h2>Events</h2>' + generateWordEventsContent().replace('<h1>My Events</h1>', '');
    }
    
    return html;
}

// Enhanced Export Dialog
function openExportDialog() {
    const dialogHTML = `
        <div id="exportDialog" class="modal">
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h2>Export Data</h2>
                    <button class="close-modal" onclick="closeExportDialog()">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="form-group">
                    <label>Select Export Type</label>
                    <div style="display: flex; flex-direction: column; gap: 10px; margin: 20px 0;">
                        <button class="export-option" onclick="exportToPDF('notes')">
                            <i data-lucide="file-text"></i> Export Notes as PDF
                        </button>
                        <button class="export-option" onclick="exportToPDF('tasks')">
                            <i data-lucide="check-square"></i> Export Tasks as PDF
                        </button>
                        <button class="export-option" onclick="exportToPDF('events')">
                            <i data-lucide="calendar"></i> Export Events as PDF
                        </button>
                        <button class="export-option" onclick="exportToPDF('all')">
                            <i data-lucide="archive"></i> Export Everything as PDF
                        </button>
                        <hr style="border: 1px solid var(--border); width: 100%;">
                        <button class="export-option" onclick="exportToWord('notes')">
                            <i data-lucide="file-text"></i> Export Notes as Word
                        </button>
                        <button class="export-option" onclick="exportToWord('tasks')">
                            <i data-lucide="check-square"></i> Export Tasks as Word
                        </button>
                        <button class="export-option" onclick="exportToWord('events')">
                            <i data-lucide="calendar"></i> Export Events as Word
                        </button>
                        <button class="export-option" onclick="exportToWord('all')">
                            <i data-lucide="archive"></i> Export Everything as Word
                        </button>
                    </div>
                </div>
                <div class="form-actions">
                    <button class="btn-secondary" onclick="closeExportDialog()">Cancel</button>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing dialog if any
    const existingDialog = document.getElementById('exportDialog');
    if (existingDialog) {
        existingDialog.remove();
    }
    
    // Add dialog to body
    document.body.insertAdjacentHTML('beforeend', dialogHTML);
    
    // Show dialog
    const dialog = document.getElementById('exportDialog');
    dialog.style.display = 'flex';
    setTimeout(() => {
        dialog.style.animation = "fadeIn 0.3s ease-out";
    }, 10);
    
    refreshIcons();
}

function closeExportDialog() {
    const dialog = document.getElementById('exportDialog');
    if (dialog) {
        dialog.style.animation = "fadeIn 0.3s ease-out reverse";
        setTimeout(() => {
            dialog.style.display = "none";
            dialog.remove();
        }, 300);
    }
}

// Update the exportData function to use the new dialog
function exportData() {
    openExportDialog();
}

function importData() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);

                if (confirm("This will replace all your current data. Continue?")) {
                    if (data.notes) notes = data.notes;
                    if (data.tasks) tasks = data.tasks;
                    if (data.events) events = data.events;

                    saveAndRefresh();
                    alert("Data imported successfully!");
                }
            } catch (error) {
                alert("Error importing data. Invalid file format.");
            }
        };
        reader.readAsText(file);
    };

    input.click();
}

function filterNotes() {
    const val = document.getElementById("searchInput").value;
    renderNotes(val);
}

function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    document.getElementById("digitalClock").innerText = timeString;
}

function setupAutoSave() {
    if (autoSaveTimer) {
        clearInterval(autoSaveTimer);
    }
    const interval =
        parseInt(localStorage.getItem("notetaker-autosave") || "30") * 1000;
    if (interval >= 5000) {
        autoSaveTimer = setInterval(() => {
            saveAndRefresh();
            console.log("Auto-saved at", new Date().toLocaleTimeString());
        }, interval);
    }
}

// Update the saveAndRefresh function to save to appropriate storage
function saveAndRefresh() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser && currentUser.email) {
        // Save to user's storage
        const userData = JSON.parse(localStorage.getItem(`user_${currentUser.email}`)) || {};
        userData.notes = notes;
        userData.tasks = tasks;
        userData.events = events;
        localStorage.setItem(`user_${currentUser.email}`, JSON.stringify(userData));
    } else {
        // Save to guest storage
        localStorage.setItem("guest_notes", JSON.stringify(notes));
        localStorage.setItem("guest_tasks", JSON.stringify(tasks));
        localStorage.setItem("guest_events", JSON.stringify(events));
    }
    
    // Also save to session storage
    localStorage.setItem("saved-notes", JSON.stringify(notes));
    localStorage.setItem("saved-tasks", JSON.stringify(tasks));
    localStorage.setItem("saved-events", JSON.stringify(events));
    
    renderNotes();
    renderTasks();
    renderEvents();
}

function refreshIcons() {
    lucide.createIcons();
}

// Add CSS for trash management and export dialog
const style = document.createElement('style');
style.textContent = `
    .trash-management {
        display: flex;
        gap: 10px;
        margin: 20px 0;
        padding: 15px;
        background: var(--card-bg);
        border-radius: 8px;
        border: 1px solid var(--border);
    }
    
    .trash-btn {
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s ease;
    }
    
    .trash-btn:hover {
        transform: translateY(-1px);
        opacity: 0.9;
    }
    
    .empty-trash-btn {
        background: var(--danger);
        color: white;
    }
    
    .restore-all-btn {
        background: var(--success);
        color: white;
    }
    
    .note-card.archived {
        opacity: 0.9;
        border-left: 3px solid var(--primary);
    }
    
    .icon-btn.active {
        color: var(--primary);
        fill: var(--primary);
    }
    
    .icon-btn:hover {
        background: var(--hover-bg);
    }
    
    .delete-btn:hover {
        color: var(--danger) !important;
        fill: var(--danger) !important;
    }
    
    /* Export Dialog Styles */
    .export-option {
        background: var(--card-bg);
        border: 2px solid var(--border);
        border-radius: var(--radius);
        padding: 16px;
        color: var(--text-main);
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: var(--transition);
        display: flex;
        align-items: center;
        gap: 12px;
        text-align: left;
        width: 100%;
    }
    
    .export-option:hover {
        background: var(--primary-soft);
        border-color: var(--primary);
        transform: translateY(-2px);
        box-shadow: var(--shadow);
    }
    
    .export-option i {
        width: 20px;
        height: 20px;
        color: var(--primary);
    }
`;
document.head.appendChild(style);

// Update DOMContentLoaded event listener
window.addEventListener("DOMContentLoaded", () => {
    const savedColor = localStorage.getItem("notetaker-theme");
    const savedDefaultView = localStorage.getItem("notetaker-default-view") || "all";

    if (savedColor) changeBg(savedColor);
    
    // Initialize user profile first
    initUserProfile();
    
    updateClock();
    setInterval(updateClock, 1000);
    setupAutoSave();
    setView(savedDefaultView);
    saveAndRefresh();
    refreshIcons();
    
    const backToTop = document.getElementById("backToTop");
    window.addEventListener("scroll", function () {
        if (window.pageYOffset > 300) {
            backToTop.classList.add("visible");
        } else {
            backToTop.classList.remove("visible");
        }
    });
    
    backToTop.addEventListener("click", function (e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    });
    
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModal();
            closeSettingsModal();
        }
    });
    
    document.querySelectorAll(".nav-section").forEach((section, index) => {
        section.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Make functions globally available
    window.setView = setView;
    window.changeBg = changeBg;
    window.openNoteModal = openNoteModal;
    window.closeModal = closeModal;
    window.saveNote = saveNote;
    window.editNote = editNote;
    window.deleteNote = deleteNote;
    window.togglePin = togglePin;
    window.toggleStar = toggleStar;
    window.changeNoteColor = changeNoteColor;
    window.toggleArchive = toggleArchive;
    window.deletePermanently = deletePermanently;
    window.restoreNote = restoreNote;
    window.emptyTrash = emptyTrash;
    window.restoreAllNotes = restoreAllNotes;
    window.addNewTask = addNewTask;
    window.toggleTask = toggleTask;
    window.deleteTask = deleteTask;
    window.clearCompletedTasks = clearCompletedTasks;
    window.addNewEvent = addNewEvent;
    window.deleteEvent = deleteEvent;
    window.quickAdd = quickAdd;
    window.exportData = exportData;
    window.exportToPDF = exportToPDF;
    window.exportToWord = exportToWord;
    window.openExportDialog = openExportDialog;
    window.closeExportDialog = closeExportDialog;
    window.importData = importData;
    window.logout = logout;
    window.openSettings = openSettings;
    window.closeSettingsModal = closeSettingsModal;
    window.saveSettings = saveSettings;
    window.filterNotes = filterNotes;
    window.initUserProfile = initUserProfile;
});