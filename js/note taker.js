// Enhanced data management with persistent storage
class NoteStorage {
    static STORAGE_KEY = 'academicNotes';
    static SETTINGS_KEY = 'academicNotesSettings';
    static BACKUP_KEY = 'academicNotesBackup';

    static saveNotes(notes) {
        try {
            // Create backup before saving
            const currentNotes = this.loadNotes();
            localStorage.setItem(this.BACKUP_KEY, JSON.stringify(currentNotes));
            
            // Save new notes
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notes));
            return true;
        } catch (e) {
            console.error('Error saving notes:', e);
            return false;
        }
    }

    static loadNotes() {
        try {
            const savedNotes = localStorage.getItem(this.STORAGE_KEY);
            if (savedNotes) {
                return JSON.parse(savedNotes);
            }
        } catch (e) {
            console.error('Error loading notes:', e);
            this.restoreFromBackup();
        }
        return null;
    }

    static restoreFromBackup() {
        try {
            const backup = localStorage.getItem(this.BACKUP_KEY);
            if (backup) {
                localStorage.setItem(this.STORAGE_KEY, backup);
                return JSON.parse(backup);
            }
        } catch (e) {
            console.error('Error restoring from backup:', e);
        }
        return null;
    }

    static saveSettings(settings) {
        try {
            localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
            return true;
        } catch (e) {
            console.error('Error saving settings:', e);
            return false;
        }
    }

    static loadSettings() {
        try {
            const savedSettings = localStorage.getItem(this.SETTINGS_KEY);
            if (savedSettings) {
                return JSON.parse(savedSettings);
            }
        } catch (e) {
            console.error('Error loading settings:', e);
        }
        return null;
    }

    static clearAll() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            localStorage.removeItem(this.SETTINGS_KEY);
            localStorage.removeItem(this.BACKUP_KEY);
            return true;
        } catch (e) {
            console.error('Error clearing storage:', e);
            return false;
        }
    }

    static exportNotes() {
        const notes = this.loadNotes() || [];
        const dataStr = JSON.stringify(notes, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileName = `academic-notes-backup-${new Date().toISOString().split('T')[0]}.json`;
        return { dataUri, exportFileName };
    }

    static importNotes(jsonData) {
        try {
            const importedNotes = JSON.parse(jsonData);
            if (Array.isArray(importedNotes)) {
                return importedNotes;
            }
        } catch (e) {
            console.error('Error parsing imported notes:', e);
            throw new Error('Invalid notes format');
        }
        return null;
    }
}

// Main application data and state
let notes = [
    {
        id: 1,
        title: "Web Design Principles",
        date: "Today",
        content: "Key principles of web design: usability, accessibility, responsiveness, and visual hierarchy. Remember to consider user experience (UX) and user interface (UI) design patterns. **Important**: Mobile-first design approach is crucial for modern web applications.",
        tags: ["web-design", "design-principles", "important", "ux"],
        folder: "web-design",
        pinned: true,
        archived: false,
        important: true,
        color: "#e8eaf6",
        priority: "high",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 2,
        title: "Database Normalization",
        date: "Yesterday",
        content: "Normal forms: 1NF, 2NF, 3NF, BCNF. Each normal form addresses specific types of data redundancy and dependency issues. Remember to avoid update anomalies.\n\n**Key Points**:\n• 1NF: Atomic values\n• 2NF: No partial dependencies\n• 3NF: No transitive dependencies\n• BCNF: Every determinant is a candidate key",
        tags: ["database", "normalization", "sql", "important"],
        folder: "database",
        pinned: false,
        archived: false,
        important: true,
        color: "#e1f5fe",
        priority: "medium",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
        id: 3,
        title: "Project Meeting Notes",
        date: "12/12/2024",
        content: "Discussed project timeline and deliverables. Need to assign tasks to team members and set up weekly check-in meetings. Review design mockups by Friday.\n\n**Action Items**:\n1. Assign frontend tasks to Alex\n2. Setup database schema by Wednesday\n3. Weekly team sync every Monday 2 PM",
        tags: ["student-meeting", "project", "planning", "team"],
        folder: "student-meeting",
        pinned: false,
        archived: false,
        important: true,
        color: "#ffcdcdff",
        priority: "high",
        createdAt: "2024-12-12T00:00:00.000Z",
        updatedAt: "2024-12-12T00:00:00.000Z"
    },
    {
        id: 4,
        title: "English Grammar Review",
        date: "1/12/2024",
        content: "Verb tenses: present simple, present continuous, past simple, future simple. Common mistakes: subject-verb agreement, article usage (a/an/the). Practice exercises due next week.",
        tags: ["general-english", "grammar", "review"],
        folder: "general-english",
        pinned: true,
        archived: false,
        important: false,
        color: "#f3e5f5",
        priority: "medium",
        createdAt: "2024-12-01T00:00:00.000Z",
        updatedAt: "2024-12-01T00:00:00.000Z"
    },
    {
        id: 5,
        title: "Algorithm Complexity",
        date: "12/12/2024",
        content: "Big O notation: O(1), O(log n), O(n), O(n log n), O(n²). Time vs space complexity analysis for common sorting algorithms: quicksort, mergesort, bubblesort.\n\n**Complexity Chart**:\n• Quicksort: O(n log n) average\n• Mergesort: O(n log n) worst-case\n• Bubblesort: O(n²) worst-case",
        tags: ["algorithm", "complexity", "big-o", "important"],
        folder: "algorithm",
        pinned: false,
        archived: false,
        important: true,
        color: "#ffebee",
        priority: "high",
        createdAt: "2024-12-12T00:00:00.000Z",
        updatedAt: "2024-12-12T00:00:00.000Z"
    },
    {
        id: 6,
        title: "Frontend Frameworks Comparison",
        date: "1/11/2024",
        content: "React vs Vue vs Angular: comparison of component structure, state management, learning curve, and community support. Consider project requirements before choosing.\n\n**React**: Component-based, large ecosystem\n**Vue**: Progressive framework, easy learning curve\n**Angular**: Full-featured, TypeScript-based",
        tags: ["frontend", "frameworks", "comparison", "react"],
        folder: "frontend",
        pinned: false,
        archived: false,
        important: false,
        color: "#e8f5e8",
        priority: "medium",
        createdAt: "2024-11-01T00:00:00.000Z",
        updatedAt: "2024-11-01T00:00:00.000Z"
    },
    {
        id: 7,
        title: "Professional Development Goals",
        date: "15/11/2024",
        content: "1. Complete certification course\n2. Attend networking events\n3. Improve presentation skills\n4. Learn new programming language\n5. Contribute to open source\n6. Build portfolio projects",
        tags: ["professional-life", "goals", "career", "development"],
        folder: "professional-life",
        pinned: true,
        archived: false,
        important: true,
        color: "#fff3cd",
        priority: "high",
        createdAt: "2024-11-15T00:00:00.000Z",
        updatedAt: "2024-11-15T00:00:00.000Z"
    },
    {
        id: 8,
        title: "Backend Architecture Patterns",
        date: "20/11/2024",
        content: "Microservices vs Monolithic architecture. RESTful API design principles. Database connection pooling and caching strategies for performance optimization.\n\n**Best Practices**:\n• Use async/await for I/O operations\n• Implement proper error handling\n• Add request validation\n• Use environment variables",
        tags: ["backend", "architecture", "patterns", "microservices"],
        folder: "backend",
        pinned: false,
        archived: false,
        important: true,
        color: "#f3e5f5",
        priority: "high",
        createdAt: "2024-11-20T00:00:00.000Z",
        updatedAt: "2024-11-20T00:00:00.000Z"
    },
    {
        id: 9,
        title: "Software Deployment Strategies",
        date: "5/12/2024",
        content: "Blue-green deployment, canary releases, rolling updates. CI/CD pipeline setup using Jenkins/GitHub Actions. Monitoring and rollback procedures.\n\n**Deployment Checklist**:\n• Backup database\n• Run tests\n• Monitor metrics\n• Have rollback plan ready",
        tags: ["software-deployment", "devops", "ci-cd", "important"],
        folder: "software-deployment",
        pinned: false,
        archived: false,
        important: true,
        color: "#e1f5fe",
        priority: "medium",
        createdAt: "2024-12-05T00:00:00.000Z",
        updatedAt: "2024-12-05T00:00:00.000Z"
    },
    {
        id: 10,
        title: "Technical English Vocabulary",
        date: "10/12/2024",
        content: "Technical terms: algorithm, database, framework, interface, protocol, query, repository, server, syntax, variable. Practice using in context during presentations.\n\n**Common Phrases**:\n• 'The API endpoint returns JSON data'\n• 'We need to optimize the database query'\n• 'The framework provides built-in security'",
        tags: ["english-for-it", "vocabulary", "technical", "language"],
        folder: "english-for-it",
        pinned: false,
        archived: false,
        important: false,
        color: "#e8f5e8",
        priority: "low",
        createdAt: "2024-12-10T00:00:00.000Z",
        updatedAt: "2024-12-10T00:00:00.000Z"
    },
    {
        id: 11,
        title: "Design Thinking Process",
        date: "8/12/2024",
        content: "Empathize, Define, Ideate, Prototype, Test. User research methods: interviews, surveys, observation. Creating user personas and journey maps.\n\n**Design Principles**:\n• Consistency\n• Feedback\n• Error prevention\n• Recognition over recall",
        tags: ["design", "process", "ux", "ui"],
        folder: "design",
        pinned: false,
        archived: true,
        important: true,
        color: "#ffebee",
        priority: "medium",
        createdAt: "2024-12-08T00:00:00.000Z",
        updatedAt: "2024-12-08T00:00:00.000Z"
    }
];

