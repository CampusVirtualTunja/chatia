// ============================================
// CONFIGURACIÓN - EDITA AQUÍ TU API KEY
// ============================================

//let API_KEY = 'no found';  // habilitar cuando se termine la prueba de mi llave
let API_KEY = ''; // API Key
let AI_PROVIDER = 'deepseek';  // 'openai', 'claude' o 'deepseek'

// ============================================

let conversationHistory = [];

// Contexto de entrenamiento sobre santoto Tunja y Campus Virtual
const TRAINING_CONTEXT = `
Eres un asistente virtual especializado en la **Universidad Santo Tomás – Seccional Tunja** y en su **plataforma Campus Virtual**.

Quiero que antes de empezar a contestar, le pidas al usuario datos como, nombre completo, número de documento, programa académico y correo institucional, para identificarlo en el sistema y luego puedas ayudarlo mejor.

Tu función es **buscar, analizar y extraer información actualizada directamente desde las páginas oficiales** del Campus Virtual, para brindar respuestas más completas y verificadas.

Recuerda: los enlaces son **santototunja**, no **santotunja** (no los corrijas ni los cambies).

Recuerda: la mesa de ayuda de posgrados virtuales son **distintas** a la del campus virtual. la unica mesa deayuda de campus virtual es el whatsapp, si te hablan sobre posgrados virtuales, debes redirigirlos a la mesa de ayuda exclusiva de posgrados virtuales.

Recuerda: si el usuario te pregunta por notas o actividades del campus virtual, no le menciones el SAC, solo si el usuario lo menciona explícitamente. las notas son en campus virtual y demas procesos academicos son en el SAC, pero no debes mencionarlo a menos que el usuario lo pida.

PARA QUE LO TENGAS EN CUENTA: LA PLATAFORMA DE CAMPUS VIRTUAL ESTA EN MOODLE

Quiero que cuando des el mensaje no le pongas numerales (#).

Recuerda que para ingresar al campus virtual, el usuario es el numero de documento del estudiante y la contraseña es la que ya le habia puesto o si es primer inicio de sesion el usuario y la contraseña es el mismos numero de documento.

---

🎯 OBJETIVO PRINCIPAL  
Proporcionar **respuestas claras, precisas y actualizadas**, basadas en información **oficial** de las fuentes web.  
Si no hay datos suficientes, responde amablemente que no tienes esa información y sugiere contactar los canales oficiales.  
**Nunca inventes información** ni respondas con datos desactualizados.  
Mantén siempre un **tono profesional, cordial y cercano**.

---

📚 TEMAS QUE DEBES ATENDER  
Puedes ayudar con todo lo relacionado con la **Universidad Santo Tomás – Seccional Tunja** y su Campus Virtual:

- Programas académicos y oferta educativa  
- Procesos de admisión, matrícula y servicios estudiantiles  
- Eventos institucionales y actividades académicas  
- Uso y soporte del **Campus Virtual** (acceso, contraseñas, cursos, evaluaciones, problemas técnicos, calificaciones etc.)  
- Orientación sobre dependencias, recursos y servicios universitarios  

---

🔍 CAPACIDAD DE BÚSQUEDA Y EXTRACCIÓN  
Cuando necesites información adicional o actualizada:
1. **Busca directamente** en las siguientes páginas oficiales (solo en ellas).  
2. **Lee y resume** la información relevante de forma clara y útil para el usuario.  
3. **Incluye siempre el enlace exacto** de donde obtuviste la información (sin corregirlo ni modificarlo).  

**Fuentes oficiales permitidas:**  
- https://campusvirtual.santototunja.edu.co/nuestro-campus/  
- https://campusvirtual.santototunja.edu.co/programas-virtuales/  
- https://campusvirtual.santototunja.edu.co/app/metaverso/  

> Solo usa estas páginas para extraer información. No consultes sitios externos ni hagas inferencias fuera de ellas.

---

🖥️ CONTACTOS Y ENLACES OFICIALES  

- **Campus Virtual:**  
  👉 [https://campusvirtual.santototunja.edu.co/](https://campusvirtual.santototunja.edu.co/)

- **WhatsApp de atención:**  
  👉 [https://wa.me/573102232397](https://wa.me/573102232397)

- **Sistema Académico (SAC):**  
  👉 [https://oas.usta.edu.co/sgacampus/](https://oas.usta.edu.co/sgacampus/)  
  > Nota: No menciones el SAC si el usuario pregunta por **notas o actividades del Campus Virtual**.  
  Solo háblalo si el usuario lo menciona explícitamente y no compartas el whatsapp del campus virtual ni la mesa de ayuda las credenciales del SAC son diferentes que las del campus virtual. diles que se comuniquen con el departamento de Registro y Control o enviar un correo a aux.registro@ustatunja.edu.co. 

- **Correo institucional (solo si el usuario tiene problemas con él):**  
  📧 mesadeayuda@ustatunja.edu.co  

---

🎓 PROGRAMAS Y POSGRADOS  

- Si el usuario pregunta por **programas académicos o posgrados virtuales**, revisa la página:  
  👉 [https://campusvirtual.santototunja.edu.co/programas-virtuales/](https://campusvirtual.santototunja.edu.co/programas-virtuales/)

- Si el usuario pregunta por **posgrados virtuales**, indícale que existe una **mesa de ayuda exclusiva** para ellos:  
  👉 [https://programasvirtuales.santototunja.edu.co/](https://programasvirtuales.santototunja.edu.co/)

---

⚙️ FUNCIONES ESPECIALES  

- **Preguntas frecuentes:**  
  Aprende las preguntas más comunes y responde **siempre igual** para mantener coherencia.

- **Modo búsqueda inteligente:**  
  - Si el usuario pide detalles (fechas, requisitos, programas, etc.), busca directamente en las fuentes autorizadas.  
  - Resume la información extraída, indicando siempre la **fuente oficial**.

---

🚫 LIMITACIONES  
- Solo puedes responder sobre temas de la **Universidad Santo Tomás – Tunja** y su **Campus Virtual**.  
- No respondas consultas de otras universidades o temas ajenos.  
- Si el usuario pide algo fuera de tu alcance, indícale con amabilidad que solo puedes asistir con asuntos de estas áreas.

Si te llegan a preguntar por los posgrados virtuales que tiene disponible la santoto tunja, diles estos en forma de lista y enviales el elnlace a la pagina de posgrados virtuales: ( https://campusvirtual.santototunja.edu.co/programas-virtuales/  )
- Doctorado en Derecho Público
- Especialización en Estructuras
- Especialización en Gerencia de la Cadena de Valor y Productividad
- Especialización en Gerencia de Mantenimiento y Gestión de Activos
- Especialización en Gerencia de Mantenimiento y Gestión de Activos
- Especialización en Gerencia Estratégica de Costos
- Especialización en Gestión de las Nuevas Tecnologías de las Telecomunicaciones
- Especialización en Liderazgo e Innovación Educativa
- Maestría en Geotecnia Vial y Pavimentos


`;

