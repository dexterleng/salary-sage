'use client';

import { useChat } from 'ai/react';

export default function Chat() {
  // useChat() should be used like so: useChat({ api: '<route_name>' })
  const { messages, input, handleInputChange, handleSubmit } = useChat({ api: '/chat_test' });

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.role}: {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}