let settings = {
    defaultColor: "white",
    defaultPriority: "medium",
    autoSaveInterval: 10,
    notesPerPage: 20,
    spellCheck: true,
    showCharCount: true,
    theme: "light",
    sortBy: "newest"
};

// DOM Elements
const notesGrid = document.getElementById('notesGrid');
const newNoteBtn = document.getElementById('newNoteBtn');
const noteModal = document.getElementById('noteModal');
const deleteModal = document.getElementById('deleteModal');
const settingsModal = document.getElementById('settingsModal');
const closeModal = document.getElementById('closeModal');
const closeSettings = document.getElementById('closeSettings');
const cancelBtn = document.getElementById('cancelBtn');
const noteForm = document.getElementById('noteForm');
const modalTitle = document.getElementById('modalTitle');
const noteTitle = document.getElementById('noteTitle');
const noteDate = document.getElementById('noteDate');
const noteContent = document.getElementById('noteContent');
const noteTags = document.getElementById('noteTags');
const noteFolder = document.getElementById('noteFolder');
const searchInput = document.getElementById('searchInput');
const deleteBtn = document.getElementById('deleteBtn');
const cancelDelete = document.getElementById('cancelDelete');
const confirmDelete = document.getElementById('confirmDelete');
const themeToggle = document.getElementById('themeToggle');
const nightModeToggle = document.getElementById('nightModeToggle');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const toastIcon = document.getElementById('toastIcon');
const charCounter = document.getElementById('charCounter');
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const exportBtn = document.getElementById('exportNotes');
const importBtn = document.getElementById('importNotes');
const settingsBtn = document.getElementById('settingsBtn');
const saveSettingsBtn = document.getElementById('saveSettings');
const resetSettingsBtn = document.getElementById('resetSettings');
const sortNewestBtn = document.getElementById('sortNewest');
const sortOldestBtn = document.getElementById('sortOldest');
const sortAlphabeticalBtn = document.getElementById('sortAlphabetical');
const filterImportantBtn = document.getElementById('filterImportant');
const totalNotesEl = document.getElementById('totalNotes');
const pinnedNotesCountEl = document.getElementById('pinnedNotesCount');
const archivedNotesCountEl = document.getElementById('archivedNotesCount');
const todayNotesCountEl = document.getElementById('todayNotesCount');
const importantNotesCountEl = document.getElementById('importantNotesCount');
const totalNotesStatEl = document.getElementById('totalNotesStat');
const charCountEl = document.getElementById('charCount');
const productivityFill = document.getElementById('productivityFill');
const productivityText = document.getElementById('productivityText');

const folderCountElements = {
    'all': document.getElementById('allCount'),
    'general-english': document.getElementById('generalEnglishCount'),
    'web-design': document.getElementById('webDesignCount'),
    'algorithm': document.getElementById('algorithmCount'),
    'student-meeting': document.getElementById('studentMeetingCount'),
    'database': document.getElementById('databaseCount'),
    'software-deployment': document.getElementById('softwareDeploymentCount'),
    'frontend': document.getElementById('frontendCount'),
    'professional-life': document.getElementById('professionalLifeCount'),
    'backend': document.getElementById('backendCount'),
    'english-for-it': document.getElementById('englishForItCount'),
    'design': document.getElementById('designCount')
};

// Application State
let currentNoteId = null;
let isEditing = false;
let currentView = 'today';
let selectedColor = 'white';
let selectedPriority = 'medium';
let noteToDelete = null;
let sortOrder = 'newest';
let showImportantOnly = false;
let autoSaveTimer;

// Initialize Application
function initApp() {
    loadData();
    displayNotes(getFilteredNotes());
    updateStats();
    updateFolderCounts();
    setCurrentDate();
    updateProductivity();
    setupEventListeners();
    startAutoSave();
    showToast('Academic Notebook loaded successfully!', 'success');
}

// Data Management Functions
function loadData() {
    // Load settings
    const savedSettings = NoteStorage.loadSettings();
    if (savedSettings) {
        settings = { ...settings, ...savedSettings };
        applySettings();
    }
    
    // Load notes
    const savedNotes = NoteStorage.loadNotes();
    if (savedNotes && savedNotes.length > 0) {
        notes = savedNotes;
    } else {
        // Initialize with default notes and save them
        NoteStorage.saveNotes(notes);
    }
}

function applySettings() {
    // Apply theme
    if (settings.theme === 'dark') {
        enableDarkTheme();
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggle.title = 'Switch to Light Theme';
    } else if (settings.theme === 'night') {
        enableNightMode();
        nightModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        nightModeToggle.title = 'Disable Night Mode';
    }
    
    // Apply sort order
    sortOrder = settings.sortBy;
    updateSortButtons();
    
    // Apply other settings
    noteContent.spellcheck = settings.spellCheck;
    charCounter.style.display = settings.showCharCount ? 'block' : 'none';
    
    // Update form inputs
    document.getElementById('defaultColor').value = settings.defaultColor;
    document.getElementById('defaultPriority').value = settings.defaultPriority;
    document.getElementById('autoSaveInterval').value = settings.autoSaveInterval;
    document.getElementById('notesPerPage').value = settings.notesPerPage;
    document.getElementById('spellCheck').checked = settings.spellCheck;
    document.getElementById('showCharCount').checked = settings.showCharCount;
}

function saveData() {
    NoteStorage.saveNotes(notes);
    NoteStorage.saveSettings(settings);
}

function startAutoSave() {
    if (autoSaveTimer) clearInterval(autoSaveTimer);
    autoSaveTimer = setInterval(() => {
        saveData();
    }, settings.autoSaveInterval * 1000);
}

// Note Display Functions
function displayNotes(notesArray) {
    notesGrid.innerHTML = '';
    
    if (notesArray.length === 0) {
        notesGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; color: var(--gray-color); padding: 60px 20px; background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85)); border-radius: var(--border-radius); box-shadow: var(--box-shadow); border: 2px dashed rgba(16, 158, 110, 0.3); backdrop-filter: blur(10px); position: relative; overflow: hidden;">
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, rgba(16, 158, 110, 0.05), rgba(255, 126, 95, 0.05)); z-index: -1;"></div>
                <i class="fas fa-sticky-note" style="font-size: 64px; margin-bottom: 20px; opacity: 0.2; color: #109e6e;"></i>
                <h3 style="margin-bottom: 15px; color: #109e6e;">No notes found</h3>
                <p>Create your first note or try a different filter.</p>
                <button class="btn btn-primary" onclick="openNewNote()" style="margin-top: 25px; background: linear-gradient(135deg, #109e6e, rgba(16, 158, 110, 0.8)); border: none; padding: 12px 28px; border-radius: 25px; font-weight: 700; transition: var(--transition); box-shadow: 0 6px 20px rgba(16, 158, 110, 0.3);">
                    <i class="fas fa-plus"></i> Create First Note
                </button>
            </div>
        `;
        return;
    }
    
    const sortedNotes = sortNotes([...notesArray]);
    const displayNotes = sortedNotes.slice(0, settings.notesPerPage === 100 ? sortedNotes.length : settings.notesPerPage);
    
    displayNotes.forEach(note => {
        const noteCard = createNoteCard(note);
        notesGrid.appendChild(noteCard);
    });
    
    if (sortedNotes.length > displayNotes.length) {
        const remaining = sortedNotes.length - displayNotes.length;
        const paginationInfo = document.createElement('div');
        paginationInfo.style.cssText = 'grid-column: 1 / -1; text-align: center; color: var(--gray-color); padding: 20px; font-size: 14px;';
        paginationInfo.textContent = `Showing ${displayNotes.length} of ${sortedNotes.length} notes. ${remaining} more notes available.`;
        notesGrid.appendChild(paginationInfo);
    }
}

function createNoteCard(note) {
    const noteCard = document.createElement('div');
    noteCard.className = 'note-card';
    noteCard.dataset.id = note.id;
    noteCard.style.backgroundColor = note.color;
    
    if (note.pinned) noteCard.classList.add('pinned');
    if (note.archived) noteCard.classList.add('archived');
    if (note.important) noteCard.classList.add('important');
    
    const displayDate = formatDisplayDate(note.date);
    const priorityBadge = getPriorityBadge(note.priority);
    const tagsHtml = note.tags.map(tag => 
        `<span class="tag">${escapeHtml(tag)}</span>`
    ).join('');
    const previewContent = note.content.length > 200 ? 
        note.content.substring(0, 200) + '...' : note.content;
    const folderBadge = note.folder.replace('-', ' ').toUpperCase();
    
    noteCard.innerHTML = `
        <div class="note-header">
            <div>
                <div class="note-title">${escapeHtml(note.title)}</div>
                <div class="note-date">${displayDate} ${priorityBadge}</div>
            </div>
            <div>${folderBadge}</div>
        </div>
        <div class="note-content">
            ${formatNoteContent(previewContent)}
        </div>
        <div class="note-tags">
            ${tagsHtml}
        </div>
        <div class="note-actions">
            <button class="action-btn pin-btn" title="${note.pinned ? 'Unpin' : 'Pin'}">
                <i class="fas ${note.pinned ? 'fa-thumbtack' : 'fa-thumbtack'}"></i>
            </button>
            <button class="action-btn important-btn" title="${note.important ? 'Remove importance' : 'Mark important'}">
                <i class="fas ${note.important ? 'fa-star' : 'fa-star'}"></i>
            </button>
            <button class="action-btn archive-btn" title="${note.archived ? 'Unarchive' : 'Archive'}">
                <i class="fas ${note.archived ? 'fa-box-open' : 'fa-archive'}"></i>
            </button>
            <button class="action-btn delete-btn" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    // Event listeners
    noteCard.addEventListener('click', (e) => {
        if (!e.target.closest('.note-actions')) {
            openEditNote(note.id);
        }
    });
    
    const pinBtn = noteCard.querySelector('.pin-btn');
    const importantBtn = noteCard.querySelector('.important-btn');
    const archiveBtn = noteCard.querySelector('.archive-btn');
    const deleteBtn = noteCard.querySelector('.delete-btn');
    
    pinBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePin(note.id);
    });
    
    importantBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleImportant(note.id);
    });
    
    archiveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleArchive(note.id);
    });
    
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        confirmDeleteNote(note.id);
    });
    
    return noteCard;
}

