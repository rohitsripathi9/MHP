import React, { JSX } from "react";
import Carousel from "rc-infinite-carousel";
import "rc-infinite-carousel/dist/index.css";
import "./Testimonial.css"; // Your custom CSS for styling

// Define the type for a testimonial item
interface TestimonialItem {
  id: number;
  name: string;
  review: string;
  rating: number;
  picture: string; // URL or path to the image
}

// Testimonials Data with Ratings and Pictures
const testimonials: TestimonialItem[] = [
  {
    id: 1,
    name: "Pranathi",
    review: "Arey wah! Jo bhi is website ka creator hai, dil jeet liya aapne! ",
    rating: 5,
    picture: "/u2.png", // Example image URL
  },
  {
    id: 2,
    name: "Bruce Wayne",
    review: "Crowds used to be my enemy. But this website… this website is my hero. No more waiting. Food that’s fresh, service that’s fast",
    rating: 4,
    picture: "/u7.png", // Example image URL
  },
  {
    id: 3,
    name: "Sri Raj ",
    review: "క్లాస్ కి ముందు ఆర్డర్ పెట్టా… క్లాస్ అయిపోగానే ఫుడ్ రెడీ! ఇలాగే నా అసైన్‌మెంట్స్ కూడా ఎవరో తయారు చేసేస్తే బాగుండేది!",
    rating: 5,
    picture: "/u4.png", // Example image URL
  },
  {
    id: 4,
    name: "Tejaswi",
    review: "My lunch break now actually feels like a break! So glad I don’t have to worry about canteen queues anymore!",
    rating: 4,
    picture: "/u5.png", // Example image URL
  },
  {
    id: 5,
    name: "Sai Teja",
    review: "Some heroes wear capes, others write code. To the one who built this websit your work is legendary. ",
    rating: 5,
    picture: "/u6.png", // Example image URL
  },
];

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => {
  const stars: JSX.Element[] = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        style={{
          color: i <= rating ? "#ffc107" : "#e4e5e9", // Gold for filled stars, gray for empty
          fontSize: "1.5rem",
          margin: "0 2px",
        }}
      >
        ★
      </span>
    );
  }
  return <div>{stars}</div>;
};

// Main Testimonial Component
const Testimonial = () => {
  // Update the renderItem function to match the expected signature
  const renderItem = ({ item, index }: { item: TestimonialItem; index: number }) => (
    <div className="testimonial-item" key={index}>
      {/* Picture above the text */}
      <img
        src={item.picture}
        alt={item.name}
        className="testimonial-picture"
      />
      {/* Name and Review */}
      <h3 className="testimonial-name">{item.name}</h3>
      <p className="testimonial-review">{item.review}</p>
      {/* Rating below the text */}
      <StarRating rating={item.rating} />
    </div>
  );

  return (
    <section className="testimonial-section" id="testimonial-section">
      <h2 className="testimonial-heading">What Our Customers Say</h2>
      <p className="testimonial-subheading">
        Check out what our customers have to say about us!
      </p>
      <Carousel<TestimonialItem> // Explicitly type the Carousel component
        data={testimonials}
        renderItem={renderItem}
        animationDuration={10} // Adjust the speed of the carousel
        direction="LEFT" // Scroll direction
        showMask={true} // Enable mask for a fading effect
        pauseOnHover={true} // Pause on hover
      />
    </section>
  );
};

export default Testimonial;