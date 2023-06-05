import React, { useState, useEffect } from "react";
import axios from "axios";

const NotesApp = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [filterByImportance, setFilterByImportance] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get("http://localhost:3001/notes");
      setNotes(response.data);
    } catch (error) {
      setError("Ocorreu um erro ao buscar as notas. Por favor, tente novamente mais tarde.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async () => {
    if (!newNote) return;

    try {
      setLoading(true);
      setError(null);
      setSuccessMessage("");

      const response = await axios.post("http://localhost:3001/notes", {
        content: newNote,
        importance: false, // Adicionado para definir a importância como false por padrão
      });
      setNotes([...notes, response.data]);
      setNewNote("");
      setSuccessMessage("Anotação salva com sucesso!");
    } catch (error) {
      setError("Ocorreu um erro ao adicionar a nota. Por favor, tente novamente mais tarde.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateNote = async (id, updatedContent) => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage("");

      await axios.put(`http://localhost:3001/notes/${id}`, {
        content: updatedContent,
      });
      const updatedNotes = notes.map((note) =>
        note.id === id ? { ...note, content: updatedContent } : note
      );
      setNotes(updatedNotes);
      setEditingNoteId(null);
      setSuccessMessage("Anotação atualizada com sucesso!");
    } catch (error) {
      setError("Ocorreu um erro ao atualizar a nota. Por favor, tente novamente mais tarde.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id) => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage("");

      await axios.delete(`http://localhost:3001/notes/${id}`);
      const filteredNotes = notes.filter((note) => note.id !== id);
      setNotes(filteredNotes);
      setSuccessMessage("Anotação excluída com sucesso!");
    } catch (error) {
      setError("Ocorreu um erro ao excluir a nota. Por favor, tente novamente mais tarde.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFilterByImportance = () => {
    setFilterByImportance(!filterByImportance);
  };

  const filteredNotes = filterByImportance ? notes.filter((note) => note.importance) : notes;

  return (
    <div>
      <h1>Minhas Anotações</h1>

      {successMessage && <p className="success-message">{successMessage}</p>}

      {error && <p className="error-message">{error}</p>}

      <div>
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          disabled={loading}
        />
        <button onClick={createNote} disabled={loading}>
          Adicionar
        </button>
        <button onClick={toggleFilterByImportance} disabled={loading}>
          {filterByImportance ? "Mostrar todas" : "Mostrar importantes"}
        </button>
      </div>

      <ul>
        {filteredNotes.map((note) => (
          <li key={note.id}>
            {editingNoteId === note.id ? (
              <input
                type="text"
                value={note.content}
                onChange={(e) => updateNote(note.id, e.target.value)}
                disabled={loading}
              />
            ) : (
              <>
                <span>{note.content}</span>
                <button onClick={() => setEditingNoteId(note.id)} disabled={loading}>
                  Editar
                </button>
                <button onClick={() => deleteNote(note.id)} disabled={loading}>
                  Excluir
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotesApp;
