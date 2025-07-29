export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          What Our Users Say
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-10">
          Hear from real students and professionals who used Career Compass to
          shape their journey.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TestimonialCard
            imgSrc="/src/assets/testimonials/pic1.jpeg"
            name="John Doe"
            text="Career Compass helped me discover new roles that truly fit my skills."
          />
          <TestimonialCard
            imgSrc="/src/assets/testimonials/pic2.jpeg"
            name="Jane Smith"
            text="The personalized guidance made my career switch smooth and successful."
          />
          <TestimonialCard
            imgSrc="/src/assets/testimonials/pic3.jpeg"
            name="Rahul Kumar"
            text="Loved the progress tracking – kept me motivated throughout."
          />
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ imgSrc, name, text }) {
  return (
    <div className="relative bg-white border border-gray-200 rounded-xl p-6 shadow hover:shadow-lg transition duration-300 text-left">
      {/* subtle gradient top border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-400 rounded-t-xl" />

      <div className="flex items-center gap-4 mb-4">
        <img
          src={imgSrc}
          alt={name}
          className="w-14 h-14 rounded-full object-cover ring-2 ring-green-500"
        />
        <div className="font-semibold text-gray-900">{name}</div>
      </div>

      <p className="text-gray-600 text-sm leading-relaxed italic">"{text}"</p>
    </div>
  );
}
