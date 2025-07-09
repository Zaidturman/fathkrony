<template>
  <div class="settings-container" :class="{ dark: theme === 'dark' }">
    <div class="settings-header">
      <h2>إعدادات التطبيق</h2>
      <button class="close-btn" @click="$emit('close')">✕</button>
    </div>

    <div class="settings-content">
      <div class="setting-item">
        <div class="setting-info">
          <span class="setting-icon">🌓</span>
          <span class="setting-label">الوضع الليلي</span>
        </div>
        <label class="switch">
          <input type="checkbox" v-model="isDark" @change="toggleTheme">
          <span class="slider round"></span>
        </label>
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <span class="setting-icon">🔊</span>
          <span class="setting-label">الصوت</span>
        </div>
        <label class="switch">
          <input type="checkbox" v-model="soundEnabled" @change="toggleSound">
          <span class="slider round"></span>
        </label>
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <span class="setting-icon">🔄</span>
          <span class="setting-label">إعادة تعيين الإحصائيات</span>
        </div>
        <button class="reset-btn" @click="resetStats">إعادة تعيين</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      theme: 'light',
      soundEnabled: true
    };
  },
  computed: {
    isDark: {
      get() {
        return this.theme === 'dark';
      },
      set(value) {
        this.theme = value ? 'dark' : 'light';
      }
    }
  },
  mounted() {
    this.loadSettings();
  },
  methods: {
    toggleTheme() {
      this.saveSettings();
      this.applyTheme();
    },
    toggleSound() {
      this.saveSettings();
      this.$emit('sound-toggle', this.soundEnabled);
    },
    resetStats() {
      if(confirm('هل أنت متأكد من رغبتك في إعادة تعيين جميع الإحصائيات؟')) {
        this.$emit('reset-stats');
      }
    },
    saveSettings() {
      localStorage.setItem('app-settings', JSON.stringify({
        theme: this.theme,
        soundEnabled: this.soundEnabled
      }));
    },
    loadSettings() {
      const savedSettings = localStorage.getItem('app-settings');
      if (savedSettings) {
        const { theme, soundEnabled } = JSON.parse(savedSettings);
        this.theme = theme || 'light';
        this.soundEnabled = soundEnabled !== false;
        this.applyTheme();
      }
    },
    applyTheme() {
      document.documentElement.setAttribute('data-theme', this.theme);
    }
  }
};
</script>

<style scoped>
:root {
  --primary-color: #4c6ef5;
  --secondary-color: #748ffc;
  --danger-color: #fa5252;
  --success-color: #40c057;
  --warning-color: #fab005;
  --light-bg: #f8f9fa;
  --light-text: #495057;
  --dark-bg: #212529;
  --dark-text: #f8f9fa;
  --border-radius: 12px;
  --box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.settings-container {
  padding: 24px;
  background: var(--light-bg);
  color: var(--light-text);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  width: 380px;
  max-width: 95%;
  transition: var(--transition);
  position: relative;
  margin: 20px auto;
}

.settings-container.dark {
  background: var(--dark-bg);
  color: var(--dark-text);
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.settings-container.dark .settings-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

h2 {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--primary-color);
}

.close-btn {
  background: rgba(0, 0, 0, 0.05);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--light-text);
  transition: var(--transition);
}

.settings-container.dark .close-btn {
  background: rgba(255, 255, 255, 0.1);
  color: var(--dark-text);
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: rotate(90deg);
}

.settings-container.dark .close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: var(--transition);
}

.settings-container.dark .setting-item {
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.setting-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.settings-container.dark .setting-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.setting-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.setting-icon {
  font-size: 1.4rem;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(76, 110, 245, 0.1);
  border-radius: 8px;
  color: var(--primary-color);
}

.setting-label {
  font-size: 1.05rem;
  font-weight: 500;
}

.switch {
  position: relative;
  display: inline-block;
  width: 56px;
  height: 30px;
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
  transition: var(--transition);
}

.slider.round {
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 24px;
  width: 24px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: var(--transition);
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--primary-color);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.reset-btn {
  background: var(--danger-color);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: var(--transition);
  min-width: 90px;
}

.reset-btn:hover {
  background: #e03131;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(250, 82, 82, 0.3);
}

@media (max-width: 768px) {
  .settings-container {
    width: 340px;
    padding: 20px;
  }
  
  h2 {
    font-size: 1.5rem;
  }
  
  .setting-item {
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .settings-container {
    width: 300px;
    padding: 16px;
  }
  
  .setting-info {
    gap: 10px;
  }
  
  .setting-icon {
    font-size: 1.2rem;
    width: 28px;
    height: 28px;
  }
  
  .setting-label {
    font-size: 1rem;
  }
  
  .switch {
    width: 50px;
    height: 26px;
  }
  
  .slider:before {
    height: 20px;
    width: 20px;
  }
  
  input:checked + .slider:before {
    transform: translateX(24px);
  }
}
</style>