import { FlaskConical, Droplet, Leaf, BadgeCheck, ShieldCheck, Gem } from "lucide-react";

const features = [
  { icon: <FlaskConical size={36} className="text-yellow-600" />, label: "LAB TESTED" },
  { icon: <Droplet size={36} className="text-yellow-600" />, label: "MINERAL OIL FREE" },
  { icon: <Droplet size={36} className="text-yellow-600" />, label: "ALCOHOL FREE" },
  { icon: <Leaf size={36} className="text-yellow-600" />, label: "100% NATURAL" },
  { icon: <BadgeCheck size={36} className="text-yellow-600" />, label: "GMP CERTIFIED" },
  { icon: <ShieldCheck size={36} className="text-yellow-600" />, label: "AYUSH APPROVED" },
];

const FeaturesSection = () => (
  <section className="w-full py-8 flex flex-col items-center p-[10px]">
    <div className="container mx-auto px-4">
      <div className="bg-[#faf6f1] rounded-lg py-8 px-4 w-full">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-6 w-full">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className="mb-2">{feature.icon}</div>
              <span className="font-semibold text-sm md:text-base text-gray-800">{feature.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default FeaturesSection; 