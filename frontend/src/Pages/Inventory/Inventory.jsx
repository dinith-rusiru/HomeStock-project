import { useEffect, useState } from "react";
import axios from "axios";

const URL = "http://localhost:5000/gshoppers";
const REMINDERS_KEY = "inventory-reminders";

function Inventory() {
  const [gshoppers, setGshoppers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [currentReminder, setCurrentReminder] = useState({
    itemId: "",
    itemName: "",
    message: "",
    date: "",
    completed: false,
  });

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const response = await axios.get(URL);
        setGshoppers(
          response.data.gshoppers.map((item) => ({
            ...item,
            qty: item.qty || 0,
            importantlevel: item.importantlevel || 0,
          }))
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
      }
    };

    // Load reminders from localStorage
    const savedReminders = localStorage.getItem(REMINDERS_KEY);
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }

    fetchHandler();
  }, []);

  // Save reminders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
  }, [reminders]);

  // Add body class to prevent scrolling when modal is open
  useEffect(() => {
    if (showReminderModal) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [showReminderModal]);

  // Define the quantity limits for each importance level
  const importanceLimits = {
    1: 2, // low
    2: 3,  // medium
    3: 4,  // high
    4: 6,  // critical
    5: 7,  // highest priority
  };

  // Function to check if the item quantity is below the limit
  const isBelowLimit = (item) => {
    const importanceLevel = item.importantlevel || 0;
    const limit = importanceLimits[importanceLevel] || 0;
    return item.qty < limit;
  };

  // Function to determine the badge style based on the importance level
  const badgeStyle = (importanceLevel) => {
    switch (importanceLevel) {
      case 5:
        return "bg-red-500 text-xl px-4 py-2"; // very large for highest priority
      case 4:
        return "bg-red-400 text-lg px-3 py-2"; // large for critical
      case 3:
        return "bg-orange-400 text-md px-3 py-1"; // medium for high
      case 2:
        return "bg-yellow-500 text-md px-2 py-1"; // smaller for medium
      case 1:
        return "bg-yellow-300 text-md px-2 py-1";
      default:
        return "bg-green-400 text-sm px-2 py-1"; // small for low
    }
  };

  // Function to check if an item is expiring within the next 5 days
  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const timeDifference = expiry - today;
    const daysUntilExpiry = timeDifference / (1000 * 3600 * 24); // Convert milliseconds to days
    return daysUntilExpiry <= 5 && daysUntilExpiry >= 0;
  };

  // Function to open the reminder modal for a specific item
  const openReminderModal = (item) => {
    setCurrentReminder({
      itemId: item._id,
      itemName: item.name,
      message: "",
      date: new Date().toISOString().slice(0, 10),
      completed: false,
    });
    setShowReminderModal(true);
  };

  // Function to add a new reminder
  const addReminder = () => {
    if (!currentReminder.message || !currentReminder.date) {
      alert("Please fill in all fields");
      return;
    }

    const newReminder = {
      ...currentReminder,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setReminders([...reminders, newReminder]);
    setShowReminderModal(false);
    setCurrentReminder({
      itemId: "",
      itemName: "",
      message: "",
      date: "",
      completed: false,
    });
  };

  // Function to toggle completion status of a reminder
  const toggleReminderCompletion = (reminderId) => {
    const updatedReminders = reminders.map((reminder) =>
      reminder.id === reminderId
        ? { ...reminder, completed: !reminder.completed }
        : reminder
    );
    setReminders(updatedReminders);
  };

  // Function to delete a reminder
  const deleteReminder = (reminderId) => {
    const updatedReminders = reminders.filter(
      (reminder) => reminder.id !== reminderId
    );
    setReminders(updatedReminders);
  };

  // Function to check if an item has active reminders
  const hasActiveReminders = (itemId) => {
    return reminders.some(
      (reminder) => reminder.itemId === itemId && !reminder.completed
    );
  };

  // Function to get item reminders
  const getItemReminders = (itemId) => {
    return reminders.filter((reminder) => reminder.itemId === itemId);
  };

  // Check if a reminder is due (today or past)
  const isReminderDue = (reminderDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(reminderDate);
    date.setHours(0, 0, 0, 0);
    return date <= today;
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  // Group items by category
  const categorizedItems = gshoppers.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  // Calculate total active reminders
  const totalActiveReminders = reminders.filter(
    (reminder) => !reminder.completed
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-white">Inventory</h2>
                <p className="text-blue-100 mt-1">Manage and track your home essentials</p>
              </div>
              <div className="flex items-center">
                <div className="mr-4 bg-white px-3 py-1 rounded-full flex items-center">
                  <span className="text-indigo-600 font-semibold mr-2">Reminders:</span>
                  <span className="bg-indigo-600 text-white px-2 py-1 rounded-full text-sm font-bold">
                    {totalActiveReminders}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Reminders Section */}
          {reminders.length > 0 && (
            <div className="p-4 bg-indigo-50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold text-gray-800">Active Reminders</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reminders
                  .filter((reminder) => !reminder.completed)
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .slice(0, 3)
                  .map((reminder) => (
                    <div
                      key={reminder.id}
                      className={`p-3 rounded-lg shadow-sm flex justify-between items-start ${
                        isReminderDue(reminder.date)
                          ? "bg-red-100 border-l-4 border-red-500"
                          : "bg-blue-100 border-l-4 border-blue-500"
                      }`}
                    >
                      <div>
                        <div className="font-medium text-gray-800">{reminder.itemName}</div>
                        <div className="text-sm text-gray-600">{reminder.message}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(reminder.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex">
                        <button
                          onClick={() => toggleReminderCompletion(reminder.id)}
                          className="text-green-600 hover:text-green-800 mr-2"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => deleteReminder(reminder.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
              {totalActiveReminders > 3 && (
                <div className="mt-2 text-right">
                  <button
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    onClick={() => {
                      /* Implement a view to see all reminders */
                      alert("View all reminders functionality would go here");
                    }}
                  >
                    View all {totalActiveReminders} reminders
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="p-8">
            {Object.keys(categorizedItems).map((category) => (
              <div key={category} className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
                  {category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {categorizedItems[category].map((item) => (
                    <div
                      key={item._id}
                      className="bg-white shadow-md rounded-xl p-4 relative"
                    >
                      {/* Low Stock Notification Badge - UPDATED: Removed the !isExpiringSoon condition */}
                      {isBelowLimit(item) && (
                        <div className={`absolute -top-2 -right-2 text-white font-bold rounded-full ${badgeStyle(item.importantlevel)} shadow-lg`}>
                          Low Stock!
                        </div>
                      )}

                      {/* Expiring Soon Notification */}
                      {isExpiringSoon(item.expdate) && (
                        <div className="absolute -bottom-2 -left-2 text-white font-bold rounded-full bg-green-500 text-xs px-3 py-1 shadow-lg">
                          Expiring Soon!
                        </div>
                      )}

                      {/* Reminder Indicator */}
                      {hasActiveReminders(item._id) && (
                        <div className="absolute -top-2 left-2 text-white font-bold rounded-full bg-indigo-500 text-xs px-2 py-1 shadow-lg">
                          Reminder
                        </div>
                      )}

                      <h4 className="text-lg font-semibold text-gray-700">{item.name}</h4>
                      <p className="text-gray-600">Quantity: {item.qty}</p>
                      {/* UPDATED: Removed conditional, always show importance level */}
                      <p className="text-gray-600">Importance: {item.importantlevel || "N/A"}</p>
                      <p className="text-gray-600">
                        Expiry: {item.expdate ? new Date(item.expdate).toISOString().split("T")[0] : "N/A"}
                      </p>

                      {/* Item Reminders Section */}
                      {getItemReminders(item._id).length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-2">Reminders:</p>
                          {getItemReminders(item._id)
                            .sort((a, b) => new Date(a.date) - new Date(b.date))
                            .map((reminder) => (
                              <div
                                key={reminder.id}
                                className={`text-xs p-2 mb-2 rounded ${
                                  reminder.completed
                                    ? "bg-gray-100 line-through text-gray-500"
                                    : isReminderDue(reminder.date)
                                    ? "bg-red-100"
                                    : "bg-blue-100"
                                }`}
                              >
                                <div className="flex justify-between">
                                  <span>{reminder.message}</span>
                                  <div className="flex">
                                    <button
                                      onClick={() => toggleReminderCompletion(reminder.id)}
                                      className="text-green-600 hover:text-green-800 ml-2"
                                    >
                                      ✓
                                    </button>
                                    <button
                                      onClick={() => deleteReminder(reminder.id)}
                                      className="text-red-600 hover:text-red-800 ml-1"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                </div>
                                <div className="mt-1">
                                  {new Date(reminder.date).toLocaleDateString()}
                                </div>
                              </div>
                            ))}
                        </div>
                      )}

                      {/* Add Reminder Button */}
                      <button
                        onClick={() => openReminderModal(item)}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-medium py-1 mt-3 px-2 rounded text-xs flex items-center justify-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Reminder
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reminder Modal with Blurred Background */}
      {showReminderModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
          {/* Blurred backdrop */}
          <div className="absolute inset-0 backdrop-blur-md bg-opacity-30"></div>
          
          {/* Modal content */}
          <div className="relative bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4 z-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Add Reminder for {currentReminder.itemName}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reminder Message
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Buy more of this item"
                value={currentReminder.message}
                onChange={(e) =>
                  setCurrentReminder({
                    ...currentReminder,
                    message: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reminder Date
              </label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={currentReminder.date}
                onChange={(e) =>
                  setCurrentReminder({
                    ...currentReminder,
                    date: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
                onClick={() => setShowReminderModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors"
                onClick={addReminder}
              >
                Add Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;