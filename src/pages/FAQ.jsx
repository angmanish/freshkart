import React, { useState } from "react";
import { ChevronDown, Mail, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "../components/SectionHeading";

const faqs = [
  {
    question: "What is DMart?",
    answer:
      "DMart is a one-stop supermarket chain that offers customers a wide range of basic home and personal products under one roof.",
  },
  {
    question: "How can I order online?",
    answer:
      "You can order through the DMart website or mobile app. Simply browse products, add to cart, and proceed to checkout.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept credit cards, debit cards, UPI, net banking, and DMart wallet. Cash on Delivery may also be available in select locations.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order is placed, you can track its status in the 'My Orders' section on your account page.",
  },
  {
    question: "What is your return policy?",
    answer:
      "You can return most items within 7 days of delivery if they are unused and in original packaging. Some perishable items may not be eligible.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12"
    >
      {/* Heading */}
      <div className="text-center mb-8">
        <SectionHeading title="Frequently Asked Questions" />
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
          Find answers to the most common questions about DMart shopping,
          payments, delivery, and more.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8 relative">
        <Search className="absolute top-3 left-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search FAQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded-xl px-10 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto space-y-4">
        {filteredFaqs.length === 0 ? (
          <p className="text-center text-gray-500">No FAQs found.</p>
        ) : (
          filteredFaqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="border border-gray-200 rounded-xl shadow-sm bg-white overflow-hidden hover:shadow-lg transition-shadow"
            >
              <button
                className="w-full flex justify-between items-center px-6 py-4 text-left text-gray-800 font-medium focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <motion.span
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={20} className="text-gray-500" />
                </motion.span>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="px-6 pb-4 text-gray-600"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center">
        <SectionHeading title="Didn’t find your answer?" />
        <p className="mt-2 text-gray-600">
          Our support team is here to help you with any queries.
        </p>
        <a
          href="mailto:support@dmart.com"
          className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
        >
          <Mail size={20} /> Contact Support
        </a>
      </div>
    </motion.div>
  );
}