function sortNotes(notesArray) {
    const pinnedNotes = notesArray.filter(note => note.pinned);
    const otherNotes = notesArray.filter(note => !note.pinned);
    
    let sortedOtherNotes;
    switch(sortOrder) {
        case 'newest':
            sortedOtherNotes = otherNotes.sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            break;
        case 'oldest':
            sortedOtherNotes = otherNotes.sort((a, b) => 
                new Date(a.createdAt) - new Date(b.createdAt)
            );
            break;
        case 'alphabetical':
            sortedOtherNotes = otherNotes.sort((a, b) => 
                a.title.localeCompare(b.title)
            );
            break;
        default:
            sortedOtherNotes = otherNotes;
    }
    
    return [...pinnedNotes, ...sortedOtherNotes];
}

// Note CRUD Operations
function openNewNote() {
    isEditing = false;
    currentNoteId = null;
    modalTitle.textContent = 'Create New Note';
    noteTitle.value = '';
    noteDate.value = getCurrentDate();
    noteContent.value = '';
    noteTags.value = '';
    noteFolder.value = 'web-design';
    deleteBtn.style.display = 'none';
    resetSelections();
    updateCharCounter();
    noteModal.style.display = 'flex';
    setTimeout(() => noteTitle.focus(), 100);
}

function openEditNote(id) {
    isEditing = true;
    currentNoteId = id;
    const note = notes.find(n => n.id === id);
    
    if (note) {
        modalTitle.textContent = 'Edit Note';
        noteTitle.value = note.title;
        noteDate.value = formatDateForInput(note.date);
        noteContent.value = note.content;
        noteTags.value = note.tags.join(', ');
        noteFolder.value = note.folder;
        deleteBtn.style.display = 'block';
        
        // Set color selection
        document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
        const colorOption = document.querySelector(`.color-option[data-color="${note.color}"]`);
        if (colorOption) {
            colorOption.classList.add('selected');
            selectedColor = note.color;
        }
        
        // Set priority selection
        document.querySelectorAll('.priority-option').forEach(opt => opt.classList.remove('selected'));
        const priorityOption = document.querySelector(`.priority-option[data-priority="${note.priority}"]`);
        if (priorityOption) {
            priorityOption.classList.add('selected');
            selectedPriority = note.priority;
        }
        
        updateCharCounter();
        noteModal.style.display = 'flex';
        setTimeout(() => noteTitle.focus(), 100);
    }
}