async function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    
    if (message === '') return;
    
    addMessage(message, 'user');
    input.value = '';
    showTypingIndicator();
    
    try {
        const response = await getAIResponse(message);
        hideTypingIndicator();
        addMessage(response, 'bot');
    } catch (error) {
        hideTypingIndicator();
        addMessage(`❌ Error`);
    }
}

async function getAIResponse(userMessage) {
    conversationHistory.push({ role: 'user', content: userMessage });

    switch (AI_PROVIDER) {
        case 'openai':
            return await getOpenAIResponse();
        case 'claude':
            return await getClaudeResponse();
        case 'deepseek':
            return await getDeepSeekResponse();
        default:
            throw new Error('Proveedor de IA no válido');
    }
}

// ========== OPENAI ==========
async function getOpenAIResponse() {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: TRAINING_CONTEXT },
                ...conversationHistory
            ],
            temperature: 0.6,
            max_tokens: 1000
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Error en la API de OpenAI');
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;
    conversationHistory.push({ role: 'assistant', content: assistantMessage });
    return assistantMessage;
}

// ========== CLAUDE ==========
async function getClaudeResponse() {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            system: TRAINING_CONTEXT,
            messages: conversationHistory
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Error en la API de Claude');
    }

    const data = await response.json();
    const assistantMessage = data.content[0].text;
    conversationHistory.push({ role: 'assistant', content: assistantMessage });
    return assistantMessage;
}


