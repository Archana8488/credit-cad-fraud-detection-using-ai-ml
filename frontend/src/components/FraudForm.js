import { useState } from 'react';
import axios from 'axios';

function FraudForm({ onResult }) {

  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {

    e.preventDefault();

    const features = new Array(30).fill(0);

    features[29] = Number(amount);

    try {

      const response = await axios.post(
        'http://127.0.0.1:5000/predict',
        {
          features
        }
      );

      onResult(response.data);

    } catch (err) {

      alert('API Error');

      console.error(err);
    }
  };

  return (

    <form onSubmit={handleSubmit}>

      <div className="mb-3">

        <label className="form-label">
          Transaction Amount
        </label>

        <input
          type="number"
          className="form-control"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
          required
        />

      </div>
<></>


      <button
        className="btn btn-primary"
        type="submit"
      >
        Check Transaction
      </button>

    </form>
  );
}

export default FraudForm;