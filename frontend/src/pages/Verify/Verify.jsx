import React, { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import './Verify.css';

const Verify = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { url, token } = useContext(StoreContext);

    useEffect(() => {
        const verifyPayment = async () => {
            const success = searchParams.get('success');
            const orderId = searchParams.get('orderId');

            if (!orderId) {
                console.error('No order ID found');
                navigate('/myorders');
                return;
            }

            try {
                // Get the stored pickup time
                const storedPickupTime = localStorage.getItem('pending_order_pickup_time');
                console.log('Stored pickup time:', storedPickupTime);

                const response = await axios.post(
                    `${url}/api/order/verify`,
                    {
                        orderId,
                        success,
                        pickup_time: storedPickupTime
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                console.log('Verification response:', response.data);

                // Clear the stored pickup time
                localStorage.removeItem('pending_order_pickup_time');

                // Store the order ID for feedback form
                if (success === 'true' && response.data.success) {
                    localStorage.setItem('lastOrderId', orderId);
                    navigate('/payment-success');
                } else {
                    navigate('/myorders');
                }
            } catch (error) {
                console.error('Error verifying payment:', error);
                navigate('/myorders');
            }
        };

        verifyPayment();
    }, [searchParams, navigate, url, token]);

    return (
        <div className="verify-container">
            <div className="verify-content">
                <div className="loading-ring">
                    <div></div><div></div><div></div><div></div>
                </div>
                <h2>Verifying Payment</h2>
                <p>Please wait while we process your payment...</p>
            </div>
        </div>
    );
};

export default Verify;