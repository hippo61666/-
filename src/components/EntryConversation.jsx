import React from 'react';

export default function EntryConversation({ message }) {
  return <div className="entry-conversation">
    {message.paragraphs.map((text, index) => <p key={index}>{text}</p>)}
    {message.bullets && <ul>{message.bullets.map((text, index) => <li key={index}>{text}</li>)}</ul>}
    {message.closing && <p>{message.closing}</p>}
  </div>;
}
