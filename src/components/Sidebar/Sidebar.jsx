import { useTheme } from "../ThemeProvider";
import "./Sidebar.css";

// Sidebar Component
const Sidebar = ({ sidebar, category, setCategory }) => {
  const { isDarkMode } = useTheme();

  const categories = [
    {
      id: 0,
      name: "Home",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      id: 20,
      name: "Gaming",
      icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z",
    },
    { id: 2, name: "Autombiles", icon: "M5 13l4 4L19 7" },
    {
      id: 17,
      name: "Sports",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    },
    {
      id: 24,
      name: "Entertainment",
      icon: "M7 4V20M17 4V20M3 8H7M17 8H21M3 12H21M3 16H7M17 16H21",
    },
    {
      id: 28,
      name: "Technology",
      icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z",
    },
    {
      id: 10,
      name: "Music",
      icon: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3",
    },
    {
      id: 22,
      name: "Blogs",
      icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    },
    {
      id: 25,
      name: "News",
      icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
    },
  ];

  const subscribedChannels = [
    {
      name: "Awiby Channel",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    {
      name: "Elzero Web",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    {
      name: "CodeZile",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    {
      name: "Satr",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    {
      name: "PewD",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-极z",
    },
  ];

  return (
    <div
      className={`bg-white dark:bg-gray-900 h-screen md:overflow-y-auto pb-20 ${
        sidebar ? "w-48" : "w-14"
      } transition-all duration-300 fixed top-14 md:top-16 z-40 no-scrollbar`}
    >
      <div className="p-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`flex items-center p-2 rounded-lg cursor-pointer mb-1 ${
              category === cat.id
                ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            onClick={() => setCategory(cat.id)}
            title={cat.name}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={cat.icon}
              />
            </svg>
            {sidebar && <span className="ml-3 text-sm">{cat.name}</span>}
          </div>
        ))}

        {sidebar && (
          <>
            <hr className="border-gray-200 dark:border-gray-700 my-3" />
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 px-2 mb-2 text-sm">
              Subscribed
            </h3>
          </>
        )}

        {subscribedChannels.map((channel, index) => (
          <div
            key={index}
            className="flex items-center p-2 rounded-lg cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 mb-1"
            onClick={() => setCategory(0)}
            title={channel.name}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={channel.icon}
              />
            </svg>
            {sidebar && (
              <span className="ml-3 text-sm truncate">{channel.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