function saveNote(e) {
    e.preventDefault();
    
    const title = noteTitle.value.trim();
    const date = formatDate(noteDate.value) || getCurrentDate();
    const content = noteContent.value.trim();
    const tags = noteTags.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    const folder = noteFolder.value;
    
    if (!title || !content) {
        showToast('Please fill in both title and content', 'error');
        return;
    }
    
    if (isEditing) {
        const noteIndex = notes.findIndex(n => n.id === currentNoteId);
        if (noteIndex !== -1) {
            notes[noteIndex] = {
                ...notes[noteIndex],
                title,
                date,
                content,
                tags,
                folder,
                color: selectedColor,
                priority: selectedPriority,
                updatedAt: new Date().toISOString()
            };
            showToast('Note updated successfully!', 'success');
        }
    } else {
        const newNote = {
            id: notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1,
            title,
            date,
            content,
            tags: tags.length > 0 ? tags : ['academic'],
            folder,
            pinned: false,
            archived: false,
            important: false,
            color: selectedColor,
            priority: selectedPriority,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        notes.unshift(newNote);
        showToast('Note created successfully!', 'success');
    }
    
    saveData();
    displayNotes(getFilteredNotes());
    updateStats();
    updateFolderCounts();
    updateProductivity();
    closeNoteModal();
}

function togglePin(id) {
    const noteIndex = notes.findIndex(n => n.id === id);
    if (noteIndex !== -1) {
        notes[noteIndex].pinned = !notes[noteIndex].pinned;
        notes[noteIndex].updatedAt = new Date().toISOString();
        saveData();
        displayNotes(getFilteredNotes());
        updateStats();
        showToast(notes[noteIndex].pinned ? 'Note pinned!' : 'Note unpinned!', 'info');
    }
}

function toggleImportant(id) {
    const noteIndex = notes.findIndex(n => n.id === id);
    if (noteIndex !== -1) {
        notes[noteIndex].important = !notes[noteIndex].important;
        notes[noteIndex].updatedAt = new Date().toISOString();
        saveData();
        displayNotes(getFilteredNotes());
        updateStats();
        showToast(notes[noteIndex].important ? 'Marked as important!' : 'Removed importance', 'info');
    }
}

function toggleArchive(id) {
    const noteIndex = notes.findIndex(n => n.id === id);
    if (noteIndex !== -1) {
        notes[noteIndex].archived = !notes[noteIndex].archived;
        notes[noteIndex].updatedAt = new Date().toISOString();
        saveData();
        displayNotes(getFilteredNotes());
        updateStats();
        updateFolderCounts();
        showToast(notes[noteIndex].archived ? 'Note archived!' : 'Note unarchived!', 'info');
    }
}

function confirmDeleteNote(id) {
    noteToDelete = id;
    deleteModal.style.display = 'flex';
}

function deleteNote() {
    if (noteToDelete) {
        const noteIndex = notes.findIndex(n => n.id === noteToDelete);
        if (noteIndex !== -1) {
            const noteTitleText = notes[noteIndex].title;
            notes.splice(noteIndex, 1);
            saveData();
            displayNotes(getFilteredNotes());
            updateStats();
            updateFolderCounts();
            updateProductivity();
            showToast(`"${noteTitleText}" deleted successfully!`, 'success');
        }
        deleteModal.style.display = 'none';
        noteToDelete = null;
        closeNoteModal();
    }
}

// Import/Export Functions
function exportNotes() {
    const { dataUri, exportFileName } = NoteStorage.exportNotes();
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
    showToast('Notes exported successfully!', 'success');
}

function importNotesFromFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedNotes = NoteStorage.importNotes(e.target.result);
            if (importedNotes) {
                if (confirm(`Import ${importedNotes.length} notes? This will add them to your existing notes.`)) {
                    let importedCount = 0;
                    importedNotes.forEach(note => {
                        // Ensure unique IDs
                        note.id = notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1;
                        note.createdAt = note.createdAt || new Date().toISOString();
                        note.updatedAt = new Date().toISOString();
                        notes.unshift(note);
                        importedCount++;
                    });
                    
                    saveData();
                    displayNotes(getFilteredNotes());
                    updateStats();
                    updateFolderCounts();
                    updateProductivity();
                    showToast(`${importedCount} notes imported successfully!`, 'success');
                }
            } else {
                showToast('Invalid notes file format', 'error');
            }
        } catch (error) {
            showToast('Error importing notes: ' + error.message, 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
    dropZone.classList.remove('active');
}

// Settings Management
function saveSettings() {
    settings.defaultColor = document.getElementById('defaultColor').value;
    settings.defaultPriority = document.getElementById('defaultPriority').value;
    settings.autoSaveInterval = parseInt(document.getElementById('autoSaveInterval').value);
    settings.notesPerPage = parseInt(document.getElementById('notesPerPage').value);
    settings.spellCheck = document.getElementById('spellCheck').checked;
    settings.showCharCount = document.getElementById('showCharCount').checked;
    
    NoteStorage.saveSettings(settings);
    applySettings();
    startAutoSave();
    settingsModal.style.display = 'none';
    showToast('Settings saved successfully!', 'success');
}

function resetSettings() {
    if (confirm('Reset all settings to default values?')) {
        settings = {
            defaultColor: "white",
            defaultPriority: "medium",
            autoSaveInterval: 10,
            notesPerPage: 20,
            spellCheck: true,
            showCharCount: true,
            theme: "light",
            sortBy: "newest"
        };
        applySettings();
        NoteStorage.saveSettings(settings);
        startAutoSave();
        showToast('Settings reset to default!', 'info');
    }
}

// Utility Functions
function getFilteredNotes() {
    let filteredNotes = [...notes];
    
    // Apply view filter
    switch(currentView) {
        case 'pinned':
            filteredNotes = filteredNotes.filter(note => note.pinned && !note.archived);
            break;
        case 'archived':
            filteredNotes = filteredNotes.filter(note => note.archived);
            break;
        case 'important':
            filteredNotes = filteredNotes.filter(note => note.important && !note.archived);
            break;
        case 'today':
            const today = new Date().toDateString();
            filteredNotes = filteredNotes.filter(note => {
                const noteDate = new Date(note.createdAt).toDateString();
                return noteDate === today && !note.archived;
            });
            break;
        case 'all':
            filteredNotes = filteredNotes.filter(note => !note.archived);
            break;
        default:
            if (currentView in folderCountElements) {
                filteredNotes = filteredNotes.filter(note => note.folder === currentView && !note.archived);
            } else {
                filteredNotes = filteredNotes.filter(note => !note.archived);
            }
    }
    
    // Apply important filter
    if (showImportantOnly) {
        filteredNotes = filteredNotes.filter(note => note.important);
    }
    
    // Apply search filter
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        filteredNotes = filteredNotes.filter(note =>
            note.title.toLowerCase().includes(searchTerm) ||
            note.content.toLowerCase().includes(searchTerm) ||
            note.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }
    
    return filteredNotes;
}

function updateStats() {
    const totalNotes = notes.length;
    const pinnedNotes = notes.filter(note => note.pinned).length;
    const archivedNotes = notes.filter(note => note.archived).length;
    const importantNotes = notes.filter(note => note.important).length;
    const today = new Date().toDateString();
    const todayNotes = notes.filter(note => {
        const noteDate = new Date(note.createdAt).toDateString();
        return noteDate === today;
    }).length;
    const totalChars = notes.reduce((sum, note) => sum + note.content.length, 0);
    
    totalNotesEl.textContent = totalNotes;
    pinnedNotesCountEl.textContent = pinnedNotes;
    archivedNotesCountEl.textContent = archivedNotes;
    todayNotesCountEl.textContent = todayNotes;
    importantNotesCountEl.textContent = importantNotes;
    totalNotesStatEl.textContent = totalNotes;
    charCountEl.textContent = formatNumber(totalChars);
}

function updateFolderCounts() {
    const counts = {
        'all': notes.filter(note => !note.archived).length,
        'general-english': notes.filter(note => note.folder === 'general-english' && !note.archived).length,
        'web-design': notes.filter(note => note.folder === 'web-design' && !note.archived).length,
        'algorithm': notes.filter(note => note.folder === 'algorithm' && !note.archived).length,
        'student-meeting': notes.filter(note => note.folder === 'student-meeting' && !note.archived).length,
        'database': notes.filter(note => note.folder === 'database' && !note.archived).length,
        'software-deployment': notes.filter(note => note.folder === 'software-deployment' && !note.archived).length,
        'frontend': notes.filter(note => note.folder === 'frontend' && !note.archived).length,
        'professional-life': notes.filter(note => note.folder === 'professional-life' && !note.archived).length,
        'backend': notes.filter(note => note.folder === 'backend' && !note.archived).length,
        'english-for-it': notes.filter(note => note.folder === 'english-for-it' && !note.archived).length,
        'design': notes.filter(note => note.folder === 'design' && !note.archived).length
    };
    
    Object.entries(counts).forEach(([folder, count]) => {
        if (folderCountElements[folder]) {
            folderCountElements[folder].textContent = count;
        }
    });
}

function updateProductivity() {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyNotes = notes.filter(note => new Date(note.createdAt) > oneWeekAgo).length;
    const percentage = Math.min((weeklyNotes / 10) * 100, 100);
    
    productivityFill.style.width = `${percentage}%`;
    
    if (weeklyNotes === 0) {
        productivityText.textContent = 'No notes created this week. Start writing!';
    } else if (weeklyNotes < 3) {
        productivityText.textContent = `${weeklyNotes} notes this week - Keep going!`;
    } else if (weeklyNotes < 7) {
        productivityText.textContent = `${weeklyNotes} notes this week - Good progress!`;
    } else {
        productivityText.textContent = `${weeklyNotes} notes this week - Excellent work!`;
    }
}

function resetSelections() {
    // Reset color selection
    document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
    const defaultColorOption = document.querySelector(`.color-option[data-color="${settings.defaultColor}"]`);
    if (defaultColorOption) {
        defaultColorOption.classList.add('selected');
        selectedColor = settings.defaultColor;
    }
    
    // Reset priority selection
    document.querySelectorAll('.priority-option').forEach(opt => opt.classList.remove('selected'));
    const defaultPriorityOption = document.querySelector(`.priority-option[data-priority="${settings.defaultPriority}"]`);
    if (defaultPriorityOption) {
        defaultPriorityOption.classList.add('selected');
        selectedPriority = settings.defaultPriority;
    }
}

function updateCharCounter() {
    const charCount = noteContent.value.length;
    charCounter.textContent = `Characters: ${charCount}`;
    charCounter.style.display = settings.showCharCount ? 'block' : 'none';
}

function closeNoteModal() {
    noteModal.style.display = 'none';
    noteForm.reset();
}

function updateSortButtons() {
    sortNewestBtn.classList.toggle('active', sortOrder === 'newest');
    sortOldestBtn.classList.toggle('active', sortOrder === 'oldest');
    sortAlphabeticalBtn.classList.toggle('active', sortOrder === 'alphabetical');
    filterImportantBtn.classList.toggle('active', showImportantOnly);
}

function getCurrentDate() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
}

