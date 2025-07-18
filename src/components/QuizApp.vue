<template>
    <div class="quiz-app">
      <div class="header">
        <h1>اختبار معلوماتك الدينية</h1>
        <div class="level-indicator">
          <span>مستواك: {{ level }}</span>
          <div class="progress-bar">
            <div class="progress" :style="{width: (score/100)*100 + '%'}"></div>
          </div>
        </div>
      </div>
  
      <div v-if="!quizStarted" class="category-selection">
        <h2>اختر مجال الاختبار</h2>
        <div class="categories">
          <button 
            v-for="(questions, category) in quizzes" 
            :key="category"
            @click="startQuiz(category)"
            class="category-btn"
          >
            {{ category }}
          </button>
        </div>
      </div>
  
      <div v-else-if="currentQuestion < questions.length" class="question-container">
        <div class="question-header">
          <span>سؤال {{ currentQuestion + 1 }} من {{ questions.length }}</span>
          <span>النقاط: {{ score }}</span>
        </div>
  
        <div class="question-card">
          <h3>{{ questions[currentQuestion].question }}</h3>
          
          <div class="options">
            <button
              v-for="(option, index) in questions[currentQuestion].options"
              :key="index"
              @click="checkAnswer(index)"
              :class="{
                'selected': selectedAnswer === index,
                'correct': showFeedback && index === questions[currentQuestion].answer,
                'incorrect': showFeedback && selectedAnswer === index && index !== questions[currentQuestion].answer
              }"
              :disabled="showFeedback"
            >
              {{ option }}
            </button>
          </div>
  
          <div v-if="showFeedback" class="feedback">
            <p v-if="isCorrect" class="correct-feedback">
              <i class="fas fa-check-circle"></i> إجابة صحيحة!
            </p>
            <p v-else class="incorrect-feedback">
              <i class="fas fa-times-circle"></i> إجابة خاطئة
            </p>
            <p class="explanation">{{ questions[currentQuestion].explanation }}</p>
            <button @click="nextQuestion" class="next-btn">السؤال التالي</button>
          </div>
        </div>
      </div>
  
      <div v-else class="quiz-result">
        <h2>انتهى الاختبار!</h2>
        <div class="result-card" :class="resultClass">
          <h3>نتيجتك: {{ score }} من 100</h3>
          <p>{{ resultMessage }}</p>
          <div class="result-details">
            <p>الإجابات الصحيحة: {{ correctAnswers }} من {{ questions.length }}</p>
            <p>مستواك: {{ level }}</p>
          </div>
          <button @click="resetQuiz" class="restart-btn">إعادة الاختبار</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { quizzes } from '../stores/questions.js';
  
  export default {
    data() {
      return {
        quizzes,
        quizStarted: false,
        selectedCategory: '',
        questions: [],
        currentQuestion: 0,
        selectedAnswer: null,
        showFeedback: false,
        isCorrect: false,
        score: 0,
        correctAnswers: 0
      };
    },
    computed: {
      level() {
        if (this.score >= 80) return 'ممتاز';
        if (this.score >= 60) return 'جيد جداً';
        if (this.score >= 40) return 'متوسط';
        return 'مبتدئ';
      },
      resultClass() {
        return {
          'excellent': this.score >= 80,
          'good': this.score >= 60 && this.score < 80,
          'average': this.score >= 40 && this.score < 60,
          'poor': this.score < 40
        };
      },
      resultMessage() {
        if (this.score >= 80) return 'معلوماتك دينية ممتازة! أحسنت!';
        if (this.score >= 60) return 'لديك معرفة جيدة، استمر في التعلم!';
        if (this.score >= 40) return 'ليس سيئاً، ولكن يمكنك تحسين معلوماتك';
        return 'يبدو أنك بحاجة لمراجعة بعض الأساسيات الدينية';
      }
    },
    methods: {
      startQuiz(category) {
        this.selectedCategory = category;
        this.questions = [...this.quizzes[category]].sort(() => Math.random() - 0.5).slice(0, 10);
        this.quizStarted = true;
        this.currentQuestion = 0;
        this.score = 0;
        this.correctAnswers = 0;
      },
      checkAnswer(index) {
        this.selectedAnswer = index;
        this.isCorrect = index === this.questions[this.currentQuestion].answer;
        this.showFeedback = true;
        
        if (this.isCorrect) {
          this.correctAnswers++;
          this.score += 10;
        }
      },
      nextQuestion() {
        this.currentQuestion++;
        this.selectedAnswer = null;
        this.showFeedback = false;
        this.isCorrect = false;
      },
      resetQuiz() {
        this.quizStarted = false;
        this.selectedCategory = '';
      }
    }
  };
  </script>
  
  <style scoped>
  .quiz-app {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Traditional Arabic', Arial, sans-serif;
    direction: rtl;
  }
  
  .header {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .level-indicator {
    margin-top: 15px;
  }
  
  .progress-bar {
    width: 100%;
    height: 10px;
    background-color: #f0f0f0;
    border-radius: 5px;
    margin-top: 5px;
  }
  
  .progress {
    height: 100%;
    background-color: #4CAF50;
    border-radius: 5px;
    transition: width 0.3s;
  }
  
  .category-selection {
    text-align: center;
  }
  
  .categories {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
    margin-top: 30px;
  }
  
  .category-btn {
    padding: 15px 25px;
    background-color: #2E7D32;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .category-btn:hover {
    background-color: #1B5E20;
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .question-container {
    background-color: #f9f9f9;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .question-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    color: #555;
  }
  
  .question-card h3 {
    font-size: 22px;
    margin-bottom: 25px;
    color: #333;
  }
  
  .options {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .options button {
    padding: 12px 20px;
    background-color: #fff;
    border: 2px solid #ddd;
    border-radius: 8px;
    text-align: right;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .options button:hover:not(:disabled) {
    border-color: #2E7D32;
    background-color: #f0f7f0;
  }
  
  .options button.selected {
    border-color: #2E7D32;
    background-color: #e8f5e9;
  }
  
  .options button.correct {
    border-color: #4CAF50;
    background-color: #e8f5e9;
  }
  
  .options button.incorrect {
    border-color: #f44336;
    background-color: #ffebee;
  }
  
  .feedback {
    margin-top: 25px;
    padding: 15px;
    border-radius: 8px;
    background-color: #f5f5f5;
  }
  
  .correct-feedback {
    color: #2E7D32;
    font-weight: bold;
  }
  
  .incorrect-feedback {
    color: #f44336;
    font-weight: bold;
  }
  
  .explanation {
    margin: 15px 0;
    color: #555;
  }
  
  .next-btn, .restart-btn {
    padding: 10px 20px;
    background-color: #2E7D32;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .next-btn:hover, .restart-btn:hover {
    background-color: #1B5E20;
  }
  
  .quiz-result {
    text-align: center;
  }
  
  .result-card {
    max-width: 500px;
    margin: 0 auto;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  
  .result-card.excellent {
    background-color: #e8f5e9;
    border: 2px solid #4CAF50;
  }
  
  .result-card.good {
    background-color: #e3f2fd;
    border: 2px solid #2196F3;
  }
  
  .result-card.average {
    background-color: #fff8e1;
    border: 2px solid #FFC107;
  }
  
  .result-card.poor {
    background-color: #ffebee;
    border: 2px solid #f44336;
  }
  
  .result-details {
    margin: 20px 0;
    text-align: right;
  }
  
  .result-details p {
    margin: 8px 0;
    color: #555;
  }
  
  @media (max-width: 600px) {
    .categories {
      flex-direction: column;
    }
    
    .category-btn {
      width: 100%;
    }
    
    .question-card h3 {
      font-size: 18px;
    }
  }
  </style>