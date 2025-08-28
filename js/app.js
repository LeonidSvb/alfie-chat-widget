// Outdoorable Widget 2 - Main Application Logic
// MVP Chatbot Widget for Webflow Embed

class OutdoorableWidget {
  constructor() {
    this.currentFlow = null;
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.filteredQuestions = [];
    this.webhook_url = 'https://leonidshvorob.app.n8n.cloud/webhook/final-processing';
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.showStartScreen();
  }

  bindEvents() {
    // Flow selection buttons
    const flowButtons = document.querySelectorAll('.alfie-flow-button');
    flowButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const flow = e.target.dataset.flow;
        this.startFlow(flow);
      });
    });

    // Custom input submit
    const submitButton = document.getElementById('submit-custom');
    if (submitButton) {
      submitButton.addEventListener('click', () => this.submitCustomAnswer());
    }

    // Enter key for custom input
    const customInput = document.getElementById('custom-answer-field');
    if (customInput) {
      customInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.submitCustomAnswer();
        }
      });
    }
  }

  showStartScreen() {
    this.hideAll();
    document.getElementById('flow-selection').style.display = 'block';
  }

  startFlow(flowType) {
    this.currentFlow = flowType;
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.filteredQuestions = this.filterQuestions(flowType);
    
    this.hideAll();
    this.showProgressBar();
    this.showNextQuestion();
  }

  filterQuestions(flowType) {
    return questions.filter(q => q.flow === flowType);
  }

  showNextQuestion() {
    if (this.currentQuestionIndex >= this.filteredQuestions.length) {
      this.finishFlow();
      return;
    }

    const question = this.filteredQuestions[this.currentQuestionIndex];
    
    // Check conditions
    if (!this.shouldShowQuestion(question)) {
      this.currentQuestionIndex++;
      this.showNextQuestion();
      return;
    }

    this.updateProgressBar();
    this.displayQuestion(question);
  }

  shouldShowQuestion(question) {
    if (!question.condition) return true;

    const condition = question.condition;

    // Handle old-style conditions for Flow 1 inspire
    if (condition.skipIf) {
      for (const [key, values] of Object.entries(condition.skipIf)) {
        if (values.includes(this.answers[key])) {
          return false;
        }
      }
    }

    if (condition.showIf) {
      for (const [key, value] of Object.entries(condition.showIf)) {
        if (this.answers[key] !== value) {
          return false;
        }
      }
    }

    if (condition.dependsOn) {
      return true; // Always show Q8b for inspire flow
    }

    // Handle new-style conditions for Flow 2 planning
    if (condition.equals) {
      const key = condition.equals.key;
      const value = condition.equals.value;
      return this.answers[key] === value;
    }

    if (condition.notEquals) {
      const key = condition.notEquals.key;
      const value = condition.notEquals.value;
      return this.answers[key] !== value;
    }

    if (condition.notIn) {
      const key = condition.notIn.key;
      const values = condition.notIn.values;
      return !values.includes(this.answers[key]);
    }

    if (condition.all) {
      return condition.all.every(cond => this.evaluateCondition(cond));
    }

    return true;
  }

  evaluateCondition(condition) {
    if (condition.equals) {
      const key = condition.equals.key;
      const value = condition.equals.value;
      return this.answers[key] === value;
    }

    if (condition.notEquals) {
      const key = condition.notEquals.key;
      const value = condition.notEquals.value;
      return this.answers[key] !== value;
    }

    if (condition.notIn) {
      const key = condition.notIn.key;
      const values = condition.notIn.values;
      return !values.includes(this.answers[key]);
    }

    return true;
  }

  displayQuestion(question) {
    document.getElementById('questions-section').style.display = 'block';
    
    // Handle dynamic question text for Q8b in inspire flow
    let questionText = question.text;
    if (question.id === 'Q8b' && question.flow === 'inspire') {
      questionText = this.getDynamicQ8bText();
    }

    document.getElementById('current-question').textContent = questionText;
    
    const answerOptions = document.getElementById('answer-options');
    const customInput = document.getElementById('custom-input');
    
    // Clear previous content
    answerOptions.innerHTML = '';
    customInput.style.display = 'none';

    if (question.type === 'single_select') {
      this.renderSingleSelect(question, answerOptions);
    } else if (question.type === 'multi_select') {
      this.renderMultiSelect(question, answerOptions);
    } else if (question.type === 'text') {
      this.renderTextInput(question, customInput);
    }
  }

  getDynamicQ8bText() {
    const partyType = this.answers.party_type;
    if (partyType === 'Solo') {
      return "How active do you want your days to feel?";
    } else if (partyType === 'Couple') {
      return "What's your energy level together on trips?";
    } else {
      return "How active is the crew overall?";
    }
  }

  renderSingleSelect(question, container) {
    question.options.forEach(option => {
      const button = document.createElement('button');
      button.className = 'alfie-option-button';
      button.textContent = option;
      button.addEventListener('click', () => {
        this.selectAnswer(question.key, option);
        this.nextQuestion();
      });
      container.appendChild(button);
    });
  }

  renderMultiSelect(question, container) {
    const selectedOptions = [];
    
    question.options.forEach(option => {
      const button = document.createElement('button');
      button.className = 'alfie-multi-option-button';
      button.textContent = option;
      button.addEventListener('click', () => {
        // Toggle selection
        if (selectedOptions.includes(option)) {
          // Remove from selection
          const index = selectedOptions.indexOf(option);
          selectedOptions.splice(index, 1);
          button.classList.remove('selected');
        } else {
          // Add to selection
          selectedOptions.push(option);
          button.classList.add('selected');
        }
      });
      container.appendChild(button);
    });

    // Add Next button for multi-select
    const nextButton = document.createElement('button');
    nextButton.className = 'alfie-next-button';
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', () => {
      this.selectAnswer(question.key, selectedOptions);
      this.nextQuestion();
    });
    container.appendChild(nextButton);
  }

  renderTextInput(question, container) {
    container.style.display = 'block';
    
    const input = document.getElementById('custom-answer-field');
    input.value = '';
    input.placeholder = question.example || 'Type your answer here...';
    input.focus();
    
    // Store current question key for submission
    this.currentTextKey = question.key;
  }

  submitCustomAnswer() {
    const input = document.getElementById('custom-answer-field');
    const value = input.value.trim();
    
    if (value === '') {
      input.focus();
      return;
    }
    
    this.selectAnswer(this.currentTextKey, value);
    this.nextQuestion();
  }

  selectAnswer(key, value) {
    this.answers[key] = value;
  }

  nextQuestion() {
    this.currentQuestionIndex++;
    this.showNextQuestion();
  }

  updateProgressBar() {
    const progress = ((this.currentQuestionIndex + 1) / this.filteredQuestions.length) * 100;
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    // Update progress text based on question
    const progressText = document.querySelector('#progress-container .alfie-progress-text span:last-child');
    if (progressText) {
      const questionNumber = this.currentQuestionIndex + 1;
      const totalQuestions = this.filteredQuestions.length;
      
      if (questionNumber <= 3) {
        progressText.textContent = 'Getting started...';
      } else if (questionNumber <= totalQuestions * 0.5) {
        progressText.textContent = 'Learning about you...';
      } else if (questionNumber <= totalQuestions * 0.8) {
        progressText.textContent = 'Almost there...';
      } else {
        progressText.textContent = 'Final details...';
      }
    }
  }

  showProgressBar() {
    document.getElementById('progress-container').style.display = 'block';
  }

  hideAll() {
    document.getElementById('flow-selection').style.display = 'none';
    document.getElementById('questions-section').style.display = 'none';
    document.getElementById('loading-section').style.display = 'none';
    document.getElementById('results-section').style.display = 'none';
    document.getElementById('progress-container').style.display = 'none';
    document.getElementById('custom-input').style.display = 'none';
  }

  finishFlow() {
    this.hideAll();
    this.showLoadingScreen();
    this.sendToWebhook();
  }

  showLoadingScreen() {
    document.getElementById('loading-section').style.display = 'block';
  }

  async sendToWebhook() {
    const payload = {
      flow_type: this.currentFlow,
      all_answers: this.answers
    };

    try {
      const response = await fetch(this.webhook_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.text();
        this.showResults(result);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Webhook error:', error);
      this.showError();
    }
  }

  showResults(tripGuide) {
    this.hideAll();
    
    const resultsSection = document.getElementById('results-section');
    resultsSection.innerHTML = `
      <div class="alfie-results-content">
        <div class="alfie-results-header">
          <div class="alfie-avatar">
            <img src="./images/3.png" alt="Alfie" />
          </div>
          <h2>Your Personalized Trip Guide</h2>
        </div>
        <div class="alfie-trip-guide">
          ${this.formatTripGuide(tripGuide)}
        </div>
        <div class="alfie-expert-cta">
          <h3>Want to take this further?</h3>
          <p>Connect with an expert who knows your destination inside out.</p>
          <button class="alfie-expert-button" onclick="this.contactExpert()">
            Talk to an Expert
          </button>
        </div>
      </div>
    `;
    
    resultsSection.style.display = 'block';
  }

  formatTripGuide(text) {
    // Convert line breaks to HTML and add basic formatting
    return text
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }

  showError() {
    this.hideAll();
    
    const resultsSection = document.getElementById('results-section');
    resultsSection.innerHTML = `
      <div class="alfie-error-content">
        <div class="alfie-avatar">
          <img src="./images/3.png" alt="Alfie" />
        </div>
        <h2>⚠️ Oops, something went wrong!</h2>
        <p>I'm having trouble generating your trip guide right now. Please try again in a few minutes.</p>
        <button class="alfie-retry-button" onclick="location.reload()">
          Start Over
        </button>
      </div>
    `;
    
    resultsSection.style.display = 'block';
  }

  contactExpert() {
    // This would integrate with your expert matching system
    alert('Expert contact feature coming soon! For now, please contact us directly.');
  }
}

// Initialize widget when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new OutdoorableWidget();
});