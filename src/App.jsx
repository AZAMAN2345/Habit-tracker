import { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Calendar, TrendingUp } from 'lucide-react';

function App() {
  const [habits, setHabits] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Health');

  const categories = ['Health', 'Productivity', 'Learning', 'Fitness', 'Mindfulness'];
  const categoryColors = {
    Health: 'bg-green-500',
    Productivity: 'bg-blue-500',
    Learning: 'bg-purple-500',
    Fitness: 'bg-orange-500',
    Mindfulness: 'bg-pink-500'
  };

  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = () => {
    if (newHabitName.trim()) {
      const newHabit = {
        id: Date.now(),
        name: newHabitName,
        category: selectedCategory,
        completedDates: [],
        createdAt: new Date().toISOString()
      };
      setHabits([...habits, newHabit]);
      setNewHabitName('');
      setShowAddForm(false);
    }
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const toggleHabitToday = (id) => {
    const today = new Date().toDateString();
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const isCompletedToday = habit.completedDates.includes(today);
        return {
          ...habit,
          completedDates: isCompletedToday
            ? habit.completedDates.filter(d => d !== today)
            : [...habit.completedDates, today]
        };
      }
      return habit;
    }));
  };

  const getStreak = (completedDates) => {
    if (completedDates.length === 0) return 0;
    
    const dates = completedDates.map(d => new Date(d)).sort((a, b) => b - a);
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let date of dates) {
      date.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const isCompletedToday = (completedDates) => {
    const today = new Date().toDateString();
    return completedDates.includes(today);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">🎯 Habit Tracker</h1>
              <p className="text-gray-600">Build better habits, one day at a time</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition duration-200 transform hover:scale-105"
            >
              <Plus size={20} />
              Add Habit
            </button>
          </div>
        </div>

        
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Create New Habit</h3>
            <input
              type="text"
              placeholder="Habit name (e.g., Morning Exercise)"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addHabit()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      selectedCategory === cat
                        ? `${categoryColors[cat]} text-white`
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={addHabit}
                className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg font-semibold transition"
              >
                Create Habit
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewHabitName('');
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

       
        {habits.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow p-5">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Calendar className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Habits</p>
                  <p className="text-2xl font-bold text-gray-800">{habits.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-5">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Check className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Completed Today</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {habits.filter(h => isCompletedToday(h.completedDates)).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-5">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <TrendingUp className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Best Streak</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {Math.max(0, ...habits.map(h => getStreak(h.completedDates)))} days
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        
        {habits.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No habits yet</h3>
            <p className="text-gray-600 mb-6">Start building better habits by creating your first one!</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition"
            >
              <Plus size={20} />
              Create Your First Habit
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {habits.map(habit => {
              const streak = getStreak(habit.completedDates);
              const completed = isCompletedToday(habit.completedDates);
              const completionRate = habit.completedDates.length > 0
                ? Math.round((habit.completedDates.length / Math.ceil((new Date() - new Date(habit.createdAt)) / (1000 * 60 * 60 * 24))) * 100)
                : 0;

              return (
                <div
                  key={habit.id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <button
                        onClick={() => toggleHabitToday(habit.id)}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
                          completed
                            ? 'bg-green-500 hover:bg-green-600 scale-110'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        <Check
                          size={28}
                          className={completed ? 'text-white' : 'text-gray-400'}
                        />
                      </button>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800">{habit.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`${categoryColors[habit.category]} text-white text-xs px-3 py-1 rounded-full font-medium`}>
                            {habit.category}
                          </span>
                          <span className="text-gray-600 text-sm">
                            🔥 {streak} day streak
                          </span>
                          {completionRate > 0 && (
                            <span className="text-gray-600 text-sm">
                              📊 {completionRate}% completion
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;