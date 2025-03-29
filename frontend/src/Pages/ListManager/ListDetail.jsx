import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";


///
const ListDetail = () => {
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [editingItem, setEditingItem] = useState(null);
  const [editItemData, setEditItemData] = useState({ Item_name: "", qty: "" });

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchList = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/list/${id}`);
        setList(response.data.list);
      } catch (error) {
        console.error("Error fetching list details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, [id]);

  const handleDelete = async (itemId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/list/${id}/items/${itemId}`
      );
      if (response.status === 200) {
        setList((prevList) => ({
          ...prevList,
          items: prevList.items.filter((item) => item._id !== itemId),
        }));
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item._id);
    setEditItemData({ Item_name: item.Item_name, qty: item.qty.toString() });
  };

  const handleSaveEdit = async (itemId) => {
    try {
      const updatedData = {
        ...editItemData,
        qty: parseInt(editItemData.qty, 10),
      };

      const response = await axios.put(
        `http://localhost:5000/api/list/${id}/items/${itemId}`,
        updatedData
      );

      if (response.status === 200) {
        setList((prevList) => ({
          ...prevList,
          items: prevList.items.map((item) =>
            item._id === itemId ? { ...item, qty: updatedData.qty } : item
          ),
        }));
        setEditingItem(null);
        alert("Item updated successfully!");
      }
    } catch (error) {
      console.error("Error updating item:", error.response?.data || error.message);
      alert("Failed to update item.");
    }
  };

  const handleBack = () => {
    navigate("/viewgrocerylist"); // Navigate back to ViewList page
  };

  if (loading) return <p>Loading...</p>;
  if (!list) return <p>No list found.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-8">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-t-2xl">
          <h2 className="text-3xl font-bold text-white">{list.listName}</h2>
          <p className="text-blue-100 mt-1">View and manage the items in this list</p>
        </div>

        <div className="p-8">
          {/* Add Back Button */}
          <button
            onClick={handleBack}
            className="bg-gray-500 text-white px-4 py-2 rounded mb-6"
          >
            Back
          </button>

          {list.items.length === 0 ? (
            <p className="text-center text-gray-600">No items found in this list.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 text-md">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
                      ITEM NUMBER
                    </th>
                    <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
                      Item Name
                    </th>
                    <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {list.items.map((item, index) => (
                    <tr
                      key={item._id}
                      className="hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 cursor-pointer transition-all"
                    >
                      <td className="px-6 py-4 text-center text-gray-600">{index + 1}</td>
                      <td className="px-6 py-4 text-center text-gray-600">
                        {editingItem === item._id ? (
                          <input
                            type="text"
                            value={editItemData.Item_name}
                            onChange={(e) =>
                              setEditItemData({ ...editItemData, Item_name: e.target.value })
                            }
                            className="border p-1 rounded w-full"
                          />
                        ) : (
                          item.Item_name
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600">
                        {editingItem === item._id ? (
                          <input
                            type="number"
                            value={editItemData.qty}
                            onChange={(e) =>
                              setEditItemData({ ...editItemData, qty: e.target.value })
                            }
                            className="border p-1 rounded w-full"
                          />
                        ) : (
                          item.qty
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {editingItem === item._id ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(item._id)}
                              className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingItem(null)}
                              className="bg-gray-500 text-white px-3 py-1 rounded"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(item)}
                              className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListDetail;
