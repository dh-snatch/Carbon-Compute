const invokeUrl = "https://iu9fj463h9.execute-api.us-east-1.amazonaws.com/prod"; // the invoke URL for the deployed API gateway
// note this is not the actual URL, replace with your own from your deployed API gateway
// and don't commit your actual URL to a public repo


// user ID to store in local storage, to track users without a login system
let userId = localStorage.getItem('userId');
if (!userId) {
  userId = 'user-' + Math.random().toString(36).substring(2, 12);
  localStorage.setItem('userId', userId);
}

console.log(userId);



const conversionRate = {
  "Car Ride": 0.4, // made up values
  "Flight": 0.15,
  "Train Ride": 0.07
};





function convertCarbon() {
  const activity = document.getElementById("activity").value;
  const quantity = parseFloat(document.getElementById("quantity").value);

  const factor = conversionRate[activity];
  const carbon = quantity * factor;

  document.getElementById("output").textContent = `Your carbon: ${carbon} kg CO₂`;
  return carbon;
}

async function writeRecord() {
  const user_id = localStorage.getItem('userId');
  const activity = document.getElementById("activity").value;
  const quantity = parseFloat(document.getElementById("quantity").value);
  const carbon = convertCarbon();

  const resp = await fetch(invokeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "write", user_id, activity, quantity, carbon })
  });
  const data = await resp.json();
  document.getElementById("output").textContent = JSON.stringify(data, null, 2);

}

async function readRecords() {
  const user_id = localStorage.getItem('userId');

  const resp = await fetch(invokeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "read", user_id })
  });


  const data = await resp.json();
  document.getElementById("output").textContent = JSON.stringify(data, null, 2);

}