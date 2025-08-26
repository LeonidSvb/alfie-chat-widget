class AlfieWidget {
    constructor() {
        this.currentFlow = null;
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.flowData = {};
        this.sessionId = this.generateSessionId();
        this.webhooks = {};
        this.imagesPath = '';
        
        // Initialize from data attributes
        this.initFromDataAttributes();
        
        // Bind event listeners
        this.bindEvents();
    }

    initFromDataAttributes() {
        const widget = document.getElementById('alfie-widget');
        
        this.flowPaths = {
            inspire: widget.dataset.flowInspire,
            planning: widget.dataset.flowPlanning
        };
        
        this.webhooks = {
            alfie: widget.dataset.webhookAlfie,
            final: widget.dataset.webhookFinal
        };
        
        this.imagesPath = widget.dataset.imagesPath;
    }

    bindEvents() {
        // Flow selection buttons
        document.querySelectorAll('.alfie-flow-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const flowType = e.currentTarget.dataset.flow;
                this.selectFlow(flowType);
            });
        });

        // Submit custom answer button
        document.getElementById('submit-custom').addEventListener('click', () => {
            this.submitCustomAnswer();
        });

        // Enter key for custom input
        document.getElementById('custom-answer-field').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitCustomAnswer();
            }
        });
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    async init() {
        try {
            await this.loadAllFlows();
            console.log('Alfie Widget initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Alfie Widget:', error);
            this.showLoadingError();
        }
    }

    async loadAllFlows() {
        try {
            const [inspireResponse, planningResponse] = await Promise.all([
                fetch(this.flowPaths.inspire),
                fetch(this.flowPaths.planning)
            ]);
            
            if (!inspireResponse.ok || !planningResponse.ok) {
                throw new Error('Failed to load flow files');
            }
            
            this.flowData.inspire = await inspireResponse.json();
            this.flowData.planning = await planningResponse.json();
            
            console.log('Flows loaded successfully:', this.flowData);
        } catch (error) {
            console.error('Error loading flows:', error);
            throw error;
        }
    }

    selectFlow(flowType) {
        this.currentFlow = flowType;
        this.currentQuestionIndex = 0;
        this.answers = {};
        
        // Hide flow selection and intro
        document.getElementById('flow-selection').style.display = 'none';
        document.querySelector('.alfie-intro').style.display = 'none';
        
        // Show questions section and progress
        document.getElementById('questions-section').classList.remove('alfie-hidden');
        document.getElementById('progress-container').style.display = 'block';
        
        this.updateProgress();
        this.showQuestion();
    }

    getCurrentFlowData() {
        return this.flowData[this.currentFlow];
    }

    getCurrentQuestion() {
        const flowData = this.getCurrentFlowData();
        return flowData.questions[this.currentQuestionIndex];
    }

    updateProgress() {
        // Dynamic progress based on actual user path
        const answeredCount = Object.keys(this.answers).length;
        const currentStep = answeredCount + 1;
        const estimatedTotal = this.estimatePathLength();
        const progressPercentage = (currentStep / estimatedTotal) * 100;
        
        // Update progress bar
        document.getElementById('progress-bar').style.width = `${Math.min(progressPercentage, 100)}%`;
        
        // Update progress text with dynamic numbers
        const progressEmojis = ['🗣️', '🤔', '✨', '🎯', '🚀'];
        const emojiIndex = Math.floor((currentStep - 1) / Math.ceil(estimatedTotal / progressEmojis.length));
        const emoji = progressEmojis[Math.min(emojiIndex, progressEmojis.length - 1)];
        
        document.getElementById('progress-text').innerHTML = `
            <span class="alfie-progress-emoji">${emoji}</span>
            <span>Question ${currentStep} of ~${estimatedTotal} (${this.currentFlow})</span>
        `;
    }

    estimatePathLength() {
        // Estimate total questions based on current answers and flow type
        if (this.currentFlow === 'inspire') {
            // Solo/Couple = 23, Groups = 24
            const partyType = this.answers.party_type;
            if (partyType === 'Solo' || partyType === 'Couple') {
                return 23;
            } else if (partyType) {
                return 24;
            }
            return 24; // Default to max if not answered yet
        } 
        
        else if (this.currentFlow === 'planning') {
            let estimate = 11; // Base shared questions (Q1-Q11)
            
            // Add trip structure questions
            const tripStructure = this.answers.trip_structure;
            if (tripStructure === 'Single destination') {
                estimate += 2; // Q12A, Q13A
            } else if (tripStructure === 'Multi-destination') {
                estimate += 2; // Q12B, Q13B
            } else if (tripStructure === 'Roadtrip') {
                estimate += 5; // Q12C-Q16C
            } else {
                estimate += 3; // Average if not decided yet
            }
            
            // Add lodging questions
            const lodgingBooked = this.answers.lodging_booked;
            if (lodgingBooked === 'No, I need recommendations') {
                estimate += 2; // Q2b, Q2c
            }
            
            // Add party questions
            const partyType = this.answers.party_type;
            if (partyType && partyType !== 'Solo' && partyType !== 'Couple') {
                estimate += 2; // Q3a, Q3b_group
            } else if (partyType) {
                estimate += 1; // Q3b_solo
            } else {
                estimate += 1.5; // Average
            }
            
            return Math.round(estimate);
        }
        
        return 20; // Fallback
    }

    showQuestion() {
        const flowData = this.getCurrentFlowData();
        
        // Check if we've finished all questions
        if (this.currentQuestionIndex >= flowData.questions.length) {
            this.finishQuestions();
            return;
        }
        
        const question = this.getCurrentQuestion();
        
        // Check conditional logic
        if (question.conditional && !this.evaluateCondition(question.conditional)) {
            this.nextQuestion();
            return;
        }

        // Update question text
        document.getElementById('current-question').textContent = question.text;
        
        // Clear previous answers
        const answerOptions = document.getElementById('answer-options');
        answerOptions.innerHTML = '';
        
        // Hide custom input by default
        document.getElementById('custom-input').style.display = 'none';
        
        // Show answer options based on question type
        if (question.type === 'single_select') {
            this.createSingleSelectOptions(question, answerOptions);
        } else if (question.type === 'multi_select') {
            this.createMultiSelectOptions(question, answerOptions);
        } else if (question.type === 'free_form') {
            this.showCustomInput(question);
        }
        
        // Hide any previous Alfie message
        document.getElementById('alfie-message').classList.remove('show');
    }

    createSingleSelectOptions(question, container) {
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'alfie-answer-button';
            button.textContent = option;
            button.onclick = () => this.selectSingleAnswer(option, index, question);
            container.appendChild(button);
        });
    }

    createMultiSelectOptions(question, container) {
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'alfie-answer-button';
            button.textContent = option;
            button.onclick = () => this.toggleMultiSelectAnswer(option, index, question);
            container.appendChild(button);
        });
        
        // Add Continue button for multi-select
        const continueContainer = document.createElement('div');
        continueContainer.className = 'alfie-continue-container';
        
        const continueBtn = document.createElement('button');
        continueBtn.className = 'alfie-submit-button';
        continueBtn.textContent = 'Continue';
        continueBtn.onclick = () => this.processAnswerAndContinue();
        
        continueContainer.appendChild(continueBtn);
        container.appendChild(continueContainer);
    }

    showCustomInput(question) {
        document.getElementById('custom-input').style.display = 'block';
        const input = document.getElementById('custom-answer-field');
        input.placeholder = question.placeholder || 'Type your answer here...';
        input.value = '';
        input.focus();
    }

    selectSingleAnswer(answer, optionIndex, question) {
        this.answers[question.field] = answer;
        
        // Highlight selected option
        document.querySelectorAll('.alfie-answer-button').forEach((btn, index) => {
            if (index === optionIndex) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });
        
        // Auto-advance after short delay
        setTimeout(() => {
            this.processAnswerAndContinue();
        }, 600);
    }

    toggleMultiSelectAnswer(answer, optionIndex, question) {
        if (!this.answers[question.field]) {
            this.answers[question.field] = [];
        }
        
        const answerArray = this.answers[question.field];
        const index = answerArray.indexOf(answer);
        
        if (index > -1) {
            answerArray.splice(index, 1); // Remove if already selected
        } else {
            answerArray.push(answer); // Add if not selected
        }
        
        // Update button visual state
        const buttons = document.querySelectorAll('.alfie-answer-button');
        if (buttons[optionIndex]) {
            buttons[optionIndex].classList.toggle('selected');
        }
    }

    submitCustomAnswer() {
        const input = document.getElementById('custom-answer-field');
        const answer = input.value.trim();
        
        if (!answer) {
            input.focus();
            return;
        }
        
        const question = this.getCurrentQuestion();
        this.answers[question.field] = answer;
        
        this.processAnswerAndContinue();
    }

    evaluateCondition(condition) {
        const fieldValue = this.answers[condition.field];
        
        if (condition.equals) {
            return fieldValue === condition.equals;
        } else if (condition.equals_any) {
            return condition.equals_any.includes(fieldValue);
        } else if (condition.not_equals) {
            const notEquals = Array.isArray(condition.not_equals) ? condition.not_equals : [condition.not_equals];
            return !notEquals.includes(fieldValue);
        }
        return true;
    }

    async processAnswerAndContinue() {
        // Check if we should show Alfie update
        const flowData = this.getCurrentFlowData();
        if (flowData.alfie_triggers && flowData.alfie_triggers.includes(this.currentQuestionIndex + 1)) {
            await this.sendAlfieUpdate();
        }
        
        this.nextQuestion();
    }

    nextQuestion() {
        const question = this.getCurrentQuestion();
        
        // Check for branches
        if (question.branches && this.answers[question.field]) {
            const selectedAnswer = this.answers[question.field];
            const nextQuestionId = question.branches[selectedAnswer];
            
            if (nextQuestionId) {
                // Find the question with the matching ID
                const flowData = this.getCurrentFlowData();
                const nextQuestionIndex = flowData.questions.findIndex(q => q.id === nextQuestionId);
                
                if (nextQuestionIndex !== -1) {
                    this.currentQuestionIndex = nextQuestionIndex;
                } else {
                    this.currentQuestionIndex++;
                }
            } else {
                this.currentQuestionIndex++;
            }
        } else {
            this.currentQuestionIndex++;
        }
        
        this.updateProgress();
        this.showQuestion();
    }

    async sendAlfieUpdate() {
        if (!this.webhooks.alfie) return;
        
        try {
            const response = await fetch(this.webhooks.alfie, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    answers: this.answers,
                    current_question: this.currentQuestionIndex,
                    flow_type: this.currentFlow,
                    session_id: this.sessionId
                })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.alfie_response) {
                    this.showAlfieMessage(result.alfie_response);
                }
            }
        } catch (error) {
            console.error('Error sending Alfie update:', error);
        }
    }

    showAlfieMessage(message) {
        const alfieMessage = document.getElementById('alfie-message');
        const alfieComment = document.getElementById('alfie-comment');
        
        alfieComment.textContent = message;
        alfieMessage.classList.add('show');
        
        // Hide after 4 seconds
        setTimeout(() => {
            alfieMessage.classList.remove('show');
        }, 4000);
    }

    async finishQuestions() {
        // Hide questions section
        document.getElementById('questions-section').classList.add('alfie-hidden');
        
        // Show loading
        document.getElementById('loading-section').classList.remove('alfie-hidden');
        
        // Send final answers to N8N
        try {
            await this.sendFinalAnswers();
        } catch (error) {
            console.error('Error processing final answers:', error);
            this.showError();
        }
    }

    async sendFinalAnswers() {
        if (!this.webhooks.final) {
            // If no webhook, just show the answers in console
            console.log('Final answers:', this.answers);
            this.showFinalResults({ answers: this.answers });
            return;
        }

        const response = await fetch(this.webhooks.final, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                flow_type: this.currentFlow,
                all_answers: this.answers,
                session_id: this.sessionId
            })
        });

        if (response.ok) {
            const result = await response.json();
            this.showFinalResults(result);
        } else {
            throw new Error('Failed to get final results');
        }
    }

    showFinalResults(results) {
        // Hide loading
        document.getElementById('loading-section').classList.add('alfie-hidden');
        
        // Show final results
        const resultsSection = document.getElementById('results-section');
        resultsSection.innerHTML = this.formatResults(results);
        resultsSection.classList.remove('alfie-hidden');
    }

    formatResults(results) {
        return `
            <div class="alfie-intro">
                <div class="alfie-avatar-main">
                    <img src="${this.imagesPath}7.png" alt="Alfie" />
                </div>
                <div class="alfie-greeting">
                    <div class="alfie-greeting-bubble">
                        Here are your personalized recommendations! 🎉
                    </div>
                </div>
            </div>
            <div class="alfie-result-item">
                <div class="alfie-result-title">Your Perfect Match</div>
                <div class="alfie-result-content">
                    Based on your preferences, I've found the perfect recommendations for your adventure!
                </div>
            </div>
        `;
    }

    showError() {
        document.getElementById('loading-section').innerHTML = `
            <div class="error">
                Oops! Something went wrong. Please try again later.
            </div>
        `;
    }
    
    showLoadingError() {
        document.getElementById('alfie-widget').innerHTML = `
            <div class="alfie-embedded-chat">
                <div class="alfie-intro">
                    <div class="alfie-avatar-main">
                        <img src="${this.imagesPath}3.png" alt="Alfie" />
                    </div>
                    <div class="alfie-greeting">
                        <div class="alfie-greeting-bubble">
                            Sorry! I'm having trouble loading my questions. Please refresh the page to try again.
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialize the widget
const alfieWidget = new AlfieWidget();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        alfieWidget.init();
    });
} else {
    alfieWidget.init();
}