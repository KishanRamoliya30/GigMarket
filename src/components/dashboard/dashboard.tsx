"use client";

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import {
  WorkOutline,
  StarBorder,
  ChatBubbleOutline,
  ThumbUpAlt,
  Send,
  AccessTime,
  People,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const earningsData = [
  { month: "Jan", earnings: 800 },
  { month: "Feb", earnings: 1200 },
  { month: "Mar", earnings: 1600 },
  { month: "Apr", earnings: 900 },
  { month: "May", earnings: 1500 },
  { month: "Jun", earnings: 1800 },
];

const gigStatusData = [
  { name: "Active", value: 12 },
  { name: "Paused", value: 5 },
  { name: "Pending", value: 3 },
  { name: "Denied", value: 2 },
];

const topSkills = [
  { skill: "React", projects: 18 },
  { skill: "Next.js", projects: 12 },
  { skill: "Figma", projects: 9 },
  { skill: "Node.js", projects: 10 },
];

const recentProjects = [
  { title: "Landing Page Design", client: "Client A", status: "Completed" },
  { title: "E-commerce API", client: "Client B", status: "In Progress" },
  { title: "Portfolio Redesign", client: "Client C", status: "Pending" },
];

const COLORS = ["#34D399", "#60A5FA", "#FBBF24", "#F87171"];

const stats = [
  {
    title: "Total Orders",
    value: "120",
    icon: <WorkOutline className="text-3xl text-[#1DBF73]" />,
  },
  {
    title: "Total Reviews",
    value: "87",
    icon: <StarBorder className="text-3xl text-yellow-500" />,
  },
  {
    title: "Messages",
    value: "15",
    icon: <ChatBubbleOutline className="text-3xl text-blue-500" />,
  },
  {
    title: "Proposals Sent",
    value: "245",
    icon: <Send className="text-3xl text-indigo-500" />,
  },
  {
    title: "Avg. Response Time",
    value: "1.2h",
    icon: <AccessTime className="text-3xl text-pink-500" />,
  },
  {
    title: "Repeat Clients",
    value: "12",
    icon: <People className="text-3xl text-emerald-500" />,
  },
];


const DashboardHome = () => {
  return (
    <div className="p-5 md:p-10 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-gray-800 mb-8"
      >
        Dashboard Overview
      </motion.h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-4"
          >
            <div className="p-3 bg-gray-100 rounded-full">{stat.icon}</div>
            <div>
              <h4 className="text-lg font-medium text-gray-700">
                {stat.title}
              </h4>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Earnings Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-6 rounded-xl shadow-md h-[320px]"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Earnings Over Time
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={earningsData}>
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#1DBF73"
                strokeWidth={3}
              />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Gig Status Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-md h-[320px]"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Gig Status Breakdown
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gigStatusData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {gigStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top Skills in Demand */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-6 rounded-xl shadow-md h-[320px] mb-10"
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Top Skills in Demand
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topSkills}>
            <XAxis dataKey="skill" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="projects" fill="#60A5FA" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Projects */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-6 rounded-xl shadow-md mb-10"
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Recent Projects
        </h3>
        <ul className="divide-y divide-gray-200">
          {recentProjects.map((project, index) => (
            <li key={index} className="py-3 flex justify-between">
              <div>
                <p className="text-md font-medium text-gray-800">
                  {project.title}
                </p>
                <p className="text-sm text-gray-500">
                  Client: {project.client}
                </p>
              </div>
              <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700 capitalize  capitalize flex items-center justify-center">
                {project.status}
              </span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Client Satisfaction */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-6 rounded-xl shadow-md mb-10"
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
          <ThumbUpAlt className="text-green-500" />
          Client Satisfaction
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Positive Reviews: 92%</p>
            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
              <div className="h-full bg-green-400 w-[92%] transition-all duration-500"></div>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Repeat Clients: 70%</p>
            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
              <div className="h-full bg-blue-400 w-[70%] transition-all duration-500"></div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;
