document.getElementById('themeSelect').addEventListener('change', function() {
    const theme = this.value;
    document.body.classList.remove('light-theme', 'dark-theme');
    document.querySelector('.sidebar').classList.remove('light-theme', 'dark-theme');
    
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        document.querySelector('.sidebar').classList.add('dark-theme');
    } else {
        document.body.classList.add('light-theme');
        document.querySelector('.sidebar').classList.add('light-theme');
    }
});