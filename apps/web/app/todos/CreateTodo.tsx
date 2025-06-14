"use client";

import { useState } from "react";
import { trpc } from "../../trpc/client";

export default function CreateToDo() {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "">("");

  const utils = trpc.useUtils();

  const mutation = trpc.todo.createTodo.useMutation({
    onSuccess: () => {
      setName("");
      setDescription("");
      setDueDate("");
      setPriority("");
      setShowModal(false); // Close modal after success
      utils.todo.getAllTodos.invalidate();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim()) return;

    mutation.mutate({
      name: name.trim(),
      description: description.trim(),
      completed: false,
      dueDate: dueDate,
      priority: priority || undefined,
    });
  };

  return (
    <>
      {/* Button in top-left corner */}
      <div className="p-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Create Todo
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-lg"
            >
              &times;
            </button>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Create a Todo
              </h2>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Todo name"
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2 rounded outline-none"
              />

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2 rounded outline-none resize-none"
              />

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2 rounded outline-none"
              />

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as "" | "low" | "medium" | "high")
                }
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2 rounded outline-none"
              >
                <option value="">Priority (Optional)</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full font-medium transition disabled:opacity-50"
              >
                {mutation.isPending ? "Creating..." : "Create Todo"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
