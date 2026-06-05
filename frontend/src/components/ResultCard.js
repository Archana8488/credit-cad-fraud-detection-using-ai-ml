import Alert from 'react-bootstrap/Alert';

function ResultCard({result}){

if(!result) return null;

return(

<Alert
variant={
result.prediction==="Fraud"
?"danger"
:"success"
}
className="mt-4"
>

<h4>{result.prediction}</h4>

<p>
Amount:
₹{result.amount}
</p>

<p>
Probability:
{result.fraud_probability}%
</p>

<p>
Risk:
{result.risk_level}
</p>

</Alert>

)
}

export default ResultCard;