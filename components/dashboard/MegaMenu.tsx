"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Home,
  LayoutDashboard,
  Settings,
  Wrench,
  BarChart,
  FileText,
  HelpCircle,
  LifeBuoy,
  Mail,
  User,
  UserCircle,
  CreditCard,
  Bell,
  LogOut,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"

// Sample data for quick access items (moved here for self-containment)
const quickAccessItems = [
  {
    category: "General",
    color: "from-blue-500 to-blue-600",
    icon: Home,
    items: [
      { title: "Dashboard", href: "#", description: "View your main dashboard.", icon: LayoutDashboard },
      { title: "Settings", href: "#", description: "Adjust your account settings.", icon: Settings },
    ],
  },
  {
    category: "Tools",
    color: "from-green-500 to-green-600",
    icon: Wrench,
    items: [
      { title: "Analytics", href: "#", description: "Access your data insights.", icon: BarChart },
      { title: "Reports", href: "#", description: "Generate custom reports.", icon: FileText, badge: "New" },
    ],
  },
  {
    category: "Support",
    color: "from-yellow-500 to-yellow-600",
    icon: HelpCircle,
    items: [
      { title: "Help Center", href: "#", description: "Find answers to common questions.", icon: LifeBuoy },
      { title: "Contact Us", href: "#", description: "Get in touch with support.", icon: Mail },
    ],
  },
  {
    category: "Account",
    color: "from-red-500 to-red-600",
    icon: User,
    items: [
      { title: "Profile", href: "#", description: "Manage your personal profile.", icon: UserCircle },
      { title: "Billing", href: "#", description: "View your billing information.", icon: CreditCard },
      { title: "Notifications", href: "#", description: "Manage your notifications.", icon: Bell },
      { title: "Logout", href: "#", description: "Sign out of your account.", icon: LogOut },
    ],
  },
]

export function MegaMenu() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div
      className="relative hidden lg:flex h-full items-center z-[10000]" // Added z-50 here for the entire menu container
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Trigger Button */}
      <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-xs shadow-purple-200 font-inter font-medium rounded-sm text-xs transition-colors duration-300">
        <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
          <Plus className="h-4 w-4" />
        </motion.div>
        Quick Access
      </button>

      {/* Mega Menu Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 p-6 rounded-lg shadow-lg bg-white border border-gray-200 !z-[1000000] w-[950px]" 
          >
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 !z-[1000000]">
              {quickAccessItems.map((category) => (
                <div key={category.category} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r ${category.color} text-white shadow-md`}
                    >
                      <category.icon className="h-4 w-4" />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 font-inter">{category.category}</h4>
                  </div>
                  <div className="space-y-2">
                    {category.items.map((item) => (
                      <motion.a
                        key={item.title}
                        href={item.href}
                        className="group block select-none space-y-2 rounded-xl p-4 leading-none no-underline outline-none transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 hover:shadow-md focus:bg-purple-50 focus:shadow-md border border-transparent hover:border-purple-200"
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <item.icon className="h-4 w-4 text-purple-600 group-hover:text-purple-700" />
                            <div className="text-sm font-medium text-gray-900 group-hover:text-purple-700">
                              {item.title}
                            </div>
                          </div>
                          {item.badge && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs leading-relaxed text-gray-600 group-hover:text-gray-700">
                          {item.description}
                        </p>
                      </motion.a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
