// Archivo: api/deepseek.js
// Este archivo debe estar en la carpeta /api/ de tu proyecto Vercel

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Manejar preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { model, messages, temperature, max_tokens } = req.body;

    // Validar datos recibidos
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Formato de mensajes inválido' });
    }

    // Obtener API key desde variables de entorno
    const API_KEY = process.env.DEEPSEEK_API_KEY;
    
    if (!API_KEY) {
      console.error('API Key no configurada');
      return res.status(500).json({ error: 'API Key no configurada en el servidor' });
    }

    // Hacer solicitud a DeepSeek
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: model || 'deepseek-chat',
        messages: messages,
        temperature: temperature || 0.5,
        max_tokens: max_tokens || 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Error de DeepSeek:', errorData);
      return res.status(response.status).json({ 
        error: `Error de DeepSeek API: ${response.status}`,
        details: errorData
      });
    }

    const data = await response.json();
    
    // Devolver respuesta
    return res.status(200).json(data);

  } catch (error) {
    console.error('Error en el servidor:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor',
      message: error.message 
    });
  }
}