    // Wheel rotation simulation with volume control
    let isDragging = false;
    let lastY;

    function startRotation(e) {
        isDragging = true;
        lastY = e.clientY || e.touches[0].clientY;
        document.addEventListener('mousemove', rotateWheel);
        document.addEventListener('touchmove', rotateWheel, { passive: false });
        document.addEventListener('mouseup', stopRotation);
        document.addEventListener('touchend', stopRotation);
    }

    function rotateWheel(e) {
        if (!isDragging) return;
        e.preventDefault();

        const currentY = e.clientY || e.touches[0].clientY;
        const deltaY = currentY - lastY;

        // Use deltaY to adjust volume (negative = up/increase, positive = down/decrease)
        if (deltaY < 0) {
            // Increase volume
            audioPlayer.volume = Math.min(1, audioPlayer.volume + 0.02);
        } else if (deltaY > 0) {
            // Decrease volume
            audioPlayer.volume = Math.max(0, audioPlayer.volume - 0.02);
        }

        showVolumeIndicator();
        lastY = currentY;
    }

    function stopRotation() {
        isDragging = false;
        document.removeEventListener('mousemove', rotateWheel);
        document.removeEventListener('touchmove', rotateWheel);
        document.removeEventListener('mouseup', stopRotation);
        document.removeEventListener('touchend', stopRotation);
    }

    // Add wheel rotation events
    const wheel = document.querySelector('.wheel');
    wheel.addEventListener('mousedown', startRotation);
    wheel.addEventListener('touchstart', startRotation, { passive: false });document.addEventListener('DOMContentLoaded', function() {
    // Loading screen handling
    const loadingScreen = document.getElementById('loadingScreen');
    const appContainer = document.getElementById('appContainer');

    // Simulate loading time (you can remove this setTimeout in production)
    setTimeout(() => {
        loadingScreen.classList.add('hide');
        appContainer.classList.add('show');
    }, 2500); // Show loading screen for 2.5 seconds
    // Define tracks
    const tracks = [
        {
            title: "Midnight Study Session",
            artist: "Chillhop Music",
            file: "audio/earl grey.mp3",
            cover: "img/midnight-study.jpg"
        },
        {
            title: "Coffee Shop Ambience",
            artist: "Lo-Fi Beats",
            file: "audio/Evening Walk.mp3",
            cover: "img/coffee-shop.jpg"
        },
        {
            title: "Dreamy Nights",
            artist: "Chill Vibes",
            file: "audio/Holiday.mp3",
            cover: "img/dreamy-nights.jpg"
        },
        {
            title: "Peaceful Rain",
            artist: "Ambient Sounds",
            file: "audio/Stan Forebee - Song For The Sun (with Cloudchord).mp3",
            cover: "img/peaceful-rain.jpg"
        },
        {
            title: "Urban Twilight",
            artist: "Beats Collective",
            file: "audio/wanderlust - midnight hour.mp3",
            cover: "img/urban-twilight.jpg"
        }
    ];

    // Elements
    const audioPlayer = document.getElementById('audioPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playPauseIcon = document.getElementById('playPauseIcon');
    const playIcon = document.getElementById('playIcon');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const menuBtn = document.getElementById('menuBtn');
    const selectBtn = document.getElementById('selectBtn');
    const menuOverlay = document.getElementById('menuOverlay');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const progressTrack = document.getElementById('progressTrack');
    const currentTime = document.getElementById('currentTime');
    const totalTime = document.getElementById('totalTime');
    const trackTitle = document.getElementById('trackTitle');
    const trackArtist = document.getElementById('trackArtist');
    const albumArt = document.getElementById('albumArt');
    const trackList = document.getElementById('trackList');
    const menuItems = document.querySelectorAll('.menu-item');

    // State
    let currentTrackIndex = 0;
    let isPlaying = false;
    let activeMenuItem = 0;

    // Theme configuration
    const themes = {
        classic: {
            name: "Classic White",
            colors: {
                background: "#f5f5f7",
                ipodBody: "#e2e2e2",
                screenBg: "#fff",
                textPrimary: "#333",
                textSecondary: "#666",
                accent: "#007aff",
                progressBar: "#007aff",
                menuActive: "#007aff",
                wheelColor: "#e2e2e2",
                centerButtonColor: "#e2e2e2",
                buttonText: "#333",
                buttonHover: "#007aff"
            }
        },
        dark: {
            name: "Space Gray",
            colors: {
                background: "#0a0a0a",
                ipodBody: "#1a1a1a",
                screenBg: "#121212",
                textPrimary: "#ffffff",
                textSecondary: "#aaaaaa",
                accent: "#0087ff",
                progressBar: "#0087ff",
                menuActive: "#0087ff",
                wheelColor: "#2a2a2a",
                centerButtonColor: "#2a2a2a",
                buttonText: "#ffffff",
                buttonHover: "#0087ff"
            }
        },
        retro: {
            name: "Retro Blue",
            colors: {
                background: "#c4e0f9",
                ipodBody: "#3b5998",
                screenBg: "#d9e6ff",
                textPrimary: "#222222",
                textSecondary: "#333333",
                accent: "#ff6b00",
                progressBar: "#ff6b00",
                menuActive: "#ff6b00",
                wheelColor: "#5d76b9",
                centerButtonColor: "#5d76b9",
                buttonText: "#ffffff",
                buttonHover: "#ff6b00"
            }
        },
        lofi: {
            name: "Lofi Aesthetic",
            colors: {
                background: "#ffefd5",
                ipodBody: "#e8c39e",
                screenBg: "#fff8dc",
                textPrimary: "#483c32",
                textSecondary: "#6e5f4b",
                accent: "#9f7d5a",
                progressBar: "#9f7d5a",
                menuActive: "#9f7d5a",
                wheelColor: "#ddb892",
                centerButtonColor: "#ddb892",
                buttonText: "#483c32",
                buttonHover: "#9f7d5a"
            }
        },
        midnight: {
            name: "Midnight Study",
            colors: {
                background: "#0d1117",
                ipodBody: "#161b22",
                screenBg: "#21262d",
                textPrimary: "#e6edf3",
                textSecondary: "#8b949e",
                accent: "#7c3aed",
                progressBar: "#7c3aed",
                menuActive: "#7c3aed",
                wheelColor: "#2d333b",
                centerButtonColor: "#2d333b",
                buttonText: "#e6edf3",
                buttonHover: "#7c3aed"
            }
        }
    };

    // Get RBG values from hex for opacity support
    function hexToRgb(hex) {
        // Remove the hash if it exists
        hex = hex.replace('#', '');

        // Parse the hex values
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);

        return `${r}, ${g}, ${b}`;
    }

    // Apply theme function
    function applyTheme(themeName) {
        if (!themes[themeName]) {
            console.error("Theme not found:", themeName);
            return;
        }

        console.log("Applying theme:", themes[themeName].name);

        const theme = themes[themeName].colors;
        const root = document.documentElement;

        // Set CSS variables
        root.style.setProperty('--background', theme.background);
        root.style.setProperty('--ipod-body', theme.ipodBody);
        root.style.setProperty('--screen-bg', theme.screenBg);
        root.style.setProperty('--text-primary', theme.textPrimary);
        root.style.setProperty('--text-secondary', theme.textSecondary);
        root.style.setProperty('--accent', theme.accent);
        root.style.setProperty('--accent-rgb', hexToRgb(theme.accent));
        root.style.setProperty('--progress-bar', theme.progressBar);
        root.style.setProperty('--menu-active', theme.menuActive);
        root.style.setProperty('--wheel-color', theme.wheelColor);
        root.style.setProperty('--center-button-color', theme.centerButtonColor);
        root.style.setProperty('--button-text', theme.buttonText);
        root.style.setProperty('--button-hover', theme.buttonHover);

        // Save theme preference
        localStorage.setItem('lofiPlayerTheme', themeName);

        // Update theme menu selection
        const themeItems = document.querySelectorAll('.theme-item');
        themeItems.forEach(item => {
            if (item.dataset.theme === themeName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Initialize
    function initPlayer() {
        console.log("Initializing player...");

        // Apply saved theme or default
        const savedTheme = localStorage.getItem('lofiPlayerTheme') || 'classic';
        applyTheme(savedTheme);

        // Initialize volume display
        updateVolumeIndicator();

        // Populate theme list
        const themeList = document.getElementById('themeList');
        const themeUl = document.createElement('ul');

        Object.keys(themes).forEach(themeName => {
            const theme = themes[themeName];
            const li = document.createElement('li');
            li.className = 'theme-item';
            if (themeName === savedTheme) {
                li.classList.add('active');
            }
            li.dataset.theme = themeName;

            // Create color preview
            const colorPreview = document.createElement('div');
            colorPreview.className = 'theme-color-preview';
            colorPreview.style.backgroundColor = theme.colors.accent;

            // Set content
            li.appendChild(colorPreview);
            li.insertAdjacentText('beforeend', theme.name);

            // Add click handler
            li.addEventListener('click', () => {
                applyTheme(themeName);
                closeMenu();
            });

            themeUl.appendChild(li);
        });

        themeList.appendChild(themeUl);

        // Create track list
        const ul = document.createElement('ul');
        tracks.forEach((track, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="track-number">${index + 1}</div>
                <div class="track-details">
                    <div class="track-title-list">${track.title}</div>
                    <div class="track-artist-list">${track.artist}</div>
                </div>
            `;
            li.addEventListener('click', () => {
                loadTrack(index);
                playTrack();
                closeMenu();
            });
            if (index === currentTrackIndex) {
                li.classList.add('active');
            }
            ul.appendChild(li);
        });
        trackList.appendChild(ul);

        // Load first track
        loadTrack(0);

        // Set initial volume
        audioPlayer.volume = 0.7;

        // Add event listeners
        audioPlayer.addEventListener('timeupdate', updateProgress);
        audioPlayer.addEventListener('loadedmetadata', updateTotalTime);
        audioPlayer.addEventListener('ended', nextTrack);

        // Add keyboard controls
        document.addEventListener('keydown', handleKeyPress);
    }

    // Load track
    function loadTrack(index) {
        console.log("Loading track:", index, tracks[index].title);
        currentTrackIndex = index;

        // Update active track in list
        const trackItems = trackList.querySelectorAll('li');
        trackItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        const track = tracks[index];

        try {
            // Set audio source and load it
            audioPlayer.src = track.file;
            console.log("Set audio source to:", track.file);

            // Update UI
            trackTitle.textContent = track.title;
            trackArtist.textContent = track.artist;

            // Handle image loading
            try {
                albumArt.style.backgroundImage = `url('${track.cover}')`;
            } catch (imgError) {
                console.error("Error setting album art:", imgError);
                albumArt.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"120\" height=\"120\" viewBox=\"0 0 120 120\"><rect width=\"120\" height=\"120\" fill=\"%23f0f0f0\"/><text x=\"50%\" y=\"50%\" font-family=\"Arial\" font-size=\"12\" fill=\"%23999\" text-anchor=\"middle\" dy=\".3em\">Album Art</text></svg>')";
            }

            // Reset progress
            progressTrack.style.width = '0%';
            currentTime.textContent = '0:00';

            // Load audio file
            audioPlayer.load();
            console.log("Audio file loaded");

            // Check if audio is actually loaded
            if (audioPlayer.readyState === 0) {
                console.warn("Audio element may not be fully loaded");
            }
        } catch (error) {
            console.error("Error in loadTrack:", error);
        }
    }

    // Play track
    function playTrack() {
        console.log("Attempting to play track:", tracks[currentTrackIndex].title);

        // Add a promise to handle playback attempts
        audioPlayer.play()
            .then(() => {
                console.log("Playback started successfully");
                isPlaying = true;
                playPauseIcon.className = 'fas fa-pause';
                playIcon.className = 'fas fa-pause';
            })
            .catch(e => {
                console.error("Error playing audio:", e);
                alert("Unable to play the audio. This might be due to browser autoplay policies. Please try clicking the play button directly.");
                isPlaying = false;
            });
    }

    // Pause track
    function pauseTrack() {
        audioPlayer.pause();
        isPlaying = false;
        playPauseIcon.className = 'fas fa-play';
        playIcon.className = 'fas fa-play';
    }

    // Toggle play/pause
    function togglePlayPause() {
        if (isPlaying) {
            pauseTrack();
        } else {
            playTrack();
        }
    }

    // Previous track
    function prevTrack() {
        let index = currentTrackIndex - 1;
        if (index < 0) {
            index = tracks.length - 1;
        }
        loadTrack(index);
        if (isPlaying) {
            playTrack();
        }
    }

    // Next track
    function nextTrack() {
        let index = currentTrackIndex + 1;
        if (index >= tracks.length) {
            index = 0;
        }
        loadTrack(index);
        if (isPlaying) {
            playTrack();
        }
    }

    // Update progress bar and time
    function updateProgress() {
        const duration = audioPlayer.duration;
        const currentTimeValue = audioPlayer.currentTime;

        if (duration) {
            // Update progress bar
            const progressPercent = (currentTimeValue / duration) * 100;
            progressTrack.style.width = progressPercent + '%';

            // Update time display
            currentTime.textContent = formatTime(currentTimeValue);
        }
    }

    // Update total time display
    function updateTotalTime() {
        totalTime.textContent = formatTime(audioPlayer.duration);
    }

    // Format time (convert seconds to mm:ss)
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Menu functions
    function openMenu() {
        menuOverlay.style.display = 'flex';
        activeMenuItem = 0;
        updateMenuUI();
    }

    function closeMenu() {
        menuOverlay.style.display = 'none';
        trackList.style.display = 'none';
        document.getElementById('themeList').style.display = 'none';
    }

    function toggleMenu() {
        if (menuOverlay.style.display === 'flex') {
            closeMenu();
        } else {
            openMenu();
        }
    }

    // Handle menu selection
    function selectMenuItem(index) {
        activeMenuItem = index;
        updateMenuUI();

        if (index === 0) {
            // Now Playing
            trackList.style.display = 'none';
            document.getElementById('themeList').style.display = 'none';
        } else if (index === 1) {
            // Tracks
            trackList.style.display = 'block';
            document.getElementById('themeList').style.display = 'none';
        } else if (index === 2) {
            // Themes
            trackList.style.display = 'none';
            document.getElementById('themeList').style.display = 'block';
        }
    }

    // Update menu UI
    function updateMenuUI() {
        menuItems.forEach((item, index) => {
            if (index === activeMenuItem) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Handle center button actions
    function handleCenterButtonClick() {
        if (menuOverlay.style.display === 'flex') {
            // Menu is open
            if (activeMenuItem === 0) {
                // Now Playing - close menu
                closeMenu();
            } else if (activeMenuItem === 1) {
                // Tracks - select current track
                const trackItems = trackList.querySelectorAll('li');
                if (trackItems[currentTrackIndex]) {
                    trackItems[currentTrackIndex].click();
                }
            } else if (activeMenuItem === 2) {
                // Themes - select current theme
                const themeItems = document.querySelectorAll('.theme-item.active');
                if (themeItems[0]) {
                    themeItems[0].click();
                }
            }
        } else {
            // Menu is closed, toggle play/pause
            togglePlayPause();
        }
    }

    // Volume control with visual indicator
    let volumeTimeout;
    const volumeIndicator = document.getElementById('volumeIndicator');
    const volumeLevelFill = document.getElementById('volumeLevelFill');
    const volumeIconElement = document.getElementById('volumeIcon');

    function showVolumeIndicator() {
        // Clear any existing timeout
        clearTimeout(volumeTimeout);

        // Update volume level display
        updateVolumeIndicator();

        // Show the indicator
        volumeIndicator.classList.add('show');

        // Set a timeout to hide it
        volumeTimeout = setTimeout(() => {
            volumeIndicator.classList.remove('show');
        }, 2000);
    }

    function updateVolumeIndicator() {
        // Update the fill level
        volumeLevelFill.style.width = (audioPlayer.volume * 100) + '%';

        // Update the icon based on level
        if (audioPlayer.volume === 0) {
            volumeIconElement.className = 'fas fa-volume-mute';
        } else if (audioPlayer.volume < 0.5) {
            volumeIconElement.className = 'fas fa-volume-down';
        } else {
            volumeIconElement.className = 'fas fa-volume-up';
        }
    }

    // Add keyboard volume controls
    function handleKeyPress(e) {
        if (e.target === document.body) {
            if (e.code === 'Space') {
                e.preventDefault();
                togglePlayPause();
            } else if (e.code === 'ArrowRight') {
                nextTrack();
            } else if (e.code === 'ArrowLeft') {
                prevTrack();
            } else if (e.code === 'Escape') {
                closeMenu();
            } else if (e.code === 'ArrowUp') {
                // Increase volume
                e.preventDefault();
                if (audioPlayer.volume < 0.95) {
                    audioPlayer.volume = Math.min(1, audioPlayer.volume + 0.05);
                    showVolumeIndicator();
                }
            } else if (e.code === 'ArrowDown') {
                // Decrease volume
                e.preventDefault();
                if (audioPlayer.volume > 0.05) {
                    audioPlayer.volume = Math.max(0, audioPlayer.volume - 0.05);
                    showVolumeIndicator();
                }
            }
        }
    }

    // Prevent scrolling with arrow keys
    window.addEventListener('keydown', function(e) {
        if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
            if(e.target === document.body) {
                e.preventDefault();
            }
        }
    });

    // Click events
    playPauseBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', prevTrack);
    nextBtn.addEventListener('click', nextTrack);
    menuBtn.addEventListener('click', toggleMenu);
    closeMenuBtn.addEventListener('click', closeMenu);
    selectBtn.addEventListener('click', handleCenterButtonClick);

    // Menu item clicks
    menuItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            selectMenuItem(index);
        });
    });

    // Close menu if clicking outside
    menuOverlay.addEventListener('click', function(e) {
        if (e.target === menuOverlay) {
            closeMenu();
        }
    });

    // Initialize player
    initPlayer();
});        // Apply saved theme or default
        const savedTheme = localStorage.getItem('lofiPlayerTheme') || 'classic';
        applyTheme(savedTheme);

        // Populate theme list
        const themeList = document.getElementById('themeList');
        const themeUl = document.createElement('ul');

        Object.keys(themes).forEach(themeName => {
            const theme = themes[themeName];
            const li = document.createElement('li');
            li.className = 'theme-item';
            if (themeName === savedTheme) {
                li.classList.add('active');
            }
            li.dataset.theme = themeName;

            // Create color preview
            const colorPreview = document.createElement('div');
            colorPreview.className = 'theme-color-preview';
            colorPreview.style.backgroundColor = theme.colors.accent;

            // Set content
            li.appendChild(colorPreview);
            li.insertAdjacentText('beforeend', theme.name);

            // Add click handler
            li.addEventListener('click', () => {
                applyTheme(themeName);
                closeMenu();
            });

            themeUl.appendChild(li);
        });

        themeList.appendChild(themeUl);document.addEventListener('DOMContentLoaded', function() {
    // Define tracks - Using direct, reliable audio sources
    const tracks = [
        {
            title: "Midnight Study Session",
            artist: "Chillhop Music",
            file: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_1bc7f5ffd7.mp3",
            cover: "images/midnight-study.jpg" // Replace with your actual image path
        },
        {
            title: "Coffee Shop Ambience",
            artist: "Lo-Fi Beats",
            file: "https://cdn.pixabay.com/download/audio/2022/05/16/audio_fedc4feb0c.mp3",
            cover: "images/coffee-shop.jpg" // Replace with your actual image path
        },
        {
            title: "Dreamy Nights",
            artist: "Chill Vibes",
            file: "https://cdn.pixabay.com/download/audio/2022/10/31/audio_946bc8fcde.mp3",
            cover: "images/dreamy-nights.jpg" // Replace with your actual image path
        },
        {
            title: "Peaceful Rain",
            artist: "Ambient Sounds",
            file: "https://cdn.pixabay.com/download/audio/2021/11/13/audio_cb4f1212a9.mp3",
            cover: "images/peaceful-rain.jpg" // Replace with your actual image path
        },
        {
            title: "Urban Twilight",
            artist: "Beats Collective",
            file: "https://cdn.pixabay.com/download/audio/2022/10/25/audio_e2aca7c92b.mp3",
            cover: "images/urban-twilight.jpg" // Replace with your actual image path
        }
    ];

    // Elements
    const audioPlayer = document.getElementById('audioPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playPauseIcon = document.getElementById('playPauseIcon');
    const playIcon = document.getElementById('playIcon');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const menuBtn = document.getElementById('menuBtn');
    const selectBtn = document.getElementById('selectBtn');
    const menuOverlay = document.getElementById('menuOverlay');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const progressTrack = document.getElementById('progressTrack');
    const currentTime = document.getElementById('currentTime');
    const totalTime = document.getElementById('totalTime');
    const trackTitle = document.getElementById('trackTitle');
    const trackArtist = document.getElementById('trackArtist');
    const albumArt = document.getElementById('albumArt');
    const trackList = document.getElementById('trackList');
    const menuItems = document.querySelectorAll('.menu-item');

    // State
    let currentTrackIndex = 0;
    let isPlaying = false;
    let activeMenuItem = 0;

    // Theme configuration
    const themes = {
        classic: {
            name: "Classic White",
            colors: {
                background: "#f5f5f7",
                ipodBody: "#e2e2e2",
                screenBg: "#fff",
                textPrimary: "#333",
                textSecondary: "#666",
                accent: "#007aff",
                progressBar: "#007aff",
                menuActive: "#007aff"
            }
        },
        dark: {
            name: "Space Gray",
            colors: {
                background: "#1a1a1a",
                ipodBody: "#303030",
                screenBg: "#222",
                textPrimary: "#fff",
                textSecondary: "#aaa",
                accent: "#0087ff",
                progressBar: "#0087ff",
                menuActive: "#0087ff"
            }
        },
        retro: {
            name: "Retro Blue",
            colors: {
                background: "#c4e0f9",
                ipodBody: "#3b5998",
                screenBg: "#d9e6ff",
                textPrimary: "#222",
                textSecondary: "#333",
                accent: "#ff6b00",
                progressBar: "#ff6b00",
                menuActive: "#ff6b00"
            }
        },
        lofi: {
            name: "Lofi Aesthetic",
            colors: {
                background: "#ffefd5",
                ipodBody: "#e8c39e",
                screenBg: "#fff8dc",
                textPrimary: "#483c32",
                textSecondary: "#6e5f4b",
                accent: "#9f7d5a",
                progressBar: "#9f7d5a",
                menuActive: "#9f7d5a"
            }
        },
        midnight: {
            name: "Midnight Study",
            colors: {
                background: "#0d1117",
                ipodBody: "#161b22",
                screenBg: "#21262d",
                textPrimary: "#e6edf3",
                textSecondary: "#8b949e",
                accent: "#7c3aed",
                progressBar: "#7c3aed",
                menuActive: "#7c3aed"
            }
        }
    };

    // Apply theme function
    function applyTheme(themeName) {
        if (!themes[themeName]) {
            console.error("Theme not found:", themeName);
            return;
        }

        console.log("Applying theme:", themes[themeName].name);

        const theme = themes[themeName].colors;
        const root = document.documentElement;

        // Set CSS variables
        root.style.setProperty('--background', theme.background);
        root.style.setProperty('--ipod-body', theme.ipodBody);
        root.style.setProperty('--screen-bg', theme.screenBg);
        root.style.setProperty('--text-primary', theme.textPrimary);
        root.style.setProperty('--text-secondary', theme.textSecondary);
        root.style.setProperty('--accent', theme.accent);
        root.style.setProperty('--progress-bar', theme.progressBar);
        root.style.setProperty('--menu-active', theme.menuActive);

        // Save theme preference
        localStorage.setItem('lofiPlayerTheme', themeName);

        // Update theme menu selection
        const themeItems = document.querySelectorAll('.theme-item');
        themeItems.forEach(item => {
            if (item.dataset.theme === themeName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Initialize
    function initPlayer() {
        console.log("Initializing player...");

        // Create track list
        const ul = document.createElement('ul');
        tracks.forEach((track, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="track-number">${index + 1}</div>
                <div class="track-details">
                    <div class="track-title-list">${track.title}</div>
                    <div class="track-artist-list">${track.artist}</div>
                </div>
            `;
            li.addEventListener('click', () => {
                loadTrack(index);
                playTrack();
                closeMenu();
            });
            if (index === currentTrackIndex) {
                li.classList.add('active');
            }
            ul.appendChild(li);
        });
        trackList.appendChild(ul);

        // Load first track
        loadTrack(0);

        // Set initial volume
        audioPlayer.volume = 0.7;

        // Add event listeners
        audioPlayer.addEventListener('timeupdate', updateProgress);
        audioPlayer.addEventListener('loadedmetadata', updateTotalTime);
        audioPlayer.addEventListener('ended', nextTrack);

        // Add keyboard controls
        document.addEventListener('keydown', handleKeyPress);
    }

    // Load track
    function loadTrack(index) {
        console.log("Loading track:", index, tracks[index].title);
        currentTrackIndex = index;

        // Update active track in list
        const trackItems = trackList.querySelectorAll('li');
        trackItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        const track = tracks[index];

        try {
            // Set audio source and load it
            audioPlayer.src = track.file;
            console.log("Set audio source to:", track.file);

            // Update UI
            trackTitle.textContent = track.title;
            trackArtist.textContent = track.artist;

            // Handle image loading
            try {
                albumArt.style.backgroundImage = `url('${track.cover}')`;
            } catch (imgError) {
                console.error("Error setting album art:", imgError);
                albumArt.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"120\" height=\"120\" viewBox=\"0 0 120 120\"><rect width=\"120\" height=\"120\" fill=\"%23f0f0f0\"/><text x=\"50%\" y=\"50%\" font-family=\"Arial\" font-size=\"12\" fill=\"%23999\" text-anchor=\"middle\" dy=\".3em\">Album Art</text></svg>')";
            }

            // Reset progress
            progressTrack.style.width = '0%';
            currentTime.textContent = '0:00';

            // Load audio file
            audioPlayer.load();
            console.log("Audio file loaded");

            // Check if audio is actually loaded
            if (audioPlayer.readyState === 0) {
                console.warn("Audio element may not be fully loaded");
            }
        } catch (error) {
            console.error("Error in loadTrack:", error);
        }
    }

    // Play track
    function playTrack() {
        console.log("Attempting to play track:", tracks[currentTrackIndex].title);

        // Add a promise to handle playback attempts
        audioPlayer.play()
            .then(() => {
                console.log("Playback started successfully");
                isPlaying = true;
                playPauseIcon.className = 'fas fa-pause';
                playIcon.className = 'fas fa-pause';
            })
            .catch(e => {
                console.error("Error playing audio:", e);
                alert("Unable to play the audio. This might be due to browser autoplay policies. Please try clicking the play button directly.");
                isPlaying = false;
            });
    }

    // Pause track
    function pauseTrack() {
        audioPlayer.pause();
        isPlaying = false;
        playPauseIcon.className = 'fas fa-play';
        playIcon.className = 'fas fa-play';
    }

    // Toggle play/pause
    function togglePlayPause() {
        if (isPlaying) {
            pauseTrack();
        } else {
            playTrack();
        }
    }

    // Previous track
    function prevTrack() {
        let index = currentTrackIndex - 1;
        if (index < 0) {
            index = tracks.length - 1;
        }
        loadTrack(index);
        if (isPlaying) {
            playTrack();
        }
    }

    // Next track
    function nextTrack() {
        let index = currentTrackIndex + 1;
        if (index >= tracks.length) {
            index = 0;
        }
        loadTrack(index);
        if (isPlaying) {
            playTrack();
        }
    }

    // Update progress bar and time
    function updateProgress() {
        const duration = audioPlayer.duration;
        const currentTimeValue = audioPlayer.currentTime;

        if (duration) {
            // Update progress bar
            const progressPercent = (currentTimeValue / duration) * 100;
            progressTrack.style.width = progressPercent + '%';

            // Update time display
            currentTime.textContent = formatTime(currentTimeValue);
        }
    }

    // Update total time display
    function updateTotalTime() {
        totalTime.textContent = formatTime(audioPlayer.duration);
    }

    // Format time (convert seconds to mm:ss)
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Menu functions
    function openMenu() {
        menuOverlay.style.display = 'flex';
        activeMenuItem = 0;
        updateMenuUI();
    }

    function closeMenu() {
        menuOverlay.style.display = 'none';
        trackList.style.display = 'none';
    }

    function toggleMenu() {
        if (menuOverlay.style.display === 'flex') {
            closeMenu();
        } else {
            openMenu();
        }
    }

    // Handle menu selection
    function selectMenuItem(index) {
        activeMenuItem = index;
        updateMenuUI();

        if (index === 0) {
            // Now Playing
            trackList.style.display = 'none';
            document.getElementById('themeList').style.display = 'none';
        } else if (index === 1) {
            // Tracks
            trackList.style.display = 'block';
            document.getElementById('themeList').style.display = 'none';
        } else if (index === 2) {
            // Themes
            trackList.style.display = 'none';
            document.getElementById('themeList').style.display = 'block';
        }
    }

    // Update menu UI
    function updateMenuUI() {
        menuItems.forEach((item, index) => {
            if (index === activeMenuItem) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Handle center button actions
    function handleCenterButtonClick() {
        if (menuOverlay.style.display === 'flex') {
            // Menu open
            if (activeMenuItem === 0) {
                closeMenu();
            } else if (activeMenuItem === 1) {
                const trackItems = trackList.querySelectorAll('li');
                if (trackItems[currentTrackIndex]) {
                    trackItems[currentTrackIndex].click();
                }
            }
        } else {
            togglePlayPause();
        }
    }

    // Handle keyboard events
    function handleKeyPress(e) {
        if (e.target === document.body) {
            if (e.code === 'Space') {
                e.preventDefault();
                togglePlayPause();
            } else if (e.code === 'ArrowRight') {
                nextTrack();
            } else if (e.code === 'ArrowLeft') {
                prevTrack();
            } else if (e.code === 'Escape') {
                closeMenu();
            }
        }
    }

    // Prevent scrolling with arrow keys
    window.addEventListener('keydown', function(e) {
        if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
            if(e.target === document.body) {
                e.preventDefault();
            }
        }
    });

    // Click events
    playPauseBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', prevTrack);
    nextBtn.addEventListener('click', nextTrack);
    menuBtn.addEventListener('click', toggleMenu);
    closeMenuBtn.addEventListener('click', closeMenu);
    selectBtn.addEventListener('click', handleCenterButtonClick);

    // Menu item clicks
    menuItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            selectMenuItem(index);
        });
    });

    // Close menu if clicking outside
    menuOverlay.addEventListener('click', function(e) {
        if (e.target === menuOverlay) {
            closeMenu();
        }
    });

    // Initialize player
    initPlayer();
});
