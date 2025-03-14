<template>
    <div class="settings-container" :class="{ dark: theme === 'dark' }">
      <h2>إعدادات التطبيق</h2>
  
      <div class="theme-toggle">
        <span>فاتح</span>
        <label class="switch">
          <input type="checkbox" v-model="isDark" @change="toggleTheme">
          <span class="slider"></span>
        </label>
        <span>داكن</span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        theme: 'light'
      };
    },
    computed: {
      isDark() {
        return this.theme === 'dark';
      }
    },
    mounted() {
      this.loadTheme();
    },
    methods: {
      toggleTheme() {
        this.theme = this.isDark ? 'light' : 'dark';
        this.saveTheme();
      },
      saveTheme() {
        localStorage.setItem('app-theme', this.theme);
        this.applyTheme();
      },
      loadTheme() {
        const savedTheme = localStorage.getItem('app-theme');
        if (savedTheme) {
          this.theme = savedTheme;
          this.applyTheme();
        }
      },
      applyTheme() {
        if (this.theme === 'dark') {
          document.body.classList.add('dark-theme');
        } else {
          document.body.classList.remove('dark-theme');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  *{
    font-family: "Cairo";
  }
  .settings-container {
    padding: 30px;
    text-align: center;
    background: #f0f0f0;
    color: #333;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    max-width: 400px;
    height: 100vh;
  }
  
  .settings-container.dark {
    background: #2c2c2c;
    color: #fff;
  }
  
  h2 {
    margin-bottom: 20px;
    font-size: 1.6rem;
  }
  
  .theme-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    font-size: 1.2rem;
  }
  
  .switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 28px;
  }
  
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.3s;
    border-radius: 34px;
  }
  
  .slider:before {
    position: absolute;
    content: "";
    height: 22px;
    width: 22px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
  }
  
  input:checked + .slider {
    background-color: #4caf50;
  }
  
  input:checked + .slider:before {
    transform: translateX(22px);
  }
  
  body.dark-theme {
    background-color: #121212;
    color: white;
  }
  </style>
  