function formatDateForInput(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('/');
    if (parts.length === 3) {
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return '';
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    return dateStr;
}

function formatDisplayDate(dateStr) {
    if (dateStr === 'Today') return 'Today';
    if (dateStr === 'Yesterday') return 'Yesterday';
    
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return dateStr;
}

function setCurrentDate() {
    noteDate.value = new Date().toISOString().split('T')[0];
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatNoteContent(content) {
    return escapeHtml(content)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
}

function getPriorityBadge(priority) {
    const badges = {
        'high': '<span style="color: #dc3545; font-size: 12px; font-weight: 700; padding: 3px 8px; border-radius: 12px; margin-left: 8px; display: inline-block; vertical-align: middle; backdrop-filter: blur(5px);"><i class="fas fa-exclamation-circle"></i> High</span>',
        'medium': '<span style="color: #ffc107; font-size: 12px; font-weight: 700; padding: 3px 8px; border-radius: 12px; margin-left: 8px; display: inline-block; vertical-align: middle; backdrop-filter: blur(5px);"><i class="fas fa-exclamation"></i> Medium</span>',
        'low': '<span style="color: #28a745; font-size: 12px; font-weight: 700; padding: 3px 8px; border-radius: 12px; margin-left: 8px; display: inline-block; vertical-align: middle; backdrop-filter: blur(5px);"><i class="fas fa-check-circle"></i> Low</span>'
    };
    return badges[priority] || '';
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Theme Management
function toggleTheme() {
    if (settings.theme === 'dark') {
        settings.theme = 'light';
        disableDarkTheme();
        themeToggle.innerHTML = '<i class="fas fa-palette"></i>';
        themeToggle.title = 'Switch to Dark Theme';
    } else {
        settings.theme = 'dark';
        enableDarkTheme();
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggle.title = 'Switch to Light Theme';
    }
    NoteStorage.saveSettings(settings);
    showToast(`Switched to ${settings.theme} theme`, 'info');
}

function toggleNightMode() {
    if (settings.theme === 'night') {
        settings.theme = 'light';
        disableNightMode();
        nightModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        nightModeToggle.title = 'Enable Night Mode';
    } else {
        settings.theme = 'night';
        enableNightMode();
        nightModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        nightModeToggle.title = 'Disable Night Mode';
    }
    NoteStorage.saveSettings(settings);
    showToast(`Switched to ${settings.theme === 'night' ? 'night' : 'normal'} mode`, 'info');
}

function enableDarkTheme() {
    document.body.classList.add('dark-theme');
}

function disableDarkTheme() {
    document.body.classList.remove('dark-theme');
}

function enableNightMode() {
    document.body.classList.add('dark-theme');
    document.documentElement.style.setProperty('--primary-color', '#8b9dc3');
    document.documentElement.style.setProperty('--accent-color', '#ff8a65');
}

function disableNightMode() {
    document.body.classList.remove('dark-theme');
    document.documentElement.style.setProperty('--primary-color', '#109e6e');
    document.documentElement.style.setProperty('--accent-color', '#f5f5f5');
}

// Toast Notification
function showToast(message, type = 'info') {
    toastMessage.textContent = message;
    toast.className = `toast ${type}`;
    
    if (type === 'success') {
        toastIcon.className = 'fas fa-check-circle';
    } else if (type === 'error') {
        toastIcon.className = 'fas fa-exclamation-circle';
    } else {
        toastIcon.className = 'fas fa-info-circle';
    }
    
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Event Listeners Setup
function setupEventListeners() {
    // Note creation and editing
    newNoteBtn.addEventListener('click', openNewNote);
    closeModal.addEventListener('click', closeNoteModal);
    closeSettings.addEventListener('click', () => settingsModal.style.display = 'none');
    cancelBtn.addEventListener('click', closeNoteModal);
    noteForm.addEventListener('submit', saveNote);
    
    // Search
    searchInput.addEventListener('input', () => {
        displayNotes(getFilteredNotes());
    });
    
    // Delete functionality
    deleteBtn.addEventListener('click', () => {
        if (currentNoteId) {
            confirmDeleteNote(currentNoteId);
        }
    });
    
    cancelDelete.addEventListener('click', () => {
        deleteModal.style.display = 'none';
        noteToDelete = null;
    });
    
    confirmDelete.addEventListener('click', deleteNote);
    
    // Theme toggles
    themeToggle.addEventListener('click', toggleTheme);
    nightModeToggle.addEventListener('click', toggleNightMode);
    
    // Character counter
    noteContent.addEventListener('input', updateCharCounter);
    
    // Color options
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedColor = this.dataset.color;
        });
    });
    
    // Priority options
    document.querySelectorAll('.priority-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.priority-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedPriority = this.dataset.priority;
        });
    });
    
    // Sorting and filtering
    sortNewestBtn.addEventListener('click', () => {
        sortOrder = 'newest';
        settings.sortBy = 'newest';
        updateSortButtons();
        displayNotes(getFilteredNotes());
        NoteStorage.saveSettings(settings);
    });
    
    sortOldestBtn.addEventListener('click', () => {
        sortOrder = 'oldest';
        settings.sortBy = 'oldest';
        updateSortButtons();
        displayNotes(getFilteredNotes());
        NoteStorage.saveSettings(settings);
    });
    
    sortAlphabeticalBtn.addEventListener('click', () => {
        sortOrder = 'alphabetical';
        settings.sortBy = 'alphabetical';
        updateSortButtons();
        displayNotes(getFilteredNotes());
        NoteStorage.saveSettings(settings);
    });
    
    filterImportantBtn.addEventListener('click', () => {
        showImportantOnly = !showImportantOnly;
        updateSortButtons();
        displayNotes(getFilteredNotes());
    });
    
    // Import/Export
    exportBtn.addEventListener('click', () => {
        openExportDialog();
    });
    importBtn.addEventListener('click', () => {
        dropZone.classList.add('active');
        fileInput.click();
    });
    
    // Settings
    settingsBtn.addEventListener('click', () => {
        settingsModal.style.display = 'flex';
    });
    
    saveSettingsBtn.addEventListener('click', saveSettings);
    resetSettingsBtn.addEventListener('click', resetSettings);
    
    // File handling
    fileInput.addEventListener('change', importNotesFromFile);
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--accent-color)';
        dropZone.style.backgroundColor = 'rgba(255, 126, 95, 0.1)';
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = 'var(--primary-color)';
        dropZone.style.backgroundColor = 'rgba(16, 158, 110, 0.05)';
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--primary-color)';
        dropZone.style.backgroundColor = 'rgba(16, 158, 110, 0.05)';
        dropZone.classList.remove('active');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            importNotesFromFile({ target: { files } });
        }
    });
    
    // Folder navigation
    document.querySelectorAll('.folder-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.folder-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            const folder = this.dataset.folder;
            currentView = folder;
            const pageTitle = document.getElementById('currentView');
            const folderName = this.querySelector('.folder-name').textContent;
            pageTitle.textContent = folderName;
            
            displayNotes(getFilteredNotes());
            showToast(`Showing ${folderName.toLowerCase()} notes`, 'info');
        });
    });
    
    // Menu navigation
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            const viewType = this.id.replace('Notes', '').toLowerCase();
            currentView = viewType === 'all' ? 'today' : viewType;
            const pageTitle = document.getElementById('currentView');
            pageTitle.textContent = this.querySelector('span').textContent;
            
            displayNotes(getFilteredNotes());
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            openNewNote();
        }
        if (e.key === 'Escape') {
            if (noteModal.style.display === 'flex') closeNoteModal();
            if (deleteModal.style.display === 'flex') deleteModal.style.display = 'none';
            if (settingsModal.style.display === 'flex') settingsModal.style.display = 'none';
            if (dropZone.classList.contains('active')) dropZone.classList.remove('active');
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            searchInput.focus();
        }
    });
    
    // Modal close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === noteModal) closeNoteModal();
        if (e.target === deleteModal) deleteModal.style.display = 'none';
        if (e.target === settingsModal) settingsModal.style.display = 'none';
    });
}

// Global functions for HTML onclick attributes
window.setView = function(view) {
    const viewMap = {
        'all': 'all',
        'team': 'student-meeting',
        'today': 'today',
        'pinned': 'pinned',
        'important': 'important',
        'archived': 'archived'
    };
    
    if (viewMap[view]) {
        currentView = viewMap[view];
        document.getElementById('currentView').textContent = 
            view.charAt(0).toUpperCase() + view.slice(1) + ' Notes';
        document.querySelectorAll('.menu-item, .folder-item').forEach(item => {
            item.classList.remove('active');
        });
        
        displayNotes(getFilteredNotes());
        showToast(`View changed to ${view}`, 'info');
    }
};
// Enhanced Export Functions - Add these to your existing JavaScript file

