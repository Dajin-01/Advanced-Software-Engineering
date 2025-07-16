// AI Trainer JavaScript

// Workout plans data
const workoutPlans = {
  'weight-loss': {
    title: 'Weight Loss Workout Plan',
    description: 'This plan focuses on high-intensity cardio and strength training to maximize calorie burn and fat loss. You\'ll work out 5 days a week with 2 rest days for recovery.',
    schedule: [
      { day: 'Monday', activity: 'Cardio + HIIT', details: '30 min running + 20 min HIIT intervals' },
      { day: 'Tuesday', activity: 'Upper Body Strength', details: 'Push-ups, pull-ups, dumbbell exercises' },
      { day: 'Wednesday', activity: 'Cardio', details: '45 min cycling or swimming' },
      { day: 'Thursday', activity: 'Lower Body Strength', details: 'Squats, lunges, deadlifts' },
      { day: 'Friday', activity: 'Full Body Circuit', details: 'High-intensity circuit training' },
      { day: 'Saturday', activity: 'Active Recovery', details: 'Light walking or yoga' },
      { day: 'Sunday', activity: 'Rest Day', details: 'Complete rest and recovery' }
    ],
    exercises: [
      { name: 'Running/Jogging', description: '30-45 minutes at moderate pace' },
      { name: 'HIIT Intervals', description: '30 seconds high intensity, 30 seconds rest' },
      { name: 'Push-ups', description: '3 sets of 10-15 repetitions' },
      { name: 'Squats', description: '3 sets of 15-20 repetitions' },
      { name: 'Burpees', description: '3 sets of 10-12 repetitions' },
      { name: 'Mountain Climbers', description: '3 sets of 30 seconds' },
      { name: 'Jumping Jacks', description: '3 sets of 50 repetitions' },
      { name: 'Plank', description: '3 sets of 30-60 seconds' }
    ],
    tips: [
      'Stay hydrated - drink at least 8 glasses of water daily',
      'Maintain a calorie deficit of 500-700 calories per day',
      'Get 7-8 hours of quality sleep each night',
      'Eat protein-rich foods to preserve muscle mass',
      'Track your progress with photos and measurements',
      'Be consistent - results come with time and dedication'
    ]
  },
  
  'muscle-gain': {
    title: 'Muscle Gain Workout Plan',
    description: 'This plan focuses on progressive overload and compound movements to build muscle mass and strength. You\'ll work out 4-5 days a week with adequate rest for muscle recovery.',
    schedule: [
      { day: 'Monday', activity: 'Chest & Triceps', details: 'Bench press, push-ups, tricep dips' },
      { day: 'Tuesday', activity: 'Back & Biceps', details: 'Pull-ups, rows, bicep curls' },
      { day: 'Wednesday', activity: 'Rest Day', details: 'Light stretching or walking' },
      { day: 'Thursday', activity: 'Legs & Shoulders', details: 'Squats, deadlifts, shoulder press' },
      { day: 'Friday', activity: 'Full Body', details: 'Compound movements and core work' },
      { day: 'Saturday', activity: 'Active Recovery', details: 'Light cardio or yoga' },
      { day: 'Sunday', activity: 'Rest Day', details: 'Complete rest and recovery' }
    ],
    exercises: [
      { name: 'Bench Press', description: '3 sets of 8-12 repetitions' },
      { name: 'Squats', description: '4 sets of 8-12 repetitions' },
      { name: 'Deadlifts', description: '3 sets of 6-10 repetitions' },
      { name: 'Pull-ups', description: '3 sets of 5-10 repetitions' },
      { name: 'Overhead Press', description: '3 sets of 8-12 repetitions' },
      { name: 'Barbell Rows', description: '3 sets of 10-15 repetitions' },
      { name: 'Dumbbell Curls', description: '3 sets of 12-15 repetitions' },
      { name: 'Plank Variations', description: '3 sets of 45-60 seconds' }
    ],
    tips: [
      'Eat in a calorie surplus - 300-500 calories above maintenance',
      'Consume 1.6-2.2g of protein per kg of body weight',
      'Progressive overload - gradually increase weight or reps',
      'Get 7-9 hours of sleep for optimal muscle recovery',
      'Stay consistent with your workout schedule',
      'Don\'t skip rest days - muscles grow during recovery'
    ]
  },
  
  'general-fitness': {
    title: 'General Fitness Workout Plan',
    description: 'This balanced plan improves overall fitness, strength, and endurance. It includes a mix of cardio, strength training, and flexibility work for a well-rounded fitness routine.',
    schedule: [
      { day: 'Monday', activity: 'Cardio', details: '30 min moderate intensity cardio' },
      { day: 'Tuesday', activity: 'Strength Training', details: 'Full body strength workout' },
      { day: 'Wednesday', activity: 'Flexibility', details: 'Yoga or stretching session' },
      { day: 'Thursday', activity: 'Cardio', details: '30 min different cardio activity' },
      { day: 'Friday', activity: 'Strength Training', details: 'Full body strength workout' },
      { day: 'Saturday', activity: 'Active Recovery', details: 'Light activity or sports' },
      { day: 'Sunday', activity: 'Rest Day', details: 'Complete rest and recovery' }
    ],
    exercises: [
      { name: 'Walking/Running', description: '30 minutes at moderate pace' },
      { name: 'Bodyweight Squats', description: '3 sets of 15-20 repetitions' },
      { name: 'Push-ups', description: '3 sets of 10-15 repetitions' },
      { name: 'Plank', description: '3 sets of 30-45 seconds' },
      { name: 'Lunges', description: '3 sets of 10 each leg' },
      { name: 'Jumping Jacks', description: '3 sets of 30 repetitions' },
      { name: 'Yoga Stretches', description: '15-20 minutes flexibility work' },
      { name: 'Burpees', description: '3 sets of 8-10 repetitions' }
    ],
    tips: [
      'Aim for 150 minutes of moderate cardio per week',
      'Include strength training 2-3 times per week',
      'Don\'t forget flexibility and mobility work',
      'Listen to your body and rest when needed',
      'Stay hydrated throughout the day',
      'Find activities you enjoy to stay motivated'
    ]
  }
};

