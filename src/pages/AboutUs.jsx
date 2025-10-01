import React from "react";
import {
  Building2,
  Users,
  MapPin,
  Award,
  TrendingUp,
  Clock,
  Target,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import SectionHeading from "../components/SectionHeading";
import CountUp from "react-countup";

export default function AboutUs() {
  const stats = [
    { icon: <Building2 className="w-8 h-8 text-indigo-600" />, label: "Stores", value: 302 },
    { icon: <MapPin className="w-8 h-8 text-green-600" />, label: "States", value: 11 },
    { icon: <Users className="w-8 h-8 text-blue-600" />, label: "Customers", value: 5000000 },
    { icon: <Award className="w-8 h-8 text-yellow-600" />, label: "Employees", value: 10000 },
  ];

  const timeline = [
    {
      year: "2002",
      title: "Our Beginning",
      description: "Opened the first DMart store in Powai, Mumbai.",
      icon: <Star className="w-6 h-6 text-indigo-600" />,
    },
    {
      year: "2010",
      title: "Expansion",
      description: "Expanded rapidly across multiple states in India.",
      icon: <TrendingUp className="w-6 h-6 text-green-600" />,
    },
    {
      year: "2017",
      title: "Going Public",
      description: "Listed on the stock exchange, marking a major milestone.",
      icon: <Award className="w-6 h-6 text-yellow-600" />,
    },
    {
      year: "2023",
      title: "Today",
      description: "Over 300 stores serving millions of happy customers.",
      icon: <Clock className="w-6 h-6 text-blue-600" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12 space-y-16"
    >
      {/* Hero Section */}
      <section className="text-center">
        <SectionHeading title="About DMart" />
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          DMart is a one-stop supermarket chain that aims to offer customers a wide range 
          of basic home and personal products under one roof at affordable prices.
        </p>
      </section>

      {/* Mission, Vision, Values */}
      <section className="grid md:grid-cols-3 gap-8 text-center">
        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <Target className="w-12 h-12 mx-auto text-indigo-600 mb-4" />
          <h3 className="text-xl font-semibold">Our Mission</h3>
          <p className="text-gray-600 mt-2">
            To provide value for money and make quality products accessible to everyone.
          </p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <Star className="w-12 h-12 mx-auto text-green-600 mb-4" />
          <h3 className="text-xl font-semibold">Our Vision</h3>
          <p className="text-gray-600 mt-2">
            To be the most trusted and preferred retailer for families across India.
          </p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <Users className="w-12 h-12 mx-auto text-yellow-600 mb-4" />
          <h3 className="text-xl font-semibold">Our Values</h3>
          <p className="text-gray-600 mt-2">
            Customer focus, integrity, respect for individuals, and operational excellence.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section>
        <SectionHeading title="Our Journey" />
        <div className="relative border-l border-gray-200 dark:border-gray-700 max-w-3xl mx-auto">
          {timeline.map((item, index) => (
            <div key={index} className="mb-10 ml-6">
              <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-white rounded-full ring-8 ring-white">
                {item.icon}
              </span>
              <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
                {item.title} <span className="ml-2 text-sm text-gray-500">({item.year})</span>
              </h3>
              <p className="mb-4 text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section>
        <SectionHeading title="At a Glance" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
              <div className="flex justify-center mb-3">{stat.icon}</div>
              <h3 className="text-3xl font-bold text-indigo-600">
                <CountUp end={stat.value} duration={2.5} separator="," />
                {stat.label === "Customers" && "+"}
              </h3>
              <p className="text-gray-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