// PDF Export Function
function exportToPDF(type = 'all') {
    console.log('Starting PDF export');
    try {
        // For jsPDF v2+, use destructuring from window.jspdf
        const { jsPDF } = window.jspdf;
        console.log('jsPDF loaded:', jsPDF);
        const doc = new jsPDF();
        
        // Set document properties
        doc.setProperties({
            title: 'Academic Notes Export',
            subject: 'Notes Export from Academic Notebook',
            author: 'Academic Notebook App',
            keywords: 'notes, academic, export',
            creator: 'Academic Notebook v1.0'
        });
        
        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const currentTime = new Date().toLocaleTimeString();
        
        let title = '';
        let contentData = [];
        
        // Get data based on type
        switch(type) {
            case 'notes':
                title = 'My Academic Notes';
                contentData = getNotesForExport();
                break;
            case 'important':
                title = 'Important Notes';
                contentData = getNotesForExport().filter(note => note.important);
                break;
            case 'pinned':
                title = 'Pinned Notes';
                contentData = getNotesForExport().filter(note => note.pinned);
                break;
            case 'today':
                title = "Today's Notes";
                const today = new Date().toDateString();
                contentData = getNotesForExport().filter(note => {
                    const noteDate = new Date(note.createdAt).toDateString();
                    return noteDate === today;
                });
                break;
            case 'current':
                title = 'Current View Notes';
                contentData = getFilteredNotes().map(note => ({
                    ...note,
                    content: note.content.substring(0, 500) // Limit content for PDF
                }));
                break;
            default: // 'all'
                title = 'All Academic Notes';
                contentData = getNotesForExport();
                break;
        }
        
        // Add header
        doc.setFontSize(22);
        doc.setTextColor(16, 158, 110); // Primary color
        doc.text(title, 105, 20, { align: 'center' });
        
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on ${currentDate} at ${currentTime}`, 105, 28, { align: 'center' });
        
        // Add summary
        doc.setFontSize(11);
        doc.setTextColor(50, 50, 50);
        doc.text(`Total Notes: ${contentData.length}`, 105, 38, { align: 'center' });
        
        doc.line(10, 42, 200, 42);
        
        // Add content
        let yPos = 50;
        
        contentData.forEach((note, index) => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            
            // Add section separator
            if (index > 0) {
                doc.setDrawColor(200, 200, 200);
                doc.line(10, yPos - 5, 200, yPos - 5);
                yPos += 5;
            }
            
            // Note title
            doc.setFontSize(14);
            doc.setTextColor(30, 30, 30);
            doc.setFont(undefined, 'bold');
            doc.text(note.title, 15, yPos);
            doc.setFont(undefined, 'normal');
            yPos += 8;
            
            // Note metadata
            doc.setFontSize(9);
            doc.setTextColor(100, 100, 100);
            const metaText = [
                `Created: ${formatExportDate(note.createdAt)}`,
                `Folder: ${note.folder.replace('-', ' ').toUpperCase()}`,
                `Priority: ${note.priority.toUpperCase()}`
            ].join(' | ');
            doc.text(metaText, 15, yPos);
            yPos += 6;
            
            // Tags
            if (note.tags && note.tags.length > 0) {
                const tagsText = `Tags: ${note.tags.join(', ')}`;
                doc.text(tagsText, 15, yPos);
                yPos += 6;
            }
            
            // Status indicators
            const status = [];
            if (note.pinned) status.push('📌 Pinned');
            if (note.important) status.push('⭐ Important');
            if (note.archived) status.push('📦 Archived');
            
            if (status.length > 0) {
                doc.setTextColor(16, 158, 110);
                doc.text(status.join(' • '), 15, yPos);
                doc.setTextColor(100, 100, 100);
                yPos += 6;
            }
            
            // Note content
            doc.setFontSize(10);
            doc.setTextColor(30, 30, 30);
            
            const contentLines = doc.splitTextToSize(note.content, 180);
            contentLines.forEach(line => {
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }
                doc.text(line, 15, yPos);
                yPos += 5;
            });
            
            yPos += 10;
        });
        
        // Add footer
        const pageCount = doc.internal.getNumberOfPages();
        for(let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(`Page ${i} of ${pageCount}`, 195, 285, { align: 'right' });
            doc.text('Exported from Academic Notebook', 10, 285);
        }
        
        // Save the PDF
        const fileName = `academic-notes-${type}-${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
        
        showToast(`Exported ${contentData.length} notes to PDF`, 'success');
        return true;
    } catch (error) {
        console.error('PDF Export Error:', error);
        showToast('Error exporting to PDF: ' + error.message, 'error');
        return false;
    }
}

// Word Export Function
function exportToWord(type = 'all') {
    try {
        let title = '';
        let contentData = [];
        
        // Get data based on type
        switch(type) {
            case 'notes':
                title = 'My Academic Notes';
                contentData = getNotesForExport();
                break;
            case 'important':
                title = 'Important Notes';
                contentData = getNotesForExport().filter(note => note.important);
                break;
            case 'pinned':
                title = 'Pinned Notes';
                contentData = getNotesForExport().filter(note => note.pinned);
                break;
            case 'today':
                title = "Today's Notes";
                const today = new Date().toDateString();
                contentData = getNotesForExport().filter(note => {
                    const noteDate = new Date(note.createdAt).toDateString();
                    return noteDate === today;
                });
                break;
            case 'current':
                title = 'Current View Notes';
                contentData = getFilteredNotes();
                break;
            default: // 'all'
                title = 'All Academic Notes';
                contentData = getNotesForExport();
                break;
        }
        
        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Create HTML content for Word document
        let htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        @page {
            margin: 2cm;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #109e6e;
        }
        .header h1 {
            color: #109e6e;
            font-size: 28px;
            margin-bottom: 10px;
        }
        .header .subtitle {
            color: #666;
            font-size: 14px;
            margin-bottom: 20px;
        }
        .header .summary {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            font-size: 14px;
            color: #555;
        }
        .note {
            margin-bottom: 30px;
            padding: 20px;
            border-left: 4px solid #109e6e;
            background: #f8f9fa;
            border-radius: 8px;
            page-break-inside: avoid;
        }
        .note-title {
            color: #109e6e;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .note-meta {
            font-size: 12px;
            color: #666;
            margin-bottom: 10px;
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
        }
        .note-meta span {
            background: #e9ecef;
            padding: 3px 8px;
            border-radius: 4px;
        }
        .note-tags {
            font-size: 12px;
            color: #109e6e;
            margin-bottom: 10px;
        }
        .note-tags .tag {
            background: #e8f5e9;
            padding: 2px 8px;
            border-radius: 12px;
            margin-right: 5px;
            display: inline-block;
        }
        .note-status {
            font-size: 12px;
            color: #ff7e5f;
            margin-bottom: 10px;
        }
        .note-status span {
            margin-right: 10px;
        }
        .note-content {
            font-size: 14px;
            line-height: 1.8;
            white-space: pre-wrap;
        }
        .note-content strong {
            color: #333;
        }
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
            text-align: center;
        }
        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${title}</h1>
        <div class="subtitle">Exported from Academic Notebook</div>
        <div class="subtitle">Generated on ${currentDate}</div>
        <div class="summary">
            Total Notes: ${contentData.length} | 
            Folders: ${[...new Set(contentData.map(n => n.folder.replace('-', ' ').toUpperCase()))].join(', ')}
        </div>
    </div>
`;
        
        // Add notes content
        contentData.forEach((note, index) => {
            if (index > 0 && index % 5 === 0) {
                htmlContent += '<div class="page-break"></div>';
            }
            
            const displayDate = formatExportDate(note.createdAt);
            const folderName = note.folder.replace('-', ' ').toUpperCase();
            const statusIcons = [];
            if (note.pinned) statusIcons.push('📌 Pinned');
            if (note.important) statusIcons.push('⭐ Important');
            if (note.archived) statusIcons.push('📦 Archived');
            
            htmlContent += `
    <div class="note">
        <div class="note-title">${escapeHtml(note.title)}</div>
        <div class="note-meta">
            <span>📅 ${displayDate}</span>
            <span>📁 ${folderName}</span>
            <span>${getPriorityIcon(note.priority)} ${note.priority.toUpperCase()}</span>
        </div>
        ${note.tags && note.tags.length > 0 ? `
        <div class="note-tags">
            ${note.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
        </div>` : ''}
        ${statusIcons.length > 0 ? `
        <div class="note-status">
            ${statusIcons.map(icon => `<span>${icon}</span>`).join('')}
        </div>` : ''}
        <div class="note-content">${formatNoteContentForExport(note.content)}</div>
    </div>
`;
        });
        
        // Add footer
        htmlContent += `
    <div class="footer">
        <p>Academic Notebook Export | ${contentData.length} notes exported</p>
        <p>This document was generated automatically. For more features, visit the Academic Notebook application.</p>
    </div>
</body>
</html>`;
        
        // Create and download Word document
        const blob = new Blob([htmlContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const fileName = `academic-notes-${type}-${new Date().toISOString().split('T')[0]}.doc`;
        
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast(`Exported ${contentData.length} notes to Word document`, 'success');
        return true;
    } catch (error) {
        console.error('Word Export Error:', error);
        showToast('Error exporting to Word: ' + error.message, 'error');
        return false;
    }
}

// PowerPoint Export Function (requires pptxgenjs library)
function exportToPowerPoint(type = 'all') {
    console.log('Starting PowerPoint export');
    try {
        // Check if pptxgenjs is available
        if (typeof PptxGenJS === 'undefined') {
            console.warn('PptxGenJS library not loaded. PowerPoint export will not work.');
            showToast('Please include pptxgenjs library for PowerPoint export', 'error');
            return false;
        }
        
        const pptx = new PptxGenJS();
        
        let title = '';
        let contentData = [];
        
        // Get data based on type
        switch(type) {
            case 'notes':
                title = 'My Academic Notes';
                contentData = getNotesForExport();
                break;
            case 'important':
                title = 'Important Notes';
                contentData = getNotesForExport().filter(note => note.important);
                break;
            case 'pinned':
                title = 'Pinned Notes';
                contentData = getNotesForExport().filter(note => note.pinned);
                break;
            case 'today':
                title = "Today's Notes";
                const today = new Date().toDateString();
                contentData = getNotesForExport().filter(note => {
                    const noteDate = new Date(note.createdAt).toDateString();
                    return noteDate === today;
                });
                break;
            case 'current':
                title = 'Current View Notes';
                contentData = getFilteredNotes();
                break;
            default: // 'all'
                title = 'All Academic Notes';
                contentData = getNotesForExport();
                break;
        }
        
        // Presentation properties
        pptx.title = title;
        pptx.subject = 'Academic Notes Export';
        pptx.author = 'Academic Notebook';
        pptx.company = 'Academic Notebook App';
        
        // Title slide
        let slide = pptx.addSlide();
        slide.background = { color: '109E6E' }; // Primary color
        
        slide.addText(title, {
            x: 0.5,
            y: 1.5,
            w: '90%',
            h: 1.5,
            fontSize: 44,
            bold: true,
            color: 'FFFFFF',
            align: 'center'
        });
        
        slide.addText('Exported from Academic Notebook', {
            x: 0.5,
            y: 3.5,
            w: '90%',
            fontSize: 18,
            color: 'FFFFFF',
            align: 'center'
        });
        
        slide.addText(`Total Notes: ${contentData.length}`, {
            x: 0.5,
            y: 4.5,
            w: '90%',
            fontSize: 14,
            color: 'FFFFFF',
            align: 'center'
        });
        
        slide.addText(new Date().toLocaleDateString(), {
            x: 0.5,
            y: 5,
            w: '90%',
            fontSize: 12,
            color: 'FFFFFF',
            align: 'center'
        });
        
        // Summary slide
        slide = pptx.addSlide();
        slide.addText('Summary', {
            x: 0.5,
            y: 0.5,
            w: '90%',
            fontSize: 36,
            bold: true,
            color: '109E6E'
        });
        
        const folders = [...new Set(contentData.map(n => n.folder))];
        const importantCount = contentData.filter(n => n.important).length;
        const pinnedCount = contentData.filter(n => n.pinned).length;
        const todayCount = contentData.filter(n => {
            const noteDate = new Date(n.createdAt).toDateString();
            return noteDate === new Date().toDateString();
        }).length;
        
        slide.addText(
            `• Total Notes: ${contentData.length}\n` +
            `• Important Notes: ${importantCount}\n` +
            `• Pinned Notes: ${pinnedCount}\n` +
            `• Today's Notes: ${todayCount}\n` +
            `• Folders: ${folders.length}\n` +
            `• Export Date: ${new Date().toLocaleDateString()}`,
            {
                x: 1,
                y: 1.5,
                w: '85%',
                fontSize: 18,
                lineSpacing: 28
            }
        );
        
        // Notes slides
        contentData.forEach((note, index) => {
            slide = pptx.addSlide();
            
            // Note title
            slide.addText(note.title, {
                x: 0.5,
                y: 0.5,
                w: '90%',
                fontSize: 24,
                bold: true,
                color: '109E6E'
            });
            
            // Note metadata
            const metaText = [
                `📅 ${formatExportDate(note.createdAt)}`,
                `📁 ${note.folder.replace('-', ' ').toUpperCase()}`,
                `${getPriorityIcon(note.priority)} ${note.priority.toUpperCase()}`
            ].join('  •  ');
            
            slide.addText(metaText, {
                x: 0.5,
                y: 1.2,
                w: '90%',
                fontSize: 12,
                color: '666666'
            });
            
            // Status icons
            let statusText = '';
            if (note.pinned) statusText += '📌 ';
            if (note.important) statusText += '⭐ ';
            if (note.archived) statusText += '📦 ';
            
            if (statusText) {
                slide.addText(statusText.trim(), {
                    x: 0.5,
                    y: 1.6,
                    fontSize: 14,
                    color: 'FF7E5F'
                });
            }
            
            // Tags
            if (note.tags && note.tags.length > 0) {
                slide.addText(`🏷️ ${note.tags.join(', ')}`, {
                    x: 0.5,
                    y: 1.9,
                    w: '90%',
                    fontSize: 11,
                    color: '888888'
                });
            }
            
            // Note content (limited)
            const contentPreview = note.content.length > 800 
                ? note.content.substring(0, 800) + '...' 
                : note.content;
            
            slide.addText(contentPreview, {
                x: 0.5,
                y: 2.5,
                w: '90%',
                h: 4,
                fontSize: 14,
                lineSpacing: 21
            });
            
            // Slide number
            slide.addText(`Note ${index + 1} of ${contentData.length}`, {
                x: '90%',
                y: '95%',
                w: '10%',
                fontSize: 10,
                color: '999999',
                align: 'right'
            });
        });
        
        // Export slideshow
        const fileName = `academic-notes-${type}-${new Date().toISOString().split('T')[0]}.pptx`;
        pptx.writeFile({ fileName: fileName });
        
        showToast(`Exported ${contentData.length} notes to PowerPoint`, 'success');
        return true;
    } catch (error) {
        console.error('PowerPoint Export Error:', error);
        showToast('Error exporting to PowerPoint: ' + error.message, 'error');
        return false;
    }
}

