import React from 'react';
import { useNavigate } from 'react-router-dom';

const Thankyou = () => {

    const navigate = useNavigate();

    const handleDashboardRedirect = () => {
        navigate('/partnerpage'); // Redirect to the dashboard or any desired page
    };


  return (
    <div>
        <div className="section-thankyou-page">
        <div className="container">
          <div className="row">
            <div className="col-md-6 offset-md-3">
              <div className="form-card">
                <div className="smile-icon"><i class="bi bi-emoji-heart-eyes"></i></div>
              <h1>Thank You for Joining as a Service Partner!</h1>
            <p>
                Your details have been successfully submitted. Our team will review your information and get back to you soon.
            </p>
            <p>If you have any questions, feel free to contact us at <a href='#'>support@example.com.</a></p>
            <button className="btn btn-primary btn-thank-you"
                onClick={handleDashboardRedirect} 
                
            >
                Go to Page
            </button>
              </div>
            </div>
            </div>
            
        </div>
        </div>
    </div>
  )
}

export default Thankyou