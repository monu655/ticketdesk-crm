import { useState } from 'react';
import { formatDateTime } from '../utils/format.js';
import Button from './Button.jsx';
import FormField from './FormField.jsx';

// `onAddNote(text)` must resolve to true when the note was saved.
export default function NotesPanel({ notes, onAddNote, saving }) {
  const [draft, setDraft] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || saving) return;

    const saved = await onAddNote(text);
    if (saved) setDraft('');
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <h2 className="border-b border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900">
        Internal Notes <span className="font-normal text-slate-500">({notes.length})</span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3 border-b border-slate-200 p-5">
        <FormField
          label="Add a note"
          name="note"
          as="textarea"
          rows={3}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Record what was done or what the customer said..."
          maxLength={2000}
        />
        <div className="flex justify-end">
          <Button type="submit" loading={saving} loadingLabel="Adding..." disabled={!draft.trim()}>
            Add Note
          </Button>
        </div>
      </form>

      {notes.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-slate-500">
          No internal notes yet. Add one to record the next step for this ticket.
        </p>
      ) : (
        <ul className="divide-y divide-slate-200">
          {notes.map((note) => (
            <li key={note.id} className="px-5 py-4">
              <p className="whitespace-pre-wrap text-sm text-slate-800">{note.note_text}</p>
              <p className="mt-2 text-xs text-slate-500">{formatDateTime(note.created_at)}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