// Helper functions for export
function getNotesForExport() {
    return notes.map(note => ({
        ...note,
        title: note.title,
        content: note.content,
        tags: note.tags || [],
        folder: note.folder,
        priority: note.priority || 'medium',
        pinned: note.pinned || false,
        important: note.important || false,
        archived: note.archived || false,
        createdAt: note.createdAt || new Date().toISOString(),
        color: note.color || 'white'
    }));
}

function formatExportDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatNoteContentForExport(content) {
    return escapeHtml(content)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>')
        .replace(/•\s*/g, '• ')
        .replace(/\d+\.\s+/g, (match) => match.replace('.', '. '));
}

function getPriorityIcon(priority) {
    const icons = {
        'high': '🔴',
        'medium': '🟡',
        'low': '🟢'
    };
    return icons[priority] || '⚪';
}

// Enhanced Export Dialog
function openExportDialog() {
    const dialogHTML = `
        <div id="exportDialog" class="modal">
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h2 style="color: #109e6e;"><i class="fas fa-download"></i> Export Notes</h2>
                    <button class="close-modal" onclick="closeExportDialog()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="form-group">
                    <label><i class="fas fa-filter"></i> Select Content to Export</label>
                    <div class="export-options">
                        <div class="export-option-grid">
                            <button class="export-option" onclick="exportSelected('all')" data-type="all">
                                <i class="fas fa-book"></i>
                                <span>All Notes</span>
                                <small>${notes.length} notes</small>
                            </button>
                            <button class="export-option" onclick="exportSelected('important')" data-type="important">
                                <i class="fas fa-star"></i>
                                <span>Important Notes</span>
                                <small>${notes.filter(n => n.important).length} notes</small>
                            </button>
                            <button class="export-option" onclick="exportSelected('pinned')" data-type="pinned">
                                <i class="fas fa-thumbtack"></i>
                                <span>Pinned Notes</span>
                                <small>${notes.filter(n => n.pinned).length} notes</small>
                            </button>
                            <button class="export-option" onclick="exportSelected('today')" data-type="today">
                                <i class="fas fa-calendar-day"></i>
                                <span>Today's Notes</span>
                                <small>${notes.filter(n => {
                                    const noteDate = new Date(n.createdAt).toDateString();
                                    return noteDate === new Date().toDateString();
                                }).length} notes</small>
                            </button>
                            <button class="export-option" onclick="exportSelected('current')" data-type="current">
                                <i class="fas fa-eye"></i>
                                <span>Current View</span>
                                <small>${getFilteredNotes().length} notes</small>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label><i class="fas fa-file-export"></i> Select Export Format</label>
                    <div class="export-format-options">
                        <button class="export-format-btn" onclick="exportFormatSelected('pdf')">
                            <i class="fas fa-file-pdf"></i>
                            <span>PDF Document</span>
                            <small>Best for printing</small>
                        </button>
                        <button class="export-format-btn" onclick="exportFormatSelected('word')">
                            <i class="fas fa-file-word"></i>
                            <span>Word Document</span>
                            <small>Editable format</small>
                        </button>
                        <button class="export-format-btn" onclick="exportFormatSelected('powerpoint')">
                            <i class="fas fa-file-powerpoint"></i>
                            <span>PowerPoint</span>
                            <small>For presentations</small>
                        </button>
                    </div>
                </div>
                <div class="form-actions">
                    <button class="btn-secondary" onclick="closeExportDialog()">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    <button class="btn-primary" onclick="executeExport()" id="executeExportBtn" disabled>
                        <i class="fas fa-download"></i> Export Now
                    </button>
                </div>
                <div class="export-preview" id="exportPreview">
                    <p><i class="fas fa-info-circle"></i> Select content and format to preview export</p>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing dialog if any
    const existingDialog = document.getElementById('exportDialog');
    if (existingDialog) existingDialog.remove();
    
    // Add dialog to body
    document.body.insertAdjacentHTML('beforeend', dialogHTML);
    
    // Show dialog with animation
    const dialog = document.getElementById('exportDialog');
    dialog.style.display = 'flex';
    
    setTimeout(() => {
        dialog.style.opacity = '1';
        dialog.style.transform = 'translateY(0)';
    }, 10);
    
    // Setup event listeners for the dialog
    setupExportDialogListeners();
}

let selectedExportType = 'all';
let selectedExportFormat = null;

function setupExportDialogListeners() {
    // Type selection
    document.querySelectorAll('.export-option').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.export-option').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            selectedExportType = this.dataset.type;
            updateExportPreview();
        });
    });
    
    // Format selection
    document.querySelectorAll('.export-format-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.export-format-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            const format = this.querySelector('i').className.includes('pdf') ? 'pdf' :
                         this.querySelector('i').className.includes('word') ? 'word' : 'powerpoint';
            selectedExportFormat = format;
            updateExportPreview();
        });
    });
}

function exportSelected(type) {
    selectedExportType = type;
    updateExportPreview();
}

function exportFormatSelected(format) {
    selectedExportFormat = format;
    updateExportPreview();
}

function updateExportPreview() {
    const preview = document.getElementById('exportPreview');
    const executeBtn = document.getElementById('executeExportBtn');
    
    if (!selectedExportFormat) {
        preview.innerHTML = '<p><i class="fas fa-info-circle"></i> Please select an export format</p>';
        executeBtn.disabled = true;
        return;
    }
    
    let contentCount = 0;
    let contentDescription = '';
    
    switch(selectedExportType) {
        case 'all':
            contentCount = notes.length;
            contentDescription = 'All notes from your notebook';
            break;
        case 'important':
            contentCount = notes.filter(n => n.important).length;
            contentDescription = 'Important notes only';
            break;
        case 'pinned':
            contentCount = notes.filter(n => n.pinned).length;
            contentDescription = 'Pinned notes';
            break;
        case 'today':
            const today = new Date().toDateString();
            contentCount = notes.filter(n => {
                const noteDate = new Date(n.createdAt).toDateString();
                return noteDate === today;
            }).length;
            contentDescription = "Today's notes";
            break;
        case 'current':
            contentCount = getFilteredNotes().length;
            contentDescription = 'Currently filtered notes';
            break;
    }
    
    const formatNames = {
        'pdf': 'PDF Document',
        'word': 'Word Document',
        'powerpoint': 'PowerPoint Presentation'
    };
    
    preview.innerHTML = `
        <div class="export-preview-content">
            <h4><i class="fas fa-file-export"></i> Export Preview</h4>
            <div class="preview-details">
                <div class="preview-item">
                    <span class="preview-label">Content:</span>
                    <span class="preview-value">${contentDescription}</span>
                </div>
                <div class="preview-item">
                    <span class="preview-label">Notes Count:</span>
                    <span class="preview-value">${contentCount} notes</span>
                </div>
                <div class="preview-item">
                    <span class="preview-label">Format:</span>
                    <span class="preview-value">${formatNames[selectedExportFormat]}</span>
                </div>
                <div class="preview-item">
                    <span class="preview-label">File Size:</span>
                    <span class="preview-value">Approx. ${Math.round(contentCount * 2)} KB</span>
                </div>
            </div>
            <div class="preview-actions">
                <button class="btn-small" onclick="showExportTips()">
                    <i class="fas fa-lightbulb"></i> Export Tips
                </button>
            </div>
        </div>
    `;
    
    executeBtn.disabled = false;
    executeBtn.innerHTML = `<i class="fas fa-download"></i> Export ${contentCount} Notes as ${formatNames[selectedExportFormat].split(' ')[0]}`;
}

function executeExport() {
    if (!selectedExportFormat) {
        showToast('Please select an export format', 'error');
        return;
    }
    
    closeExportDialog();
    
    // Show loading indicator
    const loadingToast = document.createElement('div');
    loadingToast.className = 'toast loading';
    loadingToast.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        <span>Preparing export...</span>
    `;
    document.body.appendChild(loadingToast);
    setTimeout(() => loadingToast.classList.add('show'), 10);
    
    // Execute export based on format
    setTimeout(() => {
        let success = false;
        
        switch(selectedExportFormat) {
            case 'pdf':
                success = exportToPDF(selectedExportType);
                break;
            case 'word':
                success = exportToWord(selectedExportType);
                break;
            case 'powerpoint':
                success = exportToPowerPoint(selectedExportType);
                break;
        }
        
        // Remove loading indicator
        loadingToast.classList.remove('show');
        setTimeout(() => loadingToast.remove(), 300);
        
        if (success) {
            showToast(`Export completed successfully!`, 'success');
        }
    }, 500);
}