// Function to select a goal and show workout plan
function selectGoal(goal) {
  const goalSelection = document.getElementById('goalSelection');
  const workoutPlan = document.getElementById('workoutPlan');
  const plan = workoutPlans[goal];
  
  if (!plan) {
    alert('Invalid goal selected');
    return;
  }
  
  // Update plan title and description
  document.getElementById('planTitle').textContent = plan.title;
  document.getElementById('planDescription').textContent = plan.description;
  
  // Generate weekly schedule
  const weeklySchedule = document.getElementById('weeklySchedule');
  weeklySchedule.innerHTML = `
    <div class="weekly-schedule-grid">
      ${plan.schedule.map(day => `
        <div class="day-card">
          <h4>${day.day}</h4>
          <p><strong>${day.activity}</strong></p>
          <p>${day.details}</p>
        </div>
      `).join('')}
    </div>
  `;
  
  // Generate exercise list
  const exerciseList = document.getElementById('exerciseList');
  exerciseList.innerHTML = `
    <div class="exercise-grid">
      ${plan.exercises.map(exercise => `
        <div class="exercise-item">
          <h4>${exercise.name}</h4>
          <p>${exercise.description}</p>
        </div>
      `).join('')}
    </div>
  `;
  
  // Generate tips list
  const tipsList = document.getElementById('tipsList');
  tipsList.innerHTML = `
    <ul class="tips-list">
      ${plan.tips.map(tip => `<li>${tip}</li>`).join('')}
    </ul>
  `;
  
  // Show workout plan and hide goal selection
  goalSelection.style.display = 'none';
  workoutPlan.style.display = 'block';
  
  // Smooth scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Function to go back to goal selection
function goBack() {
  const goalSelection = document.getElementById('goalSelection');
  const workoutPlan = document.getElementById('workoutPlan');
  
  workoutPlan.style.display = 'none';
  goalSelection.style.display = 'block';
  
  // Smooth scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
  // Add click animation to goal cards
  const goalCards = document.querySelectorAll('.goal-card');
  goalCards.forEach(card => {
    card.addEventListener('click', function() {
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });
});

// AI Trainer Chat JavaScript

// Knowledge base for AI responses
const aiKnowledge = {
  // Weight loss related responses
  'weight loss': {
    keywords: ['weight loss', 'lose weight', 'burn fat', 'calories', 'diet'],
    response: `Here's a comprehensive weight loss workout plan:

**Cardio Exercises (30-45 minutes, 4-5 times/week):**
• Running/Jogging - Start with 20-30 minutes
• Cycling - Low impact, great for beginners
• Swimming - Full body workout
• HIIT (High-Intensity Interval Training) - 20-30 minutes

**Strength Training (3 times/week):**
• Squats - 3 sets of 15-20 reps
• Push-ups - 3 sets of 10-15 reps
• Lunges - 3 sets of 10 each leg
• Plank - 3 sets of 30-60 seconds
• Burpees - 3 sets of 10-12 reps

**Tips for Success:**
• Create a calorie deficit of 500-700 calories daily
• Stay hydrated - drink 8+ glasses of water
• Get 7-8 hours of sleep
• Eat protein-rich foods to preserve muscle
• Be consistent with your routine

Would you like me to provide a specific weekly schedule?`
  },

  // Muscle building responses
  'muscle building': {
    keywords: ['muscle', 'build muscle', 'strength', 'bulk up', 'gain muscle'],
    response: `Here's an effective muscle building workout plan:

**Upper Body (Monday & Thursday):**
• Bench Press - 3 sets of 8-12 reps
• Pull-ups - 3 sets of 5-10 reps
• Overhead Press - 3 sets of 8-12 reps
• Barbell Rows - 3 sets of 10-15 reps
• Dumbbell Curls - 3 sets of 12-15 reps

**Lower Body (Tuesday & Friday):**
• Squats - 4 sets of 8-12 reps
• Deadlifts - 3 sets of 6-10 reps
• Lunges - 3 sets of 10 each leg
• Calf Raises - 3 sets of 15-20 reps

**Core (Wednesday):**
• Plank Variations - 3 sets of 45-60 seconds
• Russian Twists - 3 sets of 20 reps
• Leg Raises - 3 sets of 15 reps

**Nutrition Tips:**
• Eat in a calorie surplus (300-500 calories above maintenance)
• Consume 1.6-2.2g protein per kg of body weight
• Progressive overload - gradually increase weight/reps
• Get 7-9 hours of sleep for recovery

Need help with specific exercises or nutrition?`
  },

  // Beginner workout responses
  'beginner': {
    keywords: ['beginner', 'start', 'new', 'first time', 'easy'],
    response: `Perfect! Here's a beginner-friendly workout plan:

**Week 1-2 (Getting Started):**
• Walking - 20-30 minutes daily
• Bodyweight squats - 2 sets of 10 reps
• Wall push-ups - 2 sets of 5-10 reps
• Plank - 2 sets of 15-20 seconds

**Week 3-4 (Building Foundation):**
• Walking/Jogging - 25-35 minutes
• Bodyweight squats - 3 sets of 12-15 reps
• Knee push-ups - 3 sets of 8-12 reps
• Plank - 3 sets of 20-30 seconds
• Jumping jacks - 3 sets of 20 reps

**Week 5+ (Progression):**
• Jogging - 30 minutes
• Regular push-ups - 3 sets of 10-15 reps
• Lunges - 3 sets of 8 each leg
• Plank - 3 sets of 30-45 seconds

**Important Tips:**
• Start slow and gradually increase intensity
• Focus on proper form over quantity
• Rest 1-2 days between strength training
• Listen to your body - don't push through pain
• Stay consistent - results take time

Would you like me to explain any of these exercises in detail?`
  },

  // Stretching responses
  'stretching': {
    keywords: ['stretch', 'flexibility', 'mobility', 'warm up', 'cool down'],
    response: `Here are essential stretching exercises for flexibility:

**Pre-Workout Stretches (Dynamic - 5-10 minutes):**
• Arm circles - 10 forward, 10 backward
• Leg swings - 10 each leg
• Hip circles - 10 each direction
• Walking knee hugs - 10 each leg
• Ankle rotations - 10 each foot

**Post-Workout Stretches (Static - Hold 30 seconds each):**
• Hamstring stretch - Sit and reach for toes
• Quad stretch - Standing, bend knee behind
• Calf stretch - Lean against wall
• Chest stretch - Arms behind back
• Shoulder stretch - Cross arm across chest
• Hip flexor stretch - Lunge position

**Full Body Stretching Routine:**
• Cat-Cow stretch - 10 repetitions
• Child's pose - 30 seconds
• Cobra stretch - 30 seconds
• Butterfly stretch - 30 seconds
• Seated forward fold - 30 seconds

**Benefits:**
• Improves flexibility and range of motion
• Reduces muscle soreness
• Prevents injuries
• Improves posture
• Enhances workout performance

Remember to breathe deeply and never force a stretch!`
  },

  // General fitness responses
  'general fitness': {
    keywords: ['fitness', 'health', 'exercise', 'workout', 'routine'],
    response: `Here's a balanced general fitness routine:

**Weekly Schedule:**
• Monday: Cardio (30 min running/cycling)
• Tuesday: Full body strength training
• Wednesday: Yoga or stretching
• Thursday: Cardio (different activity)
• Friday: Full body strength training
• Saturday: Active recovery (walking, light sports)
• Sunday: Rest day

**Strength Training Exercises:**
• Squats - 3 sets of 15-20 reps
• Push-ups - 3 sets of 10-15 reps
• Plank - 3 sets of 30-45 seconds
• Lunges - 3 sets of 10 each leg
• Jumping jacks - 3 sets of 30 reps
• Burpees - 3 sets of 8-10 reps

**Cardio Options:**
• Running/Jogging
• Cycling
• Swimming
• Rowing
• Dancing
• Hiking

**Fitness Goals:**
• 150 minutes moderate cardio per week
• Strength training 2-3 times per week
• Flexibility work 2-3 times per week
• 7-9 hours of sleep
• Balanced nutrition

This routine will improve your overall health, strength, and endurance!`
  }
};

// Function to get AI response based on user input
function getAIResponse(userInput) {
  const input = userInput.toLowerCase();
  
  // Check for specific keywords and return appropriate response
  for (const category in aiKnowledge) {
    const keywords = aiKnowledge[category].keywords;
    for (const keyword of keywords) {
      if (input.includes(keyword)) {
        return aiKnowledge[category].response;
      }
    }
  }
  
  // Default response for unrecognized input
  return `I understand you're asking about "${userInput}". Here are some general fitness tips:

**Basic Fitness Principles:**
• Consistency is key - stick to your routine
• Progressive overload - gradually increase difficulty
• Proper form - quality over quantity
• Rest and recovery - muscles grow during rest
• Balanced nutrition - fuel your workouts

**Popular Topics I Can Help With:**
• Weight loss exercises and diet tips
• Muscle building and strength training
• Beginner workout routines
• Stretching and flexibility exercises
• General fitness and health advice

Try asking me about specific topics like "weight loss exercises" or "beginner workout routine" for more detailed information!`;
}

// Function to add a message to the chat
function addMessage(message, isUser = false) {
  const chatMessages = document.getElementById('chatMessages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
  
  const avatar = isUser ? '👤' : '🤖';
  
  messageDiv.innerHTML = `
    <div class="message-content">
      <div class="message-avatar">${avatar}</div>
      <div class="message-text">
        <p>${message}</p>
      </div>
    </div>
  `;
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to show typing indicator
function showTypingIndicator() {
  const chatMessages = document.getElementById('chatMessages');
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message ai-message';
  typingDiv.id = 'typingIndicator';
  
  typingDiv.innerHTML = `
    <div class="message-content">
      <div class="message-avatar">🤖</div>
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>
  `;
  
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to hide typing indicator
function hideTypingIndicator() {
  const typingIndicator = document.getElementById('typingIndicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// Function to handle user input
function handleUserInput() {
  const chatInput = document.getElementById('chatInput');
  const userMessage = chatInput.value.trim();
  
  if (userMessage === '') return;
  
  // Add user message
  addMessage(userMessage, true);
  chatInput.value = '';
  
  // Show typing indicator
  showTypingIndicator();
  
  // Simulate AI thinking time
  setTimeout(() => {
    hideTypingIndicator();
    
    // Get AI response
    const aiResponse = getAIResponse(userMessage);
    addMessage(aiResponse);
  }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
}

// Function for quick questions
function askQuickQuestion(question) {
  const chatInput = document.getElementById('chatInput');
  chatInput.value = question;
  handleUserInput();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  const chatInput = document.getElementById('chatInput');
  const sendButton = document.getElementById('sendButton');
  
  // Send message on Enter key
  chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      handleUserInput();
    }
  });
  
  // Send message on button click
  sendButton.addEventListener('click', handleUserInput);
  
  // Focus on input when page loads
  chatInput.focus();
}); 