import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./enrollPage.css";
const EnrollPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId } = location.state || {};
  const [course, setCourse] = useState(null);
  const [userDetails, setUserDetails] = useState({ name: "", email: "", paymentMethod: "" });
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [giftCode, setGiftCode] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [discountReason, setDiscountReason] = useState("");
  const [reviewingDiscount, setReviewingDiscount] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/courses/${courseId}`);
        if (response.data) {
          setCourse(response.data);
        } else {
          throw new Error("Course not found");
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourseDetails();
  }, [courseId]);
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUserDetails({ name: savedUser.name, email: savedUser.email, paymentMethod: "" });
    }
  }, []);
  const handleCouponChange = (e) => {
    setCoupon(e.target.value);
    setShowQuestionnaire(e.target.value === "LEARN50");
  };
  const applyDiscount = () => {
    if (!discountReason.trim()) {
      alert("⚠️ Please provide a reason for the discount.");
      return;
    }
    setReviewingDiscount(true);
    setTimeout(() => {
      setReviewingDiscount(false);
      setDiscount(50);
      alert("🎉 Discount Approved! $50 off applied.");
    }, 2000);
  };
  const handlePayment = () => {
    if (!userDetails.name || !userDetails.email || !userDetails.paymentMethod) {
      alert("⚠️ Please fill in all details before proceeding!");
      return;
    }
    setLoading(true);
    setStep(3);
    setTimeout(() => {
      localStorage.setItem(`enrolled_${courseId}`, "true");
      setConfirmationMessage("🎉 Payment successful! You are now enrolled.");
      setLoading(false);
      setStep(4);
    }, 3000);
  };
  const finalPrice = Math.max((course?.price || 0) - discount, 0);
  const handleGiftCourse = () => {
    const giftCodeGenerated = `GIFT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setGiftCode(giftCodeGenerated);
    alert(`Gift code generated: ${giftCodeGenerated}`);
  };
  const toggleChat = () => {
    setShowChat(!showChat);
  };
  if (!course) return <p className="loading">⏳ Loading course details...</p>;
  return (
    <div className="enroll-container">
      <h2>🔑 Enroll in {course.title}</h2>
      <div className="progress-bar">
        <div className={step >= 1 ? "step active" : "step"}>1️⃣ Details</div>
        <div className={step >= 2 ? "step active" : "step"}>2️⃣ Payment</div>
        <div className={step >= 3 ? "step active" : "step"}>3️⃣ Processing</div>
        <div className={step >= 4 ? "step active" : "step"}>✅ Confirmation</div>
      </div>
      {step === 1 && (
        <>
          <input
            type="text"
            placeholder="Enter your name"
            value={userDetails.name}
            onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Enter your email"
            value={userDetails.email}
            onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
          />
          <button onClick={() => setStep(2)}>Next ➡️</button>
        </>
      )}
      {step === 2 && (
        <>
          <div className="order-summary">
            <h3>💰 Price: <s>${course.price}</s> → <strong>${finalPrice}</strong></h3>
          </div>

          <select
            value={userDetails.paymentMethod}
            onChange={(e) => setUserDetails({ ...userDetails, paymentMethod: e.target.value })}
          >
            <option value="">Select Payment Method</option>
            <option value="credit-card">💳 Credit Card</option>
            <option value="paypal">💰 PayPal</option>
            <option value="bank-transfer">🏦 Bank Transfer</option>
            <option value="upi">📲 UPI</option>
            <option value="crypto">₿ Crypto</option>
          </select>
          <input
            type="text"
            placeholder="Enter Coupon Code (LEARN50)"
            value={coupon}
            onChange={handleCouponChange}
          />
          {showQuestionnaire && (
            <div className="discount-questionnaire">
              <p>❓ Why do you need this discount?</p>
              <textarea
                placeholder="Explain your reason..."
                value={discountReason}
                onChange={(e) => setDiscountReason(e.target.value)}
              />
              <button onClick={applyDiscount} disabled={reviewingDiscount}>
                {reviewingDiscount ? "Reviewing..." : "Submit & Apply Discount"}
              </button>
            </div>
          )}

          <button className="confirm-btn" onClick={handlePayment} disabled={loading}>
            {loading ? "Processing Payment..." : "Confirm & Pay"}
          </button>
        </>
      )}
      {step === 3 && <p className="loading">⏳ Processing Payment...</p>}
      {step === 4 && (
        <div className="confirmation">
          <h3>{confirmationMessage}</h3>
          <button onClick={() => navigate(`/course-details/${courseId}`)}>
            Go to Course 📚
          </button>
        </div>
      )}
      <button onClick={handleGiftCourse}>🎁 Gift This Course</button>
      {giftCode && <p>Your unique gift code is: <strong>{giftCode}</strong></p>}

      <button onClick={toggleChat}>💬 Chat with Support</button>
      {showChat && (
        <div className="live-chat">
          <h4>💬 Live Chat Support</h4>
          <p>How can we assist you?</p>
          <textarea placeholder="Type your question..." />
          <button>Send</button>
        </div>
      )}
    </div>
  );
};

export default EnrollPage;