function closeExportDialog() {
    const dialog = document.getElementById('exportDialog');
    if (dialog) {
        dialog.style.opacity = '0';
        dialog.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            dialog.style.display = 'none';
            dialog.remove();
        }, 300);
    }
}

function showExportTips() {
    const tips = `
        <div class="export-tips">
            <h4><i class="fas fa-lightbulb"></i> Export Tips</h4>
            <ul>
                <li><strong>PDF Export:</strong> Best for printing and sharing. Preserves formatting perfectly.</li>
                <li><strong>Word Export:</strong> Best for editing and further customization.</li>
                <li><strong>PowerPoint Export:</strong> Best for presentations and meetings.</li>
                <li>For large exports, consider exporting by folder or date range.</li>
                <li>Export important notes separately for quick reference.</li>
                <li>Use "Current View" to export exactly what you see on screen.</li>
            </ul>
        </div>
    `;
    
    const preview = document.getElementById('exportPreview');
    preview.innerHTML = tips;
}

// Add CSS for export features
const exportStyles = document.createElement('style');
exportStyles.textContent = `
    /* Export Dialog Styles */
    .export-options {
        margin: 15px 0;
    }
    
    .export-option-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 10px;
        margin-top: 10px;
    }
    
    .export-option {
        background: var(--card-bg);
        border: 2px solid var(--border-color);
        border-radius: var(--border-radius);
        padding: 15px;
        color: var(--text-color);
        text-align: center;
        cursor: pointer;
        transition: var(--transition);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
    }
    
    .export-option:hover {
        background: rgba(16, 158, 110, 0.05);
        border-color: var(--primary-color);
        transform: translateY(-2px);
    }
    
    .export-option.selected {
        background: rgba(16, 158, 110, 0.1);
        border-color: var(--primary-color);
        box-shadow: 0 4px 12px rgba(16, 158, 110, 0.2);
    }
    
    .export-option i {
        font-size: 24px;
        color: var(--primary-color);
    }
    
    .export-option span {
        font-weight: 600;
        font-size: 14px;
    }
    
    .export-option small {
        font-size: 11px;
        color: var(--gray-color);
        opacity: 0.8;
    }
    
    .export-format-options {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        margin-top: 10px;
    }
    
    .export-format-btn {
        background: var(--card-bg);
        border: 2px solid var(--border-color);
        border-radius: var(--border-radius);
        padding: 15px;
        color: var(--text-color);
        text-align: center;
        cursor: pointer;
        transition: var(--transition);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
    }
    
    .export-format-btn:hover {
        background: rgba(16, 158, 110, 0.05);
        transform: translateY(-2px);
    }
    
    .export-format-btn.selected {
        background: rgba(16, 158, 110, 0.1);
        border-color: var(--primary-color);
        box-shadow: 0 4px 12px rgba(16, 158, 110, 0.2);
    }
    
    .export-format-btn i {
        font-size: 28px;
    }
    
    .export-format-btn:nth-child(1) i { color: #d93025; } /* PDF - Red */
    .export-format-btn:nth-child(2) i { color: #2b579a; } /* Word - Blue */
    .export-format-btn:nth-child(3) i { color: #d24726; } /* PowerPoint - Orange */
    
    .export-preview {
        margin-top: 20px;
        padding: 15px;
        background: rgba(16, 158, 110, 0.05);
        border-radius: var(--border-radius);
        border: 1px solid rgba(16, 158, 110, 0.2);
    }
    
    .export-preview-content h4 {
        color: var(--primary-color);
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .preview-details {
        display: grid;
        gap: 10px;
    }
    
    .preview-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid rgba(0,0,0,0.05);
    }
    
    .preview-item:last-child {
        border-bottom: none;
    }
    
    .preview-label {
        font-weight: 600;
        color: var(--text-color);
        font-size: 13px;
    }
    
    .preview-value {
        color: var(--primary-color);
        font-weight: 600;
        font-size: 13px;
    }
    
    .preview-actions {
        margin-top: 15px;
        text-align: center;
    }
    
    .btn-small {
        background: transparent;
        border: 1px solid var(--primary-color);
        color: var(--primary-color);
        padding: 6px 15px;
        border-radius: 20px;
        font-size: 12px;
        cursor: pointer;
        transition: var(--transition);
        display: inline-flex;
        align-items: center;
        gap: 5px;
    }
    
    .btn-small:hover {
        background: var(--primary-color);
        color: white;
    }
    
    .export-tips {
        background: white;
        padding: 15px;
        border-radius: var(--border-radius);
        box-shadow: var(--box-shadow);
    }
    
    .export-tips h4 {
        color: var(--primary-color);
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .export-tips ul {
        padding-left: 20px;
        margin: 0;
    }
    
    .export-tips li {
        margin-bottom: 8px;
        font-size: 13px;
        line-height: 1.5;
    }
    
    .export-tips li strong {
        color: var(--primary-color);
    }
    
    /* Loading toast */
    .toast.loading {
        background: var(--primary-color);
        color: white;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    /* Update the export button in header */
    #exportNotes {
        position: relative;
    }
    
    #exportNotes:hover::after {
        content: 'Export to PDF/Word/PPT';
        position: absolute;
        top: 100%;
        right: 0;
        background: var(--primary-color);
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 1000;
        margin-top: 5px;
    }
`;

document.head.appendChild(exportStyles);

// Replace the existing exportNotes function
window.exportNotes = function() {
    openExportDialog();
};

window.openSettings = function() {
    settingsModal.style.display = 'flex';
};

window.logout = function() {
    if (confirm('Are you sure you want to logout?')) {
        NoteStorage.clearAll();
        showToast('Logged out successfully. Page will refresh.', 'info');
        setTimeout(() => {
            location.reload();
        }, 1500);
    }
};

window.exportNotes = exportNotes;

// Initialize export functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add library check for PowerPoint
    if (typeof PptxGenJS === 'undefined') {
        console.warn('PptxGenJS library not loaded. PowerPoint export will not work.');
    }
    
    // Make sure jsPDF is available
    if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
        console.warn('jsPDF library not loaded. PDF export will not work.');
    }
});

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);