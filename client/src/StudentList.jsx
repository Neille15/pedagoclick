import { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL;
const pageSize = 3;

export default function StudentList() {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadStudents() {
      try {
        const studentsUrl = `${apiUrl}/api/students?page=${page}&limit=${pageSize}`;
        const response = await fetch(studentsUrl, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Could not load students (HTTP ${response.status}).`);
        }

        const payload = await response.json();
        setResult(payload);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message);
        }
      }
    }

    loadStudents();
    return () => controller.abort();
  }, [page]);

  if (error) return <p role="alert">{error}</p>;
  if (result === null) return <p>Loading students…</p>;
  if (result.total === 0) return <p>No students found.</p>;

  const students = result.data;
  const totalPages = Math.ceil(result.total / result.limit);

  function goToPage(nextPage) {
    setResult(null);
    setPage(nextPage);
  }

  return (
    <section className="mt-6">
      <h2 className="text-xl font-bold">Students</h2>
      <ul className="mt-2 space-y-2">
        {students.map((student) => (
          <li
            key={student.student_number}
            className="flex flex-col gap-1 rounded-lg border border-slate-700 p-3 sm:flex-row sm:items-center sm:gap-4"
          >
            <span className="text-sm text-slate-300">
              {student.student_number}
            </span>
            <span>
              {student.first_name} {student.last_name}
            </span>
          </li>
        ))}
      </ul>
      <nav aria-label="Student pages" className="mt-4 flex items-center gap-4">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => goToPage(page - 1)}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => goToPage(page + 1)}
        >
          Next
        </button>
      </nav>
    </section>
  );
}
