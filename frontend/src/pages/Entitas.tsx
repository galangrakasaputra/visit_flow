
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, CheckCircle, AlertCircle } from "lucide-react";

import {
  getEntitas,
  createEntitas,
  updateEntitas,
  deleteEntitas,
  type Entitas as EntitasType,
  type EntitasPayload,
} from "../api/Entitas";

const initialForm: EntitasPayload = {
  name: "",
  type: "",
  segment: "",
  region: "",
};

function Entitas() {
  const [entitas, setEntitas] = useState<EntitasType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<EntitasPayload>(initialForm);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [formError, setFormError] = useState("");

  const showNotification = (
    type: "success" | "error",
    message: string
    ) => {
    setNotification({ type, message });
    };

  const fetchEntitas = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getEntitas();
      setEntitas(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data entitas."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntitas();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(initialForm);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (item: EntitasType) => {
    setEditingId(item.id);

    setForm({
      name: item.name,
      type: item.type,
      segment: item.segment,
      region: item.region,
    });

    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingId(null);
    setForm(initialForm);
    setFormError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
        setSaving(true);
        setFormError("");

        let response;

        if (editingId !== null) {
        response = await updateEntitas(editingId, form);
        } else {
        response = await createEntitas(form);
        }

        if (response.status === "error") {
        showNotification("error", response.message);
        return;
        }

        setModalOpen(false);
        setEditingId(null);
        setForm(initialForm);

        await fetchEntitas();

        showNotification(
        "success",
        response.message || "Data entitas berhasil disimpan."
        );
    } catch (err) {
        showNotification(
        "error",
        err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat menyimpan data."
        );
    } finally {
        setSaving(false);
    }
    };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
        "Apakah kamu yakin ingin menghapus entitas ini?"
    );

    if (!confirmed) return;

    try {
        setDeletingId(id);

        const response = await deleteEntitas(id);

        if (response.status === "error") {
        showNotification("error", response.message);
        return;
        }

        setEntitas((prev) => prev.filter((item) => item.id !== id));

        showNotification(
        "success",
        response.message || "Entitas berhasil dihapus."
        );
    } catch (err) {
        showNotification(
        "error",
        err instanceof Error
            ? err.message
            : "Gagal menghapus entitas."
        );
    } finally {
        setDeletingId(null);
    }
    };

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Entitas
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Daftar seluruh entitas yang terdaftar di sistem.
          </p>
        </div>

        {/* Tabel */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <h2 className="font-semibold text-gray-800">
              Daftar Entitas
            </h2>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Plus size={18} />
              Tambah Entitas
            </button>
          </div>

          {error && (
            <div className="m-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-600">
                    No
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-600">
                    Nama Entitas
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-600">
                    Tipe
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-600">
                    Segmen
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-600">
                    Region
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-600">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                      Memuat data entitas...
                    </td>
                  </tr>
                ) : entitas.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                      Belum ada data entitas.
                    </td>
                  </tr>
                ) : (
                  entitas.map((item, index) => (
                    <tr key={item.id} className="transition hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-500">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4 font-medium text-gray-800">
                        {item.name}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {item.type}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {item.segment}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {item.region}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(item)}
                            title="Edit entitas"
                            className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            title="Hapus entitas"
                            className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Tambah / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-auto w-full max-w-lg rounded-xl bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingId !== null ? "Edit Entitas" : "Tambah Entitas"}
              </h2>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Nama Entitas
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Masukkan nama entitas"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Tipe
                </label>
                <input
                  type="text"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Masukkan tipe entitas"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Segmen
                </label>
                <input
                  type="text"
                  name="segment"
                  value={form.segment}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Masukkan segmen entitas"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Region
                </label>
                <input
                  type="text"
                  name="region"
                  value={form.region}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Masukkan region entitas"
                />
              </div>

              {formError && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {formError}
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Menyimpan..."
                    : editingId !== null
                      ? "Simpan Perubahan"
                      : "Tambah Entitas"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {notification && (
        <div className="fixed right-4 top-4 z-[100] w-[calc(100%-2rem)] max-w-sm animate-in slide-in-from-top-2">
            <div
            className={`flex items-start gap-3 rounded-xl border bg-white p-4 shadow-lg ${
                notification.type === "success"
                ? "border-green-200"
                : "border-red-200"
            }`}
            >
            {notification.type === "success" ? (
                <CheckCircle className="mt-0.5 shrink-0 text-green-600" size={21} />
            ) : (
                <AlertCircle className="mt-0.5 shrink-0 text-red-600" size={21} />
            )}

            <div className="min-w-0 flex-1">
                <p className={`text-sm font-semibold ${
                notification.type === "success"
                    ? "text-green-700"
                    : "text-red-700"
                }`}>
                {notification.type === "success" ? "Berhasil" : "Gagal"}
                </p>

                <p className="mt-1 text-sm text-gray-600">
                {notification.message}
                </p>
            </div>

            <button
                type="button"
                onClick={() => setNotification(null)}
                className="shrink-0 text-gray-400 hover:text-gray-600"
            >
                <X size={18} />
            </button>
            </div>
        </div>
        )}
    </main>
  );
}

export default Entitas;
