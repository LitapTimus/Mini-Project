import { FiChevronDown } from "react-icons/fi";

export default function ArrowScroll() {
  return (
    <div className="flex justify-center mt-2 bg-[#f9fafb]">
      <button
        onClick={() =>
          document
            .getElementById("stats")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        className="text-gray-400 hover:text-gray-600 text-4xl animate-bounce"
      >
        <FiChevronDown />
      </button>
    </div>
  );
}
