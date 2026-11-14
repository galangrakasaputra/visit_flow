
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  CalendarDays,
  MapPin,
  Building2,
  X,
  Filter,
  RefreshCw,
} from "lucide-react";

import {
  getKunjungan,
  createKunjungan,
  updateKunjungan,
  updateStatusKunjungan,
  deleteKunjungan,
  type Kunjungan,
} from "../api/Kunjungan";

import { getEntitas } from "../api/Entitas";

type EntitasOption = Awaited<ReturnType<typeof getEntitas>>[number];

type ToastType = "success" | "error";

type ToastData = {
  message: string;
  type: ToastType;
};

export default function KunjunganPage() {
  const [kunjungan, setKunjungan] = useState<Kunjungan[]>([]);
  const [entitasList, setEntitasList] = useState<EntitasOption[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);

  const [toast, setToast] = useState<ToastData | null>(null);

  // Filter
  const [searchName, setSearchName] = useState("");
  const [filterSegment, setFilterSegment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedKunjungan, setSelectedKunjungan] =
    useState<Kunjungan | null>(null);

  // Form
  const [formSegment, setFormSegment] = useState("");
  const [formEntitasId, setFormEntitasId] = useState("");
  const [formVisitDate, setFormVisitDate] = useState("");
  const [formStatus, setFormStatus] = useState(false);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [toast]);

  // Mengambil daftar entitas untuk dropdown form
  useEffect(() => {
    let active = true;

    async function fetchEntitas() {
      try {
        const data = await getEntitas();

        if (active) {
          setEntitasList(data);
        }
      } catch (error) {
        if (active) {
          showToast(
            error instanceof Error
              ? error.message
              : "Gagal mengambil data entitas.",
            "error"
          );
        }
      }
    }

    fetchEntitas();

    return () => {
      active = false;
    };
  }, []);

  // Mengambil data kunjungan sekaligus menjalankan filter
  useEffect(() => {
    let active = true;

    async function fetchKunjungan() {
      setLoading(true);

      try {
        const data = await getKunjungan({
          name: searchName.trim(),
          segment: filterSegment,
          status: filterStatus,
          tanggal_mulai: tanggalMulai,
          tanggal_akhir: tanggalAkhir,
        });

        if (active) {
          setKunjungan(data);
        }
      } catch (error) {
        if (active) {
          showToast(
            error instanceof Error
              ? error.message
              : "Gagal mengambil data kunjungan.",
            "error"
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchKunjungan();

    return () => {
      active = false;
    };
  }, [
    searchName,
    filterSegment,
    filterStatus,
    tanggalMulai,
    tanggalAkhir,
  ]);

  // Entitas yang ditampilkan mengikuti segment yang dipilih
  const filteredEntitas = useMemo(() => {
    if (!formSegment) return [];

    return entitasList.filter(
      (item) => item.segment === formSegment
    );
  }, [entitasList, formSegment]);

  const resetForm = () => {
    setSelectedKunjungan(null);
    setFormSegment("");
    setFormEntitasId("");
    setFormVisitDate("");
    setFormStatus(false);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (item: Kunjungan) => {
    setSelectedKunjungan(item);
    setFormSegment(item.entitas?.segment ?? "");
    setFormEntitasId(String(item.entitas_id));
    setFormVisitDate(item.visit_date);
    setFormStatus(item.status);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSegmentChange = (value: string) => {
    setFormSegment(value);
    setFormEntitasId("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formSegment || !formEntitasId || !formVisitDate) {
      showToast("Lengkapi semua data terlebih dahulu.", "error");
      return;
    }

    const payload = {
      entitas_id: Number(formEntitasId),
      visit_date: formVisitDate,
      status: formStatus,
    };

    setSubmitting(true);

    try {
      if (selectedKunjungan) {
        await updateKunjungan(selectedKunjungan.id, payload);
        showToast("Kunjungan berhasil diperbarui.", "success");
      } else {
        await createKunjungan({
          entitas_id: payload.entitas_id,
          visit_date: payload.visit_date,
        });
        showToast("Kunjungan berhasil ditambahkan.", "success");
      }

      closeModal();

      const data = await getKunjungan({
        name: searchName.trim(),
        segment: filterSegment,
        status: filterStatus,
        tanggal_mulai: tanggalMulai,
        tanggal_akhir: tanggalAkhir,
      });

      setKunjungan(data);
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan data kunjungan.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (item: Kunjungan) => {
    const newStatus = !item.status;

    setUpdatingStatusId(item.id);

    try {
      await updateStatusKunjungan(item.id, newStatus);

      setKunjungan((previous) =>
        previous.map((data) =>
          data.id === item.id
            ? { ...data, status: newStatus }
            : data
        )
      );

      showToast(
        newStatus
          ? "Status berhasil diubah menjadi sudah dikunjungi."
          : "Status berhasil diubah menjadi belum dikunjungi.",
        "success"
      );
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Gagal memperbarui status.",
        "error"
      );
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleDelete = async (item: Kunjungan) => {
    const confirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus kunjungan ke ${item.entitas?.name ?? "entitas ini"}?`
    );

    if (!confirmed) return;

    try {
      await deleteKunjungan(item.id);

      setKunjungan((previous) =>
        previous.filter((data) => data.id !== item.id)
      );

      showToast("Kunjungan berhasil dihapus.", "success");
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Gagal menghapus kunjungan.",
        "error"
      );
    }
  };

  const clearFilters = () => {
    setSearchName("");
    setFilterSegment("");
    setFilterStatus("");
    setTanggalMulai("");
    setTanggalAkhir("");
  };

  const formatDate = (date: string) => {
    if (!date) return "-";

    return new Date(`${date}T00:00:00`).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Kunjungan
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Kelola dan pantau daftar kunjungan entitas.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Tambah Kunjungan
        </button>
      </div>

      {/* Filter */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <h2 className="font-semibold text-gray-800">
            Filter Kunjungan
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Cari nama entitas..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Segment */}
          <select
            value={filterSegment}
            onChange={(e) => setFilterSegment(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Semua Segment</option>
            <option value="B2B">B2B</option>
            <option value="B2C">B2C</option>
          </select>

          {/* Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Semua Status</option>
            <option value="1">Sudah Dikunjungi</option>
            <option value="0">Belum Dikunjungi</option>
          </select>

          {/* Start date */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Tanggal Mulai
            </label>
            <input
              type="date"
              value={tanggalMulai}
              max={tanggalAkhir || undefined}
              onChange={(e) => setTanggalMulai(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* End date */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Tanggal Akhir
            </label>
            <input
              type="date"
              value={tanggalAkhir}
              min={tanggalMulai || undefined}
              onChange={(e) => setTanggalAkhir(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            <RefreshCw size={16} />
            Reset Filter
          </button>
        </div>
      </div>

      {/* List Kunjungan */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">
            Daftar Kunjungan
          </h2>
          <span className="text-sm text-gray-500">
            {kunjungan.length} data
          </span>
        </div>

        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-white py-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
            <p className="mt-3 text-sm text-gray-500">
              Memuat data kunjungan...
            </p>
          </div>
        ) : kunjungan.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-12 text-center">
            <CalendarDays
              size={36}
              className="mx-auto text-gray-300"
            />
            <h3 className="mt-3 font-semibold text-gray-700">
              Data kunjungan tidak ditemukan
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Coba ubah kata pencarian atau filter yang digunakan.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {kunjungan.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
                      <Building2 size={21} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-gray-800">
                        {item.entitas?.name ?? "Entitas tidak ditemukan"}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        {item.entitas?.type ?? "-"}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                    {item.entitas?.segment ?? "-"}
                  </span>
                </div>

                <div className="mt-5 space-y-3 border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} className="shrink-0 text-gray-400" />
                    <span>{item.entitas?.region ?? "-"}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarDays
                      size={16}
                      className="shrink-0 text-gray-400"
                    />
                    <span>{formatDate(item.visit_date)}</span>
                  </div>
                </div>

                {/* Status checkbox */}
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={Boolean(item.status)}
                      disabled={updatingStatusId === item.id}
                      onChange={() => handleToggleStatus(item)}
                      className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-wait"
                    />
                    <span>
                      {item.status
                        ? "Sudah Dikunjungi"
                        : "Belum Dikunjungi"}
                    </span>
                  </label>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      title="Edit kunjungan"
                      className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      title="Hapus kunjungan"
                      className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Tambah / Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-auto w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 className="font-semibold text-gray-800">
                  {selectedKunjungan
                    ? "Edit Kunjungan"
                    : "Tambah Kunjungan"}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Isi informasi kunjungan entitas.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              {/* Segment */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Segment <span className="text-red-500">*</span>
                </label>

                <select
                  value={formSegment}
                  onChange={(e) => handleSegmentChange(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Pilih Segment</option>
                  <option value="B2B">B2B</option>
                  <option value="B2C">B2C</option>
                </select>
              </div>

              {/* Entitas */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Entitas <span className="text-red-500">*</span>
                </label>

                <select
                  value={formEntitasId}
                  onChange={(e) => setFormEntitasId(e.target.value)}
                  required
                  disabled={!formSegment}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                >
                  <option value="">
                    {formSegment
                      ? "Pilih Entitas"
                      : "Pilih segment terlebih dahulu"}
                  </option>

                  {filteredEntitas.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>

                {formSegment && filteredEntitas.length === 0 && (
                  <p className="mt-1.5 text-xs text-amber-600">
                    Belum ada entitas untuk segment {formSegment}.
                  </p>
                )}
              </div>

              {/* Tanggal */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Tanggal Kunjungan{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="date"
                  value={formVisitDate}
                  onChange={(e) => setFormVisitDate(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={submitting || !formEntitasId}
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Menyimpan..."
                    : selectedKunjungan
                      ? "Simpan Perubahan"
                      : "Tambah Kunjungan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed right-4 top-4 z-[60] w-[calc(100%-2rem)] max-w-sm">
          <div
            className={`flex items-start gap-3 rounded-lg border bg-white p-4 shadow-lg ${
              toast.type === "success"
                ? "border-green-200"
                : "border-red-200"
            }`}
          >
            <div
              className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                toast.type === "success"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            />

            <p className="flex-1 text-sm text-gray-700">
              {toast.message}
            </p>

            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-gray-400 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}