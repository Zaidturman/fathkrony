<template>
  <div class="quiz-wrapper">
    <div class="quiz-header">
      <div class="quiz-info">
        <h1>اختبار معلوماتك الدينية</h1>
        <p v-if="quizStarted && !showResult">سؤال {{ currentQuestion + 1 }} من {{ questions.length }}</p>
      </div>
      <div class="score-info">
        <p>النقاط: {{ score }} من {{ totalPossibleScore }}</p>
        <p>المستوى: {{ level }}</p>
      </div>
    </div>

    <transition name="fade" mode="out-in">
      <div v-if="!quizStarted" class="category-selection" key="categories">
        <h2>اختر مجال الاختبار</h2>
        <div class="categories">
          <button 
            v-for="(questions, category) in quizzes" 
            :key="category"
            @click="startQuiz(category)"
            class="category-btn"
          >
            <div class="category-icon">
              <i :class="categoryIcons[category]"></i>
            </div>
            <span>{{ category }}</span>
          </button>
        </div>
      </div>

      <div v-else-if="!showResult" class="question-container" key="question">
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
              <span v-if="showFeedback && index === questions[currentQuestion].answer" class="correct-mark">
                <i class="fas fa-check"></i>
              </span>
            </button>
          </div>

          <div v-if="showFeedback" class="feedback">
            <p v-if="isCorrect" class="correct-feedback">
              <i class="fas fa-check-circle"></i> إجابة صحيحة
            </p>
            <p v-else class="incorrect-feedback">
              <i class="fas fa-times-circle"></i> إجابة خاطئة
            </p>
            <p class="explanation">{{ questions[currentQuestion].explanation }}</p>
            <button @click="nextQuestion" class="next-btn">
              {{ isLastQuestion ? 'عرض النتيجة' : 'السؤال التالي' }}
            </button>
          </div>
        </div>
      </div>

      <div v-else class="quiz-result" key="result">
        <h2>انتهى الاختبار!</h2>
        <div class="result-card" :class="resultClass">
          <div class="result-badge">
            <i :class="resultIcon"></i>
          </div>
          <h3>نتيجتك: {{ score }} من {{ totalPossibleScore }}</h3>
          <p>{{ resultMessage }}</p>
          <div class="result-details">
            <p><i class="fas fa-check-circle"></i> الإجابات الصحيحة: {{ correctAnswers }}</p>
            <p><i class="fas fa-times-circle"></i> الإجابات الخاطئة: {{ incorrectAnswers }}</p>
            <p><i class="fas fa-trophy"></i> مستواك: {{ level }}</p>
          </div>
          <div class="actions">
            <button @click="resetQuiz" class="restart-btn">
              <i class="fas fa-redo"></i> إعادة الاختبار
            </button>
            <button @click="chooseAnotherCategory" class="another-btn">
              <i class="fas fa-list"></i> اختبار آخر
            </button>
          </div>
        </div>
      </div>
    </transition>

    <div class="footer">
      برمجة وتطوير زيد طرمان
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
      correctAnswers: 0,
      incorrectAnswers: 0,
      showResult: false,
      categoryIcons: {
        'العقيدة': 'fas fa-star',
        'الفقه': 'fas fa-mosque',
        'التفسير': 'fas fa-quran',
        'السيرة': 'fas fa-user',
        'الحديث': 'fas fa-book',
        'التاريخ الإسلامي': 'fas fa-landmark'
      }
    };
  },
  computed: {
    level() {
      const percentage = (this.score / this.totalPossibleScore) * 100;
      if (percentage >= 80) return 'ممتاز';
      if (percentage >= 60) return 'جيد جداً';
      if (percentage >= 40) return 'متوسط';
      return 'مبتدئ';
    },
    resultClass() {
      const percentage = (this.score / this.totalPossibleScore) * 100;
      if (percentage >= 80) return 'excellent';
      if (percentage >= 60) return 'good';
      if (percentage >= 40) return 'average';
      return 'poor';
    },
    resultIcon() {
      const percentage = (this.score / this.totalPossibleScore) * 100;
      if (percentage >= 80) return 'fas fa-trophy gold';
      if (percentage >= 60) return 'fas fa-medal silver';
      if (percentage >= 40) return 'fas fa-award bronze';
      return 'fas fa-star';
    },
    resultMessage() {
      const percentage = (this.score / this.totalPossibleScore) * 100;
      if (percentage >= 80) return 'معلوماتك دينية ممتازة! أحسنت!';
      if (percentage >= 60) return 'لديك معرفة جيدة، استمر في التعلم!';
      if (percentage >= 40) return 'ليس سيئاً، ولكن يمكنك تحسين معلوماتك';
      return 'يبدو أنك بحاجة لمراجعة بعض الأساسيات الدينية';
    },
    totalPossibleScore() {
      return this.questions.length;
    },
    isLastQuestion() {
      return this.currentQuestion === this.questions.length - 1;
    },
  },
  methods: {
    startQuiz(category) {
      this.selectedCategory = category;
      this.questions = [...this.quizzes[category]].sort(() => Math.random() - 0.5);
      this.quizStarted = true;
      this.currentQuestion = 0;
      this.score = 0;
      this.correctAnswers = 0;
      this.incorrectAnswers = 0;
      this.showResult = false;
    },
    checkAnswer(index) {
      this.selectedAnswer = index;
      this.isCorrect = index === this.questions[this.currentQuestion].answer;
      this.showFeedback = true;
      
      if (this.isCorrect) {
        this.score += 1;
        this.correctAnswers++;
      } else {
        this.incorrectAnswers++;
      }
    },
    nextQuestion() {
      if (this.isLastQuestion) {
        this.finishQuiz();
      } else {
        this.currentQuestion++;
        this.selectedAnswer = null;
        this.showFeedback = false;
        this.isCorrect = false;
      }
    },
    finishQuiz() {
      this.showResult = true;
    },
    resetQuiz() {
      this.startQuiz(this.selectedCategory);
    },
    chooseAnotherCategory() {
      this.quizStarted = false;
      this.selectedCategory = '';
    }
  }
};
</script>

