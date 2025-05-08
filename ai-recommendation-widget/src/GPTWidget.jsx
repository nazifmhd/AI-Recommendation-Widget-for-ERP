import React, { useState } from 'react';
import axios from 'axios';

function GPTWidget() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/gpt', {
        prompt: input,
      });
      setResponse(res.data.message);
    } catch (err) {
      setResponse('Error fetching response.');
    }
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask me anything..."
      />
      <button onClick={handleSubmit}>Ask GPT</button>
      <p>Response: {response}</p>
    </div>
  );
}

export default GPTWidget;
