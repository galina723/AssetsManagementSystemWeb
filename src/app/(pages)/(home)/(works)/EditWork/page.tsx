"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

export default function EditWorkPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState<any[]>([]);

  const [work, setWork] = useState<any>({
    assetID: 0,
    name: "",
    dueDate: "",
    description: "",
    status: 0,
    assignedUserID: 0,
    assignedStaffIds: [],
  });

  // ============================
  // GET WORK BY ID
  // ============================
  const fetchWork = async () => {
    try {
      const res = await axios.get(
        `https://lumbar-mora-uncoroneted.ngrok-free.dev/api/work/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "ngrok-skip-browser-warning": "true",
          },
        },
      );

      const data = res.data.data;

      setWork({
        assetID: data.assetID,
        name: data.name,
        dueDate: data.dueDate?.slice(0, 16) || "",
        description: data.description,
        status: data.status,
        assignedUserID: data.assignedUserID,
        assignedStaffIds: data.assignedStaffIds,
      });
    } catch (err) {
      console.log(err);
      alert("Không lấy được work.");
    }
  };

  const fetchAssets = async () => {
    try {
      const res = await axios.get(
        `https://lumbar-mora-uncoroneted.ngrok-free.dev/api/asset`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "ngrok-skip-browser-warning": "true",
          },
        },
      );

      setAssets(res.data.data || []);
    } catch (err) {
      console.log(err);
      alert("Không lấy được danh sách asset.");
    }
  };

  useEffect(() => {
    Promise.all([fetchWork(), fetchAssets()]).then(() => {
      setLoading(false);
    });
  }, []);

  // ============================
  // HANDLE CHANGE
  // ============================
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setWork((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================
  // SUBMIT UPDATE
  // ============================
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await axios.put(
        `https://lumbar-mora-uncoroneted.ngrok-free.dev/api/work/${id}`,
        work,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "ngrok-skip-browser-warning": "true",
          },
        },
      );

      fetchWork();
      alert("Update thành công!");
      router.push("/work");
    } catch (err) {
      console.log(err);
      alert("Update thất bại");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  // ============================
  // UI
  // ============================
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h1 className="text-2xl font-bold mb-5">Edit Work #{id}</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ASSET ID DROPDOWN */}
        <div>
          <label className="font-medium">Asset</label>
          <select
            name="assetID"
            value={work.assetID}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value={0}>-- Select Asset --</option>
            {assets.map((a: any) => (
              <option key={a.assetID} value={a.assetID}>
                {a.name || `Asset #${a.assetID}`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={work.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="font-medium">Due Date</label>
          <input
            type="datetime-local"
            name="dueDate"
            value={work.dueDate}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="font-medium">Description</label>
          <textarea
            name="description"
            value={work.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows={4}
          ></textarea>
        </div>

        <div>
          <label className="font-medium">Status</label>
          <select
            name="status"
            value={work.status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value={0}>Pending</option>
            <option value={1}>In Progress</option>
            <option value={2}>Completed</option>
          </select>
        </div>

        <div>
          <label className="font-medium">Assigned User ID</label>
          <input
            type="number"
            name="assignedUserID"
            value={work.assignedUserID}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
        >
          Update Work
        </button>
      </form>
    </div>
  );
}
