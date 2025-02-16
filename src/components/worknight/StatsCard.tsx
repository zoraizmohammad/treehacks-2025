
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtext?: string;
  subtextColor?: string;
  delay?: number;
}

const StatsCard = ({ icon: Icon, title, value, subtext, subtextColor = "text-gray-600", delay = 0 }: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
    >
      <div className="flex items-center gap-3 text-[#0066CC] mb-4">
        <Icon className="w-5 h-5" />
        <span className="font-medium">{title}</span>
      </div>
      <div className="space-y-1">
        <div className="text-4xl font-bold text-black">{value}</div>
        {subtext && <div className={subtextColor}>{subtext}</div>}
      </div>
    </motion.div>
  );
};

export default StatsCard;