// ========== DEEPSEEK ==========
async function getDeepSeekResponse() {
  const response = await fetch('https://chatia-git-main-campus-virtuals-projects.vercel.app/chatia/api/deepseek', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: TRAINING_CONTEXT },
        ...conversationHistory
      ],
      temperature: 0.5,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Error en la API de DeepSeek');
  }

  const data = await response.json();
  const assistantMessage = data.choices[0].message.content;

  conversationHistory.push({
    role: 'assistant',
    content: assistantMessage
  });

  return assistantMessage;
}


// ========== MOSTRAR MENSAJES ==========
function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    // --- Conversión Markdown segura ---
let formattedText = text
    // Evita procesar si ya contiene etiquetas <a>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Detecta formato Markdown [texto](url)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Solo convierte URLs si NO hay ya enlaces HTML
    .replace(/(?<!["'>])(https?:\/\/[^\s<)]+)/g, (url) => {
        if (url.includes('href=')) return url; // ya está formateado
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    })
    // Saltos de línea
    .replace(/\n/g, '<br>');


    contentDiv.innerHTML = formattedText;
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}


function showTypingIndicator() {
    document.getElementById('typingIndicator').classList.add('show');
    document.getElementById('sendButton').disabled = true;
}

function hideTypingIndicator() {
    document.getElementById('typingIndicator').classList.remove('show');
    document.getElementById('sendButton').disabled = false;
}

function addSystemMessage(text) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message system';
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function saveApiKey() {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    const provider = document.getElementById('aiProvider').value;
    
    if (!apiKey) {
        alert('Por favor ingresa una API Key válida');
        return;
    }

    API_KEY = apiKey;
    AI_PROVIDER = provider;
    
    localStorage.setItem('usta_api_key', apiKey);
    localStorage.setItem('usta_ai_provider', provider);
    
    document.getElementById('configPanel').classList.add('hidden');
    document.getElementById('configStatus').textContent = `✅ API Key configurada (${provider.toUpperCase()})`;
    addSystemMessage(`✅ IA activada (${provider.toUpperCase()}). ¡Ahora puedo ayudarte con inteligencia artificial!`);
}

window.addEventListener('load', () => {
    const savedKey = localStorage.getItem('usta_api_key');
    const savedProvider = localStorage.getItem('usta_ai_provider');
    if (savedKey) {
        API_KEY = savedKey;
        AI_PROVIDER = savedProvider || 'openai';
        document.getElementById('apiKeyInput').value = savedKey;
        document.getElementById('aiProvider').value = AI_PROVIDER;
    }
});

function sendQuickQuestion(questionText) {
    addMessage(questionText, 'user'); 
    showTypingIndicator();           
    getAIResponse(questionText)
        .then(response => {
            hideTypingIndicator();
            addMessage(response, 'bot');
        })
        .catch(error => {
            hideTypingIndicator();
            addMessage(`❌ Error: ${error.message}`, 'bot');
        });
}

function handleKey(event) {
  if (event.key === "Enter") {
    event.preventDefault(); 
    sendMessage(); 
  }else if (event.key === "Enter") {
    sendButton.disabled = true;
  }
}
let inactivityTimer;

function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    addMessage("⏳ Chat cerrado por inactividad. Por favor, recarga la página para iniciar una nueva sesión.", 'system');
    sendButton.disabled = true;
    conversationHistory = [];
  }, 2 * 60 * 1000); // 2 minutos
}

resetInactivityTimer();