<style scoped>
.quiz-wrapper {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px 16px 100px;
  direction: rtl;
  min-height: 100vh;
}

* {
  font-family: "the-year-of-the-camel", serif;
  font-weight: 500;
  line-height: 1.6;
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  background: linear-gradient(135deg, #f5e8d0, #f0e0c0);
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(208, 168, 113, 0.15);
}

.quiz-info h1 {
  font-size: 1.5rem;
  color: #3a3228;
  margin-bottom: 5px;
}

.quiz-info p {
  color: #5a4a3a;
  font-size: 0.9rem;
}

.score-info {
  text-align: center;
}

.score-info p {
  color: #5a4a3a;
  font-size: 0.9rem;
  margin: 3px 0;
}

.category-selection {
  text-align: center;
}

.category-selection h2 {
  color: #3a3228;
  font-size: 1.3rem;
  margin-bottom: 20px;
}

.categories {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 20px;
}

.category-btn {
  background: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 120px;
}

.category-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.category-icon {
  width: 50px;
  height: 50px;
  background: #f0d087;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.category-icon i {
  font-size: 1.5rem;
  color: #3a3228;
}

.category-btn span {
  font-weight: bold;
  color: #3a3228;
  font-size: 1rem;
}

.question-container {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.question-card h3 {
  font-size: 1.2rem;
  color: #3a3228;
  margin-bottom: 25px;
  text-align: center;
}

.options {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.options button {
  padding: 15px;
  background: #ffffff;
  border: 2px solid #eee;
  border-radius: 10px;
  text-align: right;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  color: #3a3228;
}

.options button:hover:not(:disabled) {
  border-color: #f0d087;
  background-color: #f9f5ed;
}

.options button.selected {
  border-color: #f0d087;
  background-color: #f9f5ed;
}

.options button.correct {
  border-color: #4CAF50;
  background-color: #e8f5e9;
}

.options button.incorrect {
  border-color: #f44336;
  background-color: #ffebee;
}

.correct-mark {
  position: absolute;
  left: 15px;
  color: #4CAF50;
}

.feedback {
  margin-top: 25px;
  padding: 15px;
  border-radius: 10px;
  background-color: #f5f5f5;
  animation: fadeIn 0.5s;
}

.correct-feedback {
  color: #2E7D32;
  font-weight: bold;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.correct-feedback i {
  margin-left: 5px;
}

.incorrect-feedback {
  color: #f44336;
  font-weight: bold;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.incorrect-feedback i {
  margin-left: 5px;
}

.explanation {
  margin: 15px 0;
  color: #5a4a3a;
  line-height: 1.6;
  font-size: 0.9rem;
  text-align: center;
}

.next-btn {
  padding: 12px 25px;
  background-color: #f0d087;
  color: #3a3228;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  display: block;
  margin: 10px auto 0;
  font-weight: bold;
}

.next-btn:hover {
  background-color: #e0c077;
  transform: translateY(-2px);
}

.quiz-result {
  text-align: center;
  animation: fadeIn 0.5s;
}

.quiz-result h2 {
  color: #3a3228;
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.result-card {
  max-width: 600px;
  margin: 0 auto;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.result-card.excellent {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  border: 2px solid #4CAF50;
}

.result-card.good {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border: 2px solid #2196F3;
}

.result-card.average {
  background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
  border: 2px solid #FFC107;
}

.result-card.poor {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  border: 2px solid #f44336;
}

.result-badge {
  width: 70px;
  height: 70px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.result-badge i {
  font-size: 2rem;
}

.gold {
  color: #FFD700;
}

.silver {
  color: #C0C0C0;
}

.bronze {
  color: #CD7F32;
}

.result-card h3 {
  font-size: 1.3rem;
  color: #3a3228;
  margin-bottom: 10px;
}

.result-card p {
  font-size: 1rem;
  color: #5a4a3a;
  margin-bottom: 15px;
}

.result-details {
  text-align: right;
  margin: 20px 0;
  padding: 15px;
  background: rgba(255,255,255,0.7);
  border-radius: 10px;
}

.result-details p {
  margin: 8px 0;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  justify-content: flex-end;
}

.result-details i {
  margin-left: 8px;
  font-size: 1rem;
}

.actions {
  display: flex;
  justify-content: center;
  margin-top: 15px;
  gap: 10px;
}

.restart-btn, .another-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 30px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.restart-btn {
  background-color: #f0d087;
  color: #3a3228;
}

.another-btn {
  background-color: #3a3228;
  color: white;
}

.restart-btn:hover, .another-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.footer {
  padding: 30px 0;
  text-align: center;
  color: #5a4a3a;
  font-size: 14px;
  position: relative;
}

.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 2px;
  background: #D0A871;
  border-radius: 2px;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 576px) {
  .quiz-header {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
  
  .categories {
    grid-template-columns: 1fr;
  }
  
  .question-card h3 {
    font-size: 1.1rem;
  }
  
  .options button {
    font-size: 0.9rem;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .restart-btn, .another-btn {
    width: 100%;
  }
}

@media (min-width: 768px) {
  .quiz-wrapper {
    max-width: 800px;
    padding: 30px 20px 100px;
  }
  
  .categories {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .question-card h3 {
    font-size: 1.3rem;
  }
}
</style>