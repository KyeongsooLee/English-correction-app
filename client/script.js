import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');
//const essayButton = document.querySelector('#essay_button');
//const articleButton = document.querySelector('#article_button');
const correctionButton = document.querySelector('#correction_button');

let loadInterval;

function loader(element){
  element.textContent = '';

  loadInterval = setInterval(() => {
    // Update the text content of the loading indicator
    element.textContent += '.';

    // If the loading indicator has reached three dots, reset it
    if (element.textContent === '....'){
      element.textContent = '';
    }
  }, 300)
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if(index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20)
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId(){
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe (isAi, value, uniqueId) {
  return (
    `
     <div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img
            src="${isAi ? bot : user}"
            alt="${isAi ? 'bot' : 'user'}"
            />
        </div>
        <div class="message" id=${uniqueId}>${value}</div>
      </div>
     </div>
    `
  )
}

const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  // user's chatstripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  // to clear the textarea input 
  form.reset();

  // bot's chatstripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  // to focus scroll to the bottom 
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // specific message div 
  const messageDiv = document.getElementById(uniqueId);
  
  // messageDiv.innerHTML = "..."
  loader(messageDiv);

  const response = await fetch('https://chatgpt-clone-hgmk.onrender.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    }),
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = " ";

  if(response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim(); // trims any trailing spaces/'\n' 

    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();

    messageDiv.innerHTML = "Something went wrong";
    alert(err);
  }
}

// form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
})

// articleButton.addEventListener('click', async (e) => {
//   const prompts = [
//     "What are some of the most effective online resources for learning English? How can learners make the most of these resources?",
//     "Explore the benefits of online language tutoring for English learners. How can learners find the right tutor for their needs?",
//     "Discuss the impact of online learning on the future of English language education. What are some of the key trends and challenges?",
//     "What are some effective strategies for improving speaking and listening skills in online English courses?",
//     "Explore the impact of online language learning on the job market. How can employers benefit from hiring English learners with online learning experience?",
//     "What are some of the best ways to practice English writing skills in an online learning environment?",
//     "Discuss the role of online language assessment in English language learning. How can learners prepare for and make the most of these assessments?",
//     "What are some of the most common misconceptions about online language learning? How can learners and teachers address these misconceptions?",
//     "Explore the benefits of gamification in online language learning for English learners. How can teachers incorporate gamification into their lessons?",
//     "Discuss the impact of online language learning on cultural exchange. How can learners and teachers foster cross-cultural understanding in online environments?",
//   ];
//   const articles = "Please generate it with 3 paragraph including intro, body, and conclusion. but don't add the words of intro, body, and conclusion."

//   const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
//   const prompt_screen = "Short Article about online learning"
//   e.preventDefault();

//   // user's chatstripe
//   chatContainer.innerHTML += chatStripe(false, prompt_screen);

//   // to clear the textarea input 
//   form.reset();

//   // bot's chatstripe
//   const uniqueId = generateUniqueId();
//   chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

//   // to focus scroll to the bottom 
//   chatContainer.scrollTop = chatContainer.scrollHeight;

//   // specific message div 
//   const messageDiv = document.getElementById(uniqueId);
  
//   // messageDiv.innerHTML = "..."
//   loader(messageDiv);

//   const response = await fetch('https://chatgpt-clone-hgmk.onrender.com', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       prompt: randomPrompt + articles,
//     }),
//   });

//   clearInterval(loadInterval);
//   messageDiv.innerHTML = " ";

//   if(response.ok) {
//     const data = await response.json();
//     const parsedData = data.bot.trim(); // trims any trailing spaces/'\n' 

//     typeText(messageDiv, parsedData);
//   } else {
//     const err = await response.text();

//     messageDiv.innerHTML = "Something went wrong";
//     alert(err);
//   }
// });

// essayButton.addEventListener('click', async (e) => {
//   const prompts = [
//     "Some people believe that online learning is more effective than traditional classroom learning for English language learners. Others argue that face-to-face instruction is still necessary. Discuss both views and give your own opinion.",
//     "What are the advantages and disadvantages of online learning for English language learners? Do you think this mode of instruction will become more prevalent in the future?",
//     "Discuss the role of technology in online language learning for English learners. How can technology be used effectively to enhance the learning experience?",
//     "What are the benefits of using online language exchange programs to improve English skills? How can learners make the most of these programs?",
//     "Some people argue that language learning is more effective when done in a classroom setting with a teacher. Others believe that online learning is just as effective. Discuss both views and give your own opinion.",
//     "Discuss the importance of feedback in online language learning for English learners. What are some strategies that teachers can use to provide effective feedback?",
//     "What are some of the most common challenges faced by English learners in online learning environments? How can these challenges be overcome?",
//     "Explore the impact of online language learning on the role of English language teachers. How are teachers adapting to this new mode of instruction?",
//     "What are some of the most effective ways to improve English pronunciation in an online learning environment?",
//     "Discuss the impact of online language learning on the future of English language education. How can institutions and educators adapt to meet the needs of learners in a rapidly changing landscape?",
//   ];
//   const essays = "Please generate it with 3 paragraph including intro, body, and conclusion. but don't add the words of intro, body, and conclusion."

//   const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
//   const prompt_screen = "Short Essay about online learning"
//   e.preventDefault();

//   // user's chatstripe
//   chatContainer.innerHTML += chatStripe(false, prompt_screen);

//   // to clear the textarea input 
//   form.reset();

//   // bot's chatstripe
//   const uniqueId = generateUniqueId();
//   chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

//   // to focus scroll to the bottom 
//   chatContainer.scrollTop = chatContainer.scrollHeight;

//   // specific message div 
//   const messageDiv = document.getElementById(uniqueId);
  
//   // messageDiv.innerHTML = "..."
//   loader(messageDiv);

//   const response = await fetch('https://chatgpt-clone-hgmk.onrender.com', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       prompt: randomPrompt + essays,
//     }),
//   });

//   clearInterval(loadInterval);
//   messageDiv.innerHTML = " ";

//   if(response.ok) {
//     const data = await response.json();
//     const parsedData = data.bot.trim(); // trims any trailing spaces/'\n' 

//     typeText(messageDiv, parsedData);
//   } else {
//     const err = await response.text();

//     messageDiv.innerHTML = "Something went wrong";
//     alert(err);
//   }
// });

correctionButton.addEventListener('click', async (e) => {  
  e.preventDefault();
  const data = new FormData(form);

  // user's chatstripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  // to clear the textarea input 
  form.reset();

  // bot's chatstripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  // to focus scroll to the bottom 
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // specific message div 
  const messageDiv = document.getElementById(uniqueId);
  
  // messageDiv.innerHTML = "..."
  loader(messageDiv);

  const response = await fetch('https://chatgpt-clone-hgmk.onrender.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    }),
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = " ";

  if(response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim(); // trims any trailing spaces/'\n' 

    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();

    messageDiv.innerHTML = "Something went wrong";
    alert(err);
  }